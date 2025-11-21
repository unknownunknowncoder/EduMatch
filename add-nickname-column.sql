-- 添加 nickname 列到 users 表
-- 在 Supabase SQL Editor 中执行

-- 检查列是否已存在，如果不存在则添加
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='users' 
        AND column_name='nickname'
    ) THEN
        ALTER TABLE users ADD COLUMN nickname VARCHAR(100);
    END IF;
END $$;

-- 更新现有记录的 nickname（如果为空，使用 username 作为默认值）
UPDATE users 
SET nickname = username 
WHERE nickname IS NULL OR nickname = '';

-- 刷新 PostgREST schema 缓存
-- 这一步很重要，确保 PostgREST 能够识别新添加的列
NOTIFY pgrst, 'reload schema';

-- 验证列是否添加成功
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name='users' AND column_name='nickname';

-- 检查表结构
\d users;