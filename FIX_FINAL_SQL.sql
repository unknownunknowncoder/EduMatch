-- 最终修复 SQL - 复制到 Supabase SQL Editor 中执行

-- 1. 禁用 RLS
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

-- 3. 先删除可能存在的触发器
DROP TRIGGER IF EXISTS update_study_plans_updated_at ON study_plans;

-- 4. 确保触发器函数存在
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. 创建触发器
CREATE TRIGGER update_study_plans_updated_at BEFORE UPDATE ON study_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. 验证修复结果
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS状态(false=已禁用)"
FROM pg_tables 
WHERE tablename = 'study_plans';

SELECT 
    trigger_name,
    event_manipulation as "事件",
    action_condition as "条件",
    action_statement as "操作"
FROM information_schema.triggers 
WHERE event_object_table = 'study_plans';