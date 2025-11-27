-- 修复post_likes表的外键约束问题

-- 1. 首先备份现有数据
CREATE TABLE post_likes_backup AS SELECT * FROM post_likes;

-- 2. 删除现有的外键约束
ALTER TABLE post_likes DROP CONSTRAINT IF EXISTS fk_post_likes_user;
ALTER TABLE post_likes DROP CONSTRAINT IF EXISTS fk_post_likes_post;

-- 3. 重新添加正确的外键约束
ALTER TABLE post_likes 
ADD CONSTRAINT fk_post_likes_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE post_likes 
ADD CONSTRAINT fk_post_likes_post 
FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE;

-- 4. 验证约束是否正确添加
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'post_likes';