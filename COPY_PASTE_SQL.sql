-- 复制以下所有内容到 Supabase SQL Editor 中一次性执行

ALTER TABLE study_plans DISABLE ROW LEVEL SECURITY;
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

-- 验证 RLS 是否已禁用
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS已禁用(false)"
FROM pg_tables 
WHERE tablename = 'study_plans';