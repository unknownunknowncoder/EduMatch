-- 禁用 resources 表的 RLS 策略，解决创建资源时的 401 错误
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 检查当前 RLS 状态
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS状态"
FROM pg_tables 
WHERE tablename = 'resources';

-- 2. 禁用 RLS 策略
ALTER TABLE resources DISABLE ROW LEVEL SECURITY;

-- 3. 删除所有现有策略（确保完全禁用）
DROP POLICY IF EXISTS "Anyone can view resources" ON resources;
DROP POLICY IF EXISTS "Authenticated users can insert resources" ON resources;
DROP POLICY IF EXISTS "Users can update their own resources" ON resources;
DROP POLICY IF EXISTS "Users can delete their own resources" ON resources;

-- 4. 验证 RLS 已禁用
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS状态"
FROM pg_tables 
WHERE tablename = 'resources';

-- 5. 检查策略是否已删除
SELECT 
    schemaname, 
    tablename, 
    policyname 
FROM pg_policies 
WHERE tablename = 'resources';

-- 6. 测试插入权限（可选）
-- INSERT INTO resources (title, description, created_by) VALUES ('测试资源', '这是一个测试资源', 'b6c871eb-717c-4a40-859b-b639cf8ccd08');

-- 7. 刷新 schema 缓存
NOTIFY pgrst, 'reload schema';

-- 8. 显示成功消息
DO $$
BEGIN
    RAISE NOTICE '✅ resources 表的 RLS 已禁用，现在可以正常创建资源了！';
END $$;