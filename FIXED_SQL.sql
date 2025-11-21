-- ============================================
-- 修复类型错误的 community_posts 创建脚本
-- ============================================

-- 1. 首先删除已存在的表（如果存在）
DROP TABLE IF EXISTS community_posts CASCADE;

-- 2. 创建基础表结构 - 使用 BIGINT 类型
CREATE TABLE community_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    likes_count BIGINT DEFAULT 0,
    views_count BIGINT DEFAULT 0,
    comments_count BIGINT DEFAULT 0,
    author VARCHAR(100) DEFAULT '匿名用户',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. 创建索引
CREATE INDEX idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX idx_community_posts_category ON community_posts(category);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX idx_community_posts_tags ON community_posts USING GIN(tags);
CREATE INDEX idx_community_posts_comments_count ON community_posts(comments_count DESC);
CREATE INDEX idx_community_posts_likes_count ON community_posts(likes_count DESC);

-- 4. 插入一些示例帖子数据 - 使用 BIGINT 类型
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
    5::BIGINT,
    128::BIGINT,
    3::BIGINT,
    (SELECT id FROM users WHERE username = 'admin' LIMIT 1)
),
(
    'TypeScript 类型体操入门指南',
    'TypeScript 的类型系统真的很强大，但也是很多初学者的难点。今天我来分享一些 TypeScript 类型系统的基础知识和实用技巧。',
    '前端开发',
    ARRAY['TypeScript', '前端开发', '教程'],
    'TS爱好者',
    8::BIGINT,
    256::BIGINT,
    7::BIGINT,
    (SELECT id FROM users WHERE username = 'teacher1' LIMIT 1)
),
(
    '算法学习路线推荐',
    '作为一个刚入门算法的同学，想和大家分享一下我学习算法的路线和一些好的学习资源。',
    '算法与数据结构',
    ARRAY['算法', '学习路线', '数据结构'],
    '算法小白',
    12::BIGINT,
    342::BIGINT,
    15::BIGINT,
    (SELECT id FROM users WHERE username = 'student1' LIMIT 1)
),
(
    '从零开始搭建 Node.js 项目的经验',
    '最近从零开始搭建了一个 Node.js 后端项目，遇到了不少坑，总结了一些经验分享给大家。',
    '后端开发',
    ARRAY['Node.js', '后端开发', '项目经验'],
    '后端新手',
    6::BIGINT,
    189::BIGINT,
    4::BIGINT,
    (SELECT id FROM users WHERE username = 'admin' LIMIT 1)
);

-- 5. 创建热门标签统计函数 - 返回 BIGINT
CREATE OR REPLACE FUNCTION get_popular_tags(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    tag_name TEXT,
    post_count BIGINT
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

-- 6. 创建用于搜索标签的函数
CREATE OR REPLACE FUNCTION search_posts_by_tags(tag_names TEXT[])
RETURNS TABLE (
    id UUID,
    user_id UUID,
    title VARCHAR(255),
    content TEXT,
    category VARCHAR(100),
    tags TEXT[],
    likes_count BIGINT,
    views_count BIGINT,
    comments_count BIGINT,
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
    WHERE cp.tags && tag_names
    ORDER BY cp.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 7. 创建更新评论计数的触发器函数
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

-- 8. 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. 创建触发器
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. 启用 RLS（行级安全）
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- 11. 创建 RLS 策略
CREATE POLICY "Anyone can view posts" ON community_posts
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON community_posts
    FOR INSERT WITH CHECK (
        auth.uid()::text = user_id::text OR
        user_id IS NULL
    );

CREATE POLICY "Users can update their own posts" ON community_posts
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own posts" ON community_posts
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- 12. 创建全文搜索函数
CREATE OR REPLACE FUNCTION search_community_posts(search_term TEXT)
RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    content TEXT,
    category VARCHAR(100),
    tags TEXT[],
    likes_count BIGINT,
    views_count BIGINT,
    comments_count BIGINT,
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

-- ============================================
-- 验证脚本
-- ============================================

-- 检查表结构
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'community_posts' 
ORDER BY ordinal_position;

-- 查看示例数据
SELECT * FROM community_posts LIMIT 5;

-- 测试热门标签函数
SELECT * FROM get_popular_tags(10);

-- 测试搜索函数
SELECT * FROM search_posts_by_tags(ARRAY['Vue3', '前端开发']);