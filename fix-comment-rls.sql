-- 修复评论功能的RLS策略
-- 由于应用使用localStorage而不是Supabase auth，需要修改RLS策略

-- 1. 首先禁用post_comments表的RLS策略
ALTER TABLE post_comments DISABLE ROW LEVEL SECURITY;

-- 2. 重新启用RLS，但使用更宽松的策略
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- 3. 删除现有的严格策略
DROP POLICY IF EXISTS "Anyone can view comments" ON post_comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON post_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON post_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON post_comments;

-- 4. 创建新的宽松策略，允许任何人查看和创建评论
CREATE POLICY "Allow anyone to view comments" ON post_comments
    FOR SELECT USING (true);

CREATE POLICY "Allow anyone to create comments" ON post_comments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to update their comments" ON post_comments
    FOR UPDATE USING (true);

CREATE POLICY "Allow users to delete their comments" ON post_comments
    FOR DELETE USING (true);

-- 5. 验证策略已创建
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'post_comments';

-- 6. 测试插入评论（可选）
-- INSERT INTO post_comments (post_id, user_id, content) VALUES 
-- ('12345678-1234-1234-1234-123456789abc', '12345678-1234-1234-1234-123456789abc', '测试评论');

SELECT '评论功能RLS策略修复完成！' as status;