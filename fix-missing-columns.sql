-- 修复缺失的字段
-- 在Supabase SQL编辑器中执行此脚本

-- 1. 检查并添加缺失的字段到 community_posts 表
DO $$
BEGIN
    -- 添加 favorite_count 字段（如果不存在）
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'community_posts' 
        AND column_name = 'favorite_count'
    ) THEN
        ALTER TABLE community_posts ADD COLUMN favorite_count INTEGER DEFAULT 0;
        RAISE NOTICE '✅ 添加了 favorite_count 字段';
    ELSE
        RAISE NOTICE '⚠️ favorite_count 字段已存在';
    END IF;
    
    -- 检查并修正 like_count 字段名
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'community_posts' 
        AND column_name = 'like_count'
    ) THEN
        -- 如果有 likes_count 但没有 like_count，重命名
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'community_posts' 
            AND column_name = 'likes_count'
        ) THEN
            ALTER TABLE community_posts RENAME COLUMN likes_count TO like_count;
            RAISE NOTICE '✅ 重命名 likes_count 为 like_count';
        ELSE
            -- 如果都没有，添加 like_count 字段
            ALTER TABLE community_posts ADD COLUMN like_count INTEGER DEFAULT 0;
            RAISE NOTICE '✅ 添加了 like_count 字段';
        END IF;
    ELSE
        RAISE NOTICE '⚠️ like_count 字段已存在';
    END IF;
    
    -- 检查并修正 view_count 字段
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'community_posts' 
        AND column_name = 'view_count'
    ) THEN
        -- 如果有 views_count 但没有 view_count，重命名
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'community_posts' 
            AND column_name = 'views_count'
        ) THEN
            ALTER TABLE community_posts RENAME COLUMN views_count TO view_count;
            RAISE NOTICE '✅ 重命名 views_count 为 view_count';
        ELSE
            -- 如果都没有，添加 view_count 字段
            ALTER TABLE community_posts ADD COLUMN view_count INTEGER DEFAULT 0;
            RAISE NOTICE '✅ 添加了 view_count 字段';
        END IF;
    ELSE
        RAISE NOTICE '⚠️ view_count 字段已存在';
    END IF;
    
    -- 检查并修正 comment_count 字段
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'community_posts' 
        AND column_name = 'comment_count'
    ) THEN
        -- 如果有 comments_count 但没有 comment_count，重命名
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'community_posts' 
            AND column_name = 'comments_count'
        ) THEN
            ALTER TABLE community_posts RENAME COLUMN comments_count TO comment_count;
            RAISE NOTICE '✅ 重命名 comments_count 为 comment_count';
        ELSE
            -- 如果都没有，添加 comment_count 字段
            ALTER TABLE community_posts ADD COLUMN comment_count INTEGER DEFAULT 0;
            RAISE NOTICE '✅ 添加了 comment_count 字段';
        END IF;
    ELSE
        RAISE NOTICE '⚠️ comment_count 字段已存在';
    END IF;
END $$;

-- 2. 验证字段添加结果
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'community_posts' 
    AND column_name IN ('like_count', 'favorite_count', 'view_count', 'comment_count')
ORDER BY column_name;

-- 3. 更新现有记录的计数（从点赞收藏表计算）
UPDATE community_posts 
SET like_count = (
    SELECT COUNT(*) 
    FROM post_likes 
    WHERE post_likes.post_id = community_posts.id
)
WHERE like_count IS NULL OR like_count = 0;

UPDATE community_posts 
SET favorite_count = (
    SELECT COUNT(*) 
    FROM post_favorites 
    WHERE post_favorites.post_id = community_posts.id
)
WHERE favorite_count IS NULL OR favorite_count = 0;

-- 4. 验证更新结果
SELECT 
    id,
    title,
    like_count,
    favorite_count,
    view_count,
    comment_count
FROM community_posts 
ORDER BY created_at DESC
LIMIT 5;

SELECT 
    '✅ community_posts 表字段修复完成' as status,
    NOW() as fixed_at;