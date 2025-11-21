-- 完整修复 study_plans 表的 RLS 策略
-- 在 Supabase SQL Editor 中执行以下语句

-- 1. 先禁用 RLS，避免策略冲突
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

-- 3. 重新启用 RLS
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;

-- 4. 创建开发环境策略（允许所有操作）
CREATE POLICY "Enable read access for all users" ON study_plans
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON study_plans
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON study_plans
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON study_plans
    FOR DELETE USING (true);

-- 5. 验证策略创建成功
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'study_plans';