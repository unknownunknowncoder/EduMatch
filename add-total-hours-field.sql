-- 为 study_plans 表添加 total_hours 字段
-- 在 Supabase SQL Editor 中执行此脚本

-- 检查并添加 total_hours 字段
ALTER TABLE study_plans 
ADD COLUMN IF NOT EXISTS total_hours DECIMAL(6,2);

-- 验证字段添加成功
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'study_plans' 
    AND column_name = 'total_hours';