-- 添加资源类型和标签字段的迁移脚本
-- 在 Supabase SQL Editor 中执行

-- 添加 type 字段到 resources 表
ALTER TABLE resources 
ADD COLUMN IF NOT EXISTS type VARCHAR(50) 
CHECK (type IN ('video', 'article', 'book', 'course', 'tool', 'other'));

-- 添加 tags 字段到 resources 表
ALTER TABLE resources 
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- 为新字段添加索引
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_created_by ON resources(created_by);

-- 更新现有数据的 type 字段（设置为默认值 'other'）
UPDATE resources 
SET type = 'other' 
WHERE type IS NULL;

-- 如果现有数据没有标签，设置空数组
UPDATE resources 
SET tags = '{}' 
WHERE tags IS NULL;

-- 验证更新
SELECT 
    id, 
    title, 
    type, 
    tags,
    created_at 
FROM resources 
ORDER BY created_at DESC;