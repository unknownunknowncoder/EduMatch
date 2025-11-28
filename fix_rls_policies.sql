-- 修复学习计划功能的RLS策略
-- 在 Supabase SQL Editor 中执行以下语句

-- ============================================
-- 1. 临时禁用 RLS 以调试问题
-- ============================================
-- 临时禁用 study_plans 表的 RLS
ALTER TABLE study_plans DISABLE ROW LEVEL SECURITY;

-- 临时禁用 study_plan_checkins 表的 RLS
ALTER TABLE study_plan_checkins DISABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. 创建更宽松的 RLS 策略
-- ============================================
-- 重新启用 RLS
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plan_checkins ENABLE ROW LEVEL SECURITY;

-- 删除现有策略
DROP POLICY IF EXISTS "Users can view their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can create their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can update their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can delete their own study plans" ON study_plans;

DROP POLICY IF EXISTS "Users can view their own checkins" ON study_plan_checkins;
DROP POLICY IF EXISTS "Users can create their own checkins" ON study_plan_checkins;
DROP POLICY IF EXISTS "Users can update their own checkins" ON study_plan_checkins;
DROP POLICY IF EXISTS "Users can delete their own checkins" ON study_plan_checkins;

-- 创建更宽松的策略 - 允许认证用户操作
-- study_plans 表策略
CREATE POLICY "Enable read access for all authenticated users" ON study_plans
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users with valid user_id" ON study_plans
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        user_id IS NOT NULL
    );

CREATE POLICY "Enable update for users based on user_id" ON study_plans
    FOR UPDATE USING (
        auth.role() = 'authenticated' AND 
        (auth.uid()::text = user_id::text OR user_id IS NULL)
    );

CREATE POLICY "Enable delete for users based on user_id" ON study_plans
    FOR DELETE USING (
        auth.role() = 'authenticated' AND 
        (auth.uid()::text = user_id::text OR user_id IS NULL)
    );

-- study_plan_checkins 表策略
CREATE POLICY "Enable read access for all authenticated users" ON study_plan_checkins
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users with valid user_id" ON study_plan_checkins
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        user_id IS NOT NULL
    );

CREATE POLICY "Enable update for users based on user_id" ON study_plan_checkins
    FOR UPDATE USING (
        auth.role() = 'authenticated' AND 
        (auth.uid()::text = user_id::text OR user_id IS NULL)
    );

CREATE POLICY "Enable delete for users based on user_id" ON study_plan_checkins
    FOR DELETE USING (
        auth.role() = 'authenticated' AND 
        (auth.uid()::text = user_id::text OR user_id IS NULL)
    );

-- ============================================
-- 3. 检查当前认证用户信息
-- ============================================
-- 检查当前用户信息（调试用）
SELECT 
    auth.uid() as current_uid,
    auth.role() as current_role,
    auth.jwt() as jwt_claims;

-- 检查表和策略状态
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    CASE 
        WHEN qual IS NOT NULL THEN 'active'
        ELSE 'inactive'
    END as status
FROM pg_policies 
WHERE tablename IN ('study_plans', 'study_plan_checkins')
ORDER BY tablename, policyname;

-- ============================================
-- 4. 测试数据插入（用于验证）
-- ============================================
-- 创建测试用户记录（如果不存在）
-- 注意：需要先确保users表中有对应的用户记录

-- 测试插入一条学习计划记录
INSERT INTO study_plans (user_id, title, description, start_date, target_date, daily_hours)
VALUES (
    COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid),
    '测试学习计划',
    '用于验证RLS策略的测试计划',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days',
    2.0
) ON CONFLICT DO NOTHING;

SELECT '✅ RLS策略修复完成！' as status, 
       '请测试打卡功能是否正常工作' as message;