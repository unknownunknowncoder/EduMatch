-- 修复学习计划表的数据隔离问题
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 首先检查当前RLS策略
SELECT 
    tablename,
    rowsecurity as "RLS状态",
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = t.tablename) as "策略数量"
FROM pg_tables t
WHERE tablename = 'study_plans';

-- 2. 显示当前策略详情
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd, 
    qual 
FROM pg_policies 
WHERE tablename = 'study_plans';

-- 3. 删除所有现有策略（确保干净的重新配置）
DROP POLICY IF EXISTS "Users can view their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can create their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can update their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can delete their own study plans" ON study_plans;

-- 删除任何可能存在的宽松策略
DROP POLICY IF EXISTS "Anyone can view study plans" ON study_plans;
DROP POLICY IF EXISTS "Anyone can create study plans" ON study_plans;
DROP POLICY IF EXISTS "Anyone can update study plans" ON study_plans;
DROP POLICY IF EXISTS "Anyone can delete study plans" ON study_plans;

-- 4. 重新创建严格的数据隔离策略
CREATE POLICY "Users can view their own study plans" ON study_plans
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own study plans" ON study_plans
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own study plans" ON study_plans
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own study plans" ON study_plans
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- 5. 验证策略已正确配置
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd, 
    qual 
FROM pg_policies 
WHERE tablename = 'study_plans'
ORDER BY cmd;

-- 6. 刷新系统缓存确保策略生效
NOTIFY pgrst, 'reload schema';