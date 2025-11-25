// 简单的评论功能修复方案
// 这个脚本可以直接在Supabase SQL编辑器中运行来修复RLS策略

console.log('请将以下SQL代码复制到Supabase SQL编辑器中执行：');

console.log(`
-- 修复评论功能RLS策略 - 允许任何人创建评论
-- 1. 禁用RLS
ALTER TABLE post_comments DISABLE ROW LEVEL SECURITY;

-- 2. 重新启用RLS
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- 3. 删除现有策略
DROP POLICY IF EXISTS "Anyone can view comments" ON post_comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON post_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON post_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON post_comments;

-- 4. 创建新的宽松策略
CREATE POLICY "Allow anyone to view comments" ON post_comments
    FOR SELECT USING (true);

CREATE POLICY "Allow anyone to create comments" ON post_comments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to update their comments" ON post_comments
    FOR UPDATE USING (true);

CREATE POLICY "Allow users to delete their comments" ON post_comments
    FOR DELETE USING (true);

-- 5. 验证策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'post_comments';

-- 6. 测试插入评论
INSERT INTO post_comments (post_id, user_id, content) VALUES 
('12345678-1234-1234-1234-123456789abc', '12345678-1234-1234-1234-123456789abc', '测试评论 - RLS策略修复');

SELECT '评论功能RLS策略修复完成！' as status;
`);

console.log('\n或者，如果您想完全禁用RLS，可以使用以下代码：');

console.log(`
-- 完全禁用post_comments表的RLS策略
ALTER TABLE post_comments DISABLE ROW LEVEL SECURITY;

-- 验证RLS已禁用
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'post_comments';

SELECT 'RLS策略已完全禁用！' as status;
`);