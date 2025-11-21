-- 彻底修复 study_plans 表的 RLS 问题
-- 在 Supabase SQL Editor 中执行以下语句

-- 1. 完全禁用 RLS（因为我们使用本地用户系统，不需要 Supabase Auth）
ALTER TABLE study_plans DISABLE ROW LEVEL SECURITY;

-- 2. 删除所有现有策略
DROP POLICY IF EXISTS "Users can view their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can create their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can update their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can delete their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Anyone can view study plans" ON study_plans;
DROP POLICY IF EXISTS "Anyone can create study plans" ON study_plans;
DROP POLICY IF EXISTS "Anyone can update study plans" ON study_plans;
DROP POLICY IF EXISTS "Anyone can delete study plans" ON study_plans;
DROP POLICY IF EXISTS "Enable read access for all users" ON study_plans;
DROP POLICY IF EXISTS "Enable insert for all users" ON study_plans;
DROP POLICY IF EXISTS "Enable update for all users" ON study_plans;
DROP POLICY IF EXISTS "Enable delete for all users" ON study_plans;

-- 3. 验证表状态
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'study_plans';

-- 4. 测试插入（可选）
-- INSERT INTO study_plans (user_id, title, description, progress, status, start_date, target_date, daily_hours, resource_name, resource_url, created_at, updated_at)
-- VALUES ('test-user-id', 'Test Plan', 'Test Description', 0, 'pending', '2024-01-01', '2024-12-31', 2.5, 'Test Resource', 'https://test.com', NOW(), NOW());

-- 5. 查看测试数据（可选）
-- SELECT * FROM study_plans WHERE title = 'Test Plan';

-- 6. 删除测试数据（可选）
-- DELETE FROM study_plans WHERE title = 'Test Plan';