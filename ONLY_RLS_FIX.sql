-- 只修复 RLS 问题，不涉及触发器
-- 复制到 Supabase SQL Editor 中执行

-- 1. 只禁用 RLS（核心问题）
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

-- 3. 验证结果
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS状态(false=正常)"
FROM pg_tables 
WHERE tablename = 'study_plans';