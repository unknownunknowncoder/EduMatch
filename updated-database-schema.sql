-- 更新的用户表结构（移除 email 字段）
-- 在 Supabase SQL Editor 中执行

-- 删除现有的 email 唯一约束（如果存在）
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;

-- 删除 email 列（如果存在）
ALTER TABLE users DROP COLUMN IF EXISTS email;

-- 确保 nickname 列存在
ALTER TABLE users ADD COLUMN IF NOT EXISTS nickname VARCHAR(100);

-- 更新现有记录的 nickname（如果为空，使用 username 作为默认值）
UPDATE users 
SET nickname = username 
WHERE nickname IS NULL OR nickname = '';

-- 刷新 PostgREST schema 缓存（重要步骤）
NOTIFY pgrst, 'reload schema';

-- 重新应用 RLS 策略（不包含 email 字段）
-- 删除现有策略
DROP POLICY IF EXISTS "Allow public user registration" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

-- 重新创建策略
CREATE POLICY "Allow public user registration" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text OR auth.uid() IS NULL);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- 再次刷新缓存（重要）
NOTIFY pgrst, 'reload schema';

-- 验证表结构
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;