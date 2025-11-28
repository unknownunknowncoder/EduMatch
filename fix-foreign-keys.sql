-- 修复外键约束脚本
-- 执行此脚本到 Supabase SQL 控制台

-- 1. 先删除现有的外键约束
ALTER TABLE post_likes DROP CONSTRAINT IF EXISTS fk_post_likes_user;
ALTER TABLE post_favorites DROP CONSTRAINT IF EXISTS fk_post_favorites_user;

-- 2. 重新创建正确的外键约束
-- 确保引用的是 users 表的 id 字段
ALTER TABLE post_likes 
ADD CONSTRAINT fk_post_likes_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE post_favorites 
ADD CONSTRAINT fk_post_favorites_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- 3. 验证外键约束
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
    AND tc.table_name IN ('post_likes', 'post_favorites');