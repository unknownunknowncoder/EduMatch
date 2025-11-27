-- 快速修复缺失字段的脚本
-- 在Supabase SQL编辑器中执行此脚本

-- 1. 添加缺失的字段到 community_posts 表
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS favorite_count INTEGER DEFAULT 0;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0;

-- 2. 如果有旧字段名，重命名为新字段名
DO $$
BEGIN
    -- 处理 likes_count -> like_count
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'community_posts' AND column_name = 'likes_count') THEN
        ALTER TABLE community_posts RENAME COLUMN likes_count TO like_count;
        RAISE NOTICE '✅ 重命名 likes_count 为 like_count';
    END IF;
    
    -- 处理 views_count -> view_count
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'community_posts' AND column_name = 'views_count') THEN
        ALTER TABLE community_posts RENAME COLUMN views_count TO view_count;
        RAISE NOTICE '✅ 重命名 views_count 为 view_count';
    END IF;
    
    -- 处理 comments_count -> comment_count
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'community_posts' AND column_name = 'comments_count') THEN
        ALTER TABLE community_posts RENAME COLUMN comments_count TO comment_count;
        RAISE NOTICE '✅ 重命名 comments_count 为 comment_count';
    END IF;
END $$;

-- 3. 验证字段
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'community_posts' 
    AND column_name IN ('like_count', 'favorite_count', 'view_count', 'comment_count')
ORDER BY column_name;

-- 4. 更新现有记录的计数
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

-- 5. 验证结果
SELECT 
    '✅ 字段修复完成' as status,
    NOW() as fixed_at;