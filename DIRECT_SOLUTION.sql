-- 直接解决方案 - 逐句执行，避免触发器冲突

-- 第1句：直接禁用 RLS
ALTER TABLE study_plans DISABLE ROW LEVEL SECURITY;

-- 第2句：检查结果
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS状态"
FROM pg_tables 
WHERE tablename = 'study_plans';