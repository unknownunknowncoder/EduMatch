-- EduMatch 社区功能完整数据库初始化脚本
-- 包含点赞、收藏、评论等功能的完整表结构

-- ============================================
-- 1. 创建基础表结构
-- ============================================

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. 创建社区帖子表 (如果不存在)
-- ============================================

CREATE TABLE IF NOT EXISTS community_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    tags TEXT[] DEFAULT '{}',
    author VARCHAR(100) DEFAULT '匿名用户',
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    favorite_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- 3. 创建帖子点赞表
-- ============================================

CREATE TABLE IF NOT EXISTS post_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- 确保每个用户对每个帖子只能点赞一次
    UNIQUE(post_id, user_id)
);

-- ============================================
-- 4. 创建帖子收藏表
-- ============================================

CREATE TABLE IF NOT EXISTS post_favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- 确保每个用户对每个帖子只能收藏一次
    UNIQUE(post_id, user_id)
);

-- ============================================
-- 5. 创建帖子评论表
-- ============================================

CREATE TABLE IF NOT EXISTS post_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- 6. 创建索引以提高查询性能
-- ============================================

-- 社区帖子表索引
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_likes_count ON community_posts(likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_tags ON community_posts USING GIN(tags);

-- 点赞表索引
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_created_at ON post_likes(created_at DESC);

-- 收藏表索引
CREATE INDEX IF NOT EXISTS idx_post_favorites_post_id ON post_favorites(post_id);
CREATE INDEX IF NOT EXISTS idx_post_favorites_user_id ON post_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_post_favorites_created_at ON post_favorites(created_at DESC);

-- 评论表索引
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON post_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_created_at ON post_comments(created_at DESC);

-- ============================================
-- 7. 创建触发器函数
-- ============================================

-- 点赞计数更新触发器函数
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE community_posts 
        SET likes_count = COALESCE(likes_count, 0) + 1
        WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE community_posts 
        SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0)
        WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 收藏计数更新触发器函数
CREATE OR REPLACE FUNCTION update_post_favorite_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE community_posts 
        SET favorite_count = COALESCE(favorite_count, 0) + 1
        WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE community_posts 
        SET favorite_count = GREATEST(COALESCE(favorite_count, 0) - 1, 0)
        WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 评论计数更新触发器函数
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE community_posts 
        SET comments_count = COALESCE(comments_count, 0) + 1
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE community_posts 
        SET comments_count = GREATEST(COALESCE(comments_count, 0) - 1, 0)
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. 创建触发器
-- ============================================

-- 点赞表触发器
DROP TRIGGER IF EXISTS trigger_update_post_likes_count ON post_likes;
CREATE TRIGGER trigger_update_post_likes_count
    AFTER INSERT OR DELETE ON post_likes
    FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

-- 收藏表触发器
DROP TRIGGER IF EXISTS trigger_update_post_favorite_count ON post_favorites;
CREATE TRIGGER trigger_update_post_favorite_count
    AFTER INSERT OR DELETE ON post_favorites
    FOR EACH ROW EXECUTE FUNCTION update_post_favorite_count();

-- 评论表触发器
DROP TRIGGER IF EXISTS trigger_update_post_comments_count ON post_comments;
CREATE TRIGGER trigger_update_post_comments_count
    AFTER INSERT OR DELETE ON post_comments
    FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

-- 更新时间触发器
DROP TRIGGER IF EXISTS update_community_posts_updated_at ON community_posts;
CREATE TRIGGER update_community_posts_updated_at
    BEFORE UPDATE ON community_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_post_comments_updated_at ON post_comments;
CREATE TRIGGER update_post_comments_updated_at
    BEFORE UPDATE ON post_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 9. 启用行级安全策略(RLS)
-- ============================================

-- 启用所有表的RLS
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 10. 创建RLS策略
-- ============================================

-- 社区帖子表策略
DROP POLICY IF EXISTS "任何人都可以查看帖子" ON community_posts;
DROP POLICY IF EXISTS "用户可以创建自己的帖子" ON community_posts;
DROP POLICY IF EXISTS "用户可以更新自己的帖子" ON community_posts;
DROP POLICY IF EXISTS "用户可以删除自己的帖子" ON community_posts;

CREATE POLICY "任何人都可以查看帖子" ON community_posts
    FOR SELECT USING (true);

CREATE POLICY "用户可以创建自己的帖子" ON community_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的帖子" ON community_posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的帖子" ON community_posts
    FOR DELETE USING (auth.uid() = user_id);

-- 点赞表策略
DROP POLICY IF EXISTS "任何人都可以查看点赞记录" ON post_likes;
DROP POLICY IF EXISTS "用户只能添加自己的点赞" ON post_likes;
DROP POLICY IF EXISTS "用户只能删除自己的点赞" ON post_likes;
DROP POLICY IF EXISTS "禁止更新点赞记录" ON post_likes;

CREATE POLICY "任何人都可以查看点赞记录" ON post_likes
    FOR SELECT USING (true);

CREATE POLICY "用户只能添加自己的点赞" ON post_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户只能删除自己的点赞" ON post_likes
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "禁止更新点赞记录" ON post_likes
    FOR UPDATE USING (false);

-- 收藏表策略
DROP POLICY IF EXISTS "用户可以查看自己的收藏" ON post_favorites;
DROP POLICY IF EXISTS "用户可以添加自己的收藏" ON post_favorites;
DROP POLICY IF EXISTS "用户可以删除自己的收藏" ON post_favorites;
DROP POLICY IF EXISTS "禁止更新收藏记录" ON post_favorites;

CREATE POLICY "用户可以查看自己的收藏" ON post_favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "用户可以添加自己的收藏" ON post_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的收藏" ON post_favorites
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "禁止更新收藏记录" ON post_favorites
    FOR UPDATE USING (false);

-- 评论表策略
DROP POLICY IF EXISTS "任何人都可以查看评论" ON post_comments;
DROP POLICY IF EXISTS "用户可以创建自己的评论" ON post_comments;
DROP POLICY IF EXISTS "用户可以更新自己的评论" ON post_comments;
DROP POLICY IF EXISTS "用户可以删除自己的评论" ON post_comments;

CREATE POLICY "任何人都可以查看评论" ON post_comments
    FOR SELECT USING (true);

CREATE POLICY "用户可以创建自己的评论" ON post_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的评论" ON post_comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的评论" ON post_comments
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 11. 创建实用函数
-- ============================================

-- 热门标签统计函数
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

-- 帖子搜索函数
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

-- ============================================
-- 12. 插入示例数据（可选）
-- ============================================

-- 插入示例帖子数据（如果有用户数据的话）
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- 获取管理员用户ID（如果存在）
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@edumatch.com' LIMIT 1;
    
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO community_posts (
            title, 
            content, 
            category, 
            tags, 
            author,
            user_id,
            likes_count,
            views_count,
            comments_count,
            favorite_count
        ) VALUES 
        (
            'Vue 3 学习心得分享',
            '最近学习了 Vue 3 的新特性，特别是 Composition API 让我觉得代码组织更加清晰了。想和大家分享一些学习心得和遇到的问题。',
            '前端开发',
            ARRAY['前端开发', 'Vue3', '学习经验'],
            'Vue学习者',
            admin_user_id,
            5,
            128,
            3,
            2
        ),
        (
            'TypeScript 类型体操入门指南',
            'TypeScript 的类型系统真的很强大，但也是很多初学者的难点。今天我来分享一些 TypeScript 类型系统的基础知识和实用技巧。',
            '前端开发',
            ARRAY['TypeScript', '前端开发', '教程'],
            'TS爱好者',
            admin_user_id,
            8,
            256,
            7,
            3
        )
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- ============================================
-- 13. 验证表创建结果
-- ============================================

DO $$
DECLARE
    posts_count INTEGER;
    likes_count INTEGER;
    favorites_count INTEGER;
    comments_count INTEGER;
BEGIN
    -- 统计表记录数量
    SELECT COUNT(*) INTO posts_count FROM community_posts;
    SELECT COUNT(*) INTO likes_count FROM post_likes;
    SELECT COUNT(*) INTO favorites_count FROM post_favorites;
    SELECT COUNT(*) INTO comments_count FROM post_comments;
    
    RAISE NOTICE '\n🎉 社区功能数据库初始化完成！';
    RAISE NOTICE '📊 表结构统计:';
    RAISE NOTICE '   ✅ community_posts: % 条记录', posts_count;
    RAISE NOTICE '   ✅ post_likes: % 条记录', likes_count;
    RAISE NOTICE '   ✅ post_favorites: % 条记录', favorites_count;
    RAISE NOTICE '   ✅ post_comments: % 条记录', comments_count;
    RAISE NOTICE '\n🔧 功能特性:';
    RAISE NOTICE '   ✅ 完整的点赞、收藏、评论功能';
    RAISE NOTICE '   ✅ 自动计数更新触发器';
    RAISE NOTICE '   ✅ 行级安全策略(RLS)';
    RAISE NOTICE '   ✅ 高性能索引';
    RAISE NOTICE '   ✅ 实用搜索函数';
    RAISE NOTICE '\n🚀 点赞和收藏功能已准备就绪！';
END $$;