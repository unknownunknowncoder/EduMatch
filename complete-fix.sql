-- 完整的外键约束修复脚本
-- 问题：post_likes 和 post_favorites 表有两个外键约束：
-- 1. user_id -> users.id (这个可能有问题)
-- 2. post_id -> community_posts.id (这个是主要的)

-- 解决方案：检查并修复所有外键约束

-- 1. 删除所有可能有问题外键约束
ALTER TABLE post_likes DROP CONSTRAINT IF EXISTS fk_post_likes_user;
ALTER TABLE post_likes DROP CONSTRAINT IF EXISTS fk_post_likes_post;

ALTER TABLE post_favorites DROP CONSTRAINT IF EXISTS fk_post_favorites_user;
ALTER TABLE post_favorites DROP CONSTRAINT IF EXISTS fk_post_favorites_post;

-- 2. 重新创建正确的外键约束
-- 确保 community_posts 表存在，否则需要先创建
-- 修复用户外键约束
ALTER TABLE post_likes 
ADD CONSTRAINT fk_post_likes_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE post_favorites 
ADD CONSTRAINT fk_post_favorites_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- 修复文章外键约束（如果community_posts表存在）
ALTER TABLE post_likes 
ADD CONSTRAINT fk_post_likes_post 
FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE;

ALTER TABLE post_favorites 
ADD CONSTRAINT fk_post_favorites_post 
FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE;

-- 3. 验证所有外键约束
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('post_likes', 'post_favorites')
ORDER BY tc.table_name, tc.constraint_name;