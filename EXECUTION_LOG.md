# 社区帖子数据库设置记录

## 设置步骤

### ✅ 1. 运行设置脚本
```bash
node setup-community-posts.js
```
**状态**: 已完成  
**时间**: 2025-11-21  
**输出**: SQL 脚本已生成完成

### ⏳ 2. 复制 SQL 到 Supabase Dashboard 执行

**需要执行的 SQL 内容** (从 setup-community-posts.js 输出中获取):

```sql
-- 更新 community_posts 表以支持标签
-- 为社区帖子表添加标签和评论统计字段

-- 添加标签字段
ALTER TABLE community_posts 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS author VARCHAR(100) DEFAULT '匿名用户';

-- 为新增字段添加索引
CREATE INDEX IF NOT EXISTS idx_community_posts_tags ON community_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_community_posts_comments_count ON community_posts(comments_count DESC);

-- 更新现有数据的默认值
UPDATE community_posts 
SET author = '管理员' 
WHERE author IS NULL OR author = '';

UPDATE community_posts 
SET comments_count = 0 
WHERE comments_count IS NULL;

-- 创建用于搜索标签的函数
CREATE OR REPLACE FUNCTION search_posts_by_tags(tag_names TEXT[])
RETURNS TABLE (
    id UUID,
    user_id UUID,
    title VARCHAR(255),
    content TEXT,
    category VARCHAR(100),
    tags TEXT[],
    likes_count INTEGER,
    views_count INTEGER,
    comments_count INTEGER,
    author VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cp.id,
        cp.user_id,
        cp.title,
        cp.content,
        cp.category,
        cp.tags,
        cp.likes_count,
        cp.views_count,
        cp.comments_count,
        cp.author,
        cp.created_at,
        cp.updated_at
    FROM community_posts cp
    WHERE cp.tags && tag_names  -- 使用数组重叠操作符
    ORDER BY cp.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 插入一些示例帖子数据
INSERT INTO community_posts (
    title, 
    content, 
    category, 
    tags, 
    author,
    likes_count,
    views_count,
    comments_count,
    user_id
) VALUES 
(
    'Vue 3 学习心得分享',
    '最近学习了 Vue 3 的新特性，特别是 Composition API 让我觉得代码组织更加清晰了。想和大家分享一些学习心得和遇到的问题。',
    '前端开发',
    ARRAY['前端开发', 'Vue3', '学习经验'],
    'Vue学习者',
    5,
    128,
    3,
    (SELECT id FROM users WHERE username = 'admin' LIMIT 1)
),
(
    'TypeScript 类型体操入门指南',
    'TypeScript 的类型系统真的很强大，但也是很多初学者的难点。今天我来分享一些 TypeScript 类型系统的基础知识和实用技巧。',
    '前端开发',
    ARRAY['TypeScript', '前端开发', '教程'],
    'TS爱好者',
    8,
    256,
    7,
    (SELECT id FROM users WHERE username = 'teacher1' LIMIT 1)
),
(
    '算法学习路线推荐',
    '作为一个刚入门算法的同学，想和大家分享一下我学习算法的路线和一些好的学习资源。',
    '算法与数据结构',
    ARRAY['算法', '学习路线', '数据结构'],
    '算法小白',
    12,
    342,
    15,
    (SELECT id FROM users WHERE username = 'student1' LIMIT 1)
),
(
    '从零开始搭建 Node.js 项目的经验',
    '最近从零开始搭建了一个 Node.js 后端项目，遇到了不少坑，总结了一些经验分享给大家。',
    '后端开发',
    ARRAY['Node.js', '后端开发', '项目经验'],
    '后端新手',
    6,
    189,
    4,
    (SELECT id FROM users WHERE username = 'admin' LIMIT 1)
)
ON CONFLICT DO NOTHING;

-- 创建热门标签统计函数
CREATE OR REPLACE FUNCTION get_popular_tags(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    tag_name TEXT,
    post_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        UNNEST(tags) as tag_name,
        COUNT(*) as post_count
    FROM community_posts
    WHERE tags IS NOT NULL AND array_length(tags, 1) > 0
    GROUP BY tag_name
    ORDER BY post_count DESC, tag_name ASC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 创建更新评论计数的触发器函数
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE community_posts 
        SET comments_count = comments_count + 1
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE community_posts 
        SET comments_count = GREATEST(comments_count - 1, 0)
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 为评论表创建触发器
DROP TRIGGER IF EXISTS update_comments_count_trigger ON post_comments;
CREATE TRIGGER update_comments_count_trigger
    AFTER INSERT OR DELETE ON post_comments
    FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

-- 更新 RLS 策略以支持新字段
-- 删除现有策略并重新创建
DROP POLICY IF EXISTS "Anyone can view posts" ON community_posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON community_posts;

CREATE POLICY "Anyone can view posts" ON community_posts
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON community_posts
    FOR INSERT WITH CHECK (
        auth.uid()::text = user_id::text OR
        user_id IS NULL  -- 允许匿名发布（可选）
    );

-- 创建全文搜索函数
CREATE OR REPLACE FUNCTION search_community_posts(search_term TEXT)
RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    content TEXT,
    category VARCHAR(100),
    tags TEXT[],
    likes_count INTEGER,
    views_count INTEGER,
    comments_count INTEGER,
    author VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE,
    relevance_score REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cp.id,
        cp.title,
        cp.content,
        cp.category,
        cp.tags,
        cp.likes_count,
        cp.views_count,
        cp.comments_count,
        cp.author,
        cp.created_at,
        -- 计算相关性分数
        (
            CASE 
                WHEN cp.title ILIKE '%' || search_term || '%' THEN 1.0
                ELSE 0.5
            END +
            CASE 
                WHEN cp.content ILIKE '%' || search_term || '%' THEN 0.8
                ELSE 0.0
            END +
            CASE 
                WHEN array_to_string(cp.tags, ' ') ILIKE '%' || search_term || '%' THEN 0.6
                ELSE 0.0
            END
        ) as relevance_score
    FROM community_posts cp
    WHERE 
        cp.title ILIKE '%' || search_term || '%' OR
        cp.content ILIKE '%' || search_term || '%' OR
        array_to_string(cp.tags, ' ') ILIKE '%' || search_term || '%' OR
        cp.category ILIKE '%' || search_term || '%'
    ORDER BY relevance_score DESC, cp.created_at DESC;
END;
$$ LANGUAGE plpgsql;
```

**执行步骤**:
1. 打开 Supabase Dashboard
2. 进入 SQL Editor
3. 复制上面的 SQL 内容并执行
4. 检查表结构是否正确更新

## 验证命令

### 检查表结构
```sql
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'community_posts' 
ORDER BY ordinal_position;
```

### 检查示例数据
```sql
SELECT * FROM community_posts LIMIT 5;
```

### 测试热门标签函数
```sql
SELECT * FROM get_popular_tags(10);
```

## 前端集成状态

✅ `src/services/database.ts` 已更新
- 添加了 `createCommunityPost()` 方法
- 添加了 `getCommunityPosts()` 方法  
- 添加了 `getPopularTags()` 方法

✅ `src/views/CommunityPage.vue` 已集成
- 自定义标签输入功能已完成
- 帖子创建功能已实现
- 数据库服务已连接

## 下一步

完成数据库设置后，用户可以：
1. 在社区页面创建带自定义标签的帖子
2. 搜索和浏览社区内容
3. 查看热门标签统计
4. 进行标签过滤和全文搜索