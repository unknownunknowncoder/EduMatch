-- 修复昵称列问题
-- 在 Supabase SQL Editor 中执行

-- 首先查看当前表结构
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- 添加 nickname 列（如果不存在）
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS nickname VARCHAR(100);

-- 更新现有记录的昵称（如果为空，使用 username 作为默认值）
UPDATE users 
SET nickname = username 
WHERE nickname IS NULL OR nickname = '';

-- 刷新 PostgREST schema 缓存
NOTIFY pgrst, 'reload schema';

-- 验证结果
SELECT id, username, nickname FROM users LIMIT 5;