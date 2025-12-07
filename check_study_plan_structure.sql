-- 检查 study_plans 表结构
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'study_plans' 
ORDER BY ordinal_position;