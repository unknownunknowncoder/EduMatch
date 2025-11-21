-- 调试触发器问题
-- 复制到 Supabase SQL Editor 中逐句执行

-- 1. 先查看当前的触发器状态
SELECT 
    trigger_name,
    event_manipulation as "事件",
    action_statement as "操作"
FROM information_schema.triggers 
WHERE event_object_table = 'study_plans';

-- 2. 查看表的状态
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS状态"
FROM pg_tables 
WHERE tablename = 'study_plans';

-- 3. 尝试只禁用 RLS（如果上面这句报错，说明问题不是 RLS）
-- ALTER TABLE study_plans DISABLE ROW LEVEL SECURITY;

-- 4. 查看所有策略（如果有）
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