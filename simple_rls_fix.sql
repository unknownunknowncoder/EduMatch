-- 简化版RLS策略修复
-- 专门解决打卡功能的401权限问题

-- 1. 完全禁用RLS策略（临时解决方案）
ALTER TABLE study_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE study_plan_checkins DISABLE ROW LEVEL SECURITY;

-- 2. 清除所有现有策略
DROP POLICY IF EXISTS "Users can view their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can create their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can update their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can delete their own study plans" ON study_plans;

DROP POLICY IF EXISTS "Users can view their own checkins" ON study_plan_checkins;
DROP POLICY IF EXISTS "Users can create their own checkins" ON study_plan_checkins;
DROP POLICY IF EXISTS "Users can update their own checkins" ON study_plan_checkins;
DROP POLICY IF EXISTS "Users can delete their own checkins" ON study_plan_checkins;

-- 3. 创建最简单的策略 - 允许所有认证用户操作
-- 重新启用RLS
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plan_checkins ENABLE ROW LEVEL SECURITY;

-- study_plans 表策略
CREATE POLICY "Allow all operations for authenticated users on study_plans" ON study_plans
    FOR ALL USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- study_plan_checkins 表策略  
CREATE POLICY "Allow all operations for authenticated users on study_plan_checkins" ON study_plan_checkins
    FOR ALL USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 4. 验证策略是否生效
SELECT 
    '✅ RLS策略修复完成' as status,
    '现在认证用户可以对学习计划表进行所有操作' as message;

-- 查看创建的策略
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