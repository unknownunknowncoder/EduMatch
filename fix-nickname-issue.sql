-- 完整修复 nickname 列问题
-- 在 Supabase SQL Editor 中执行此脚本

-- 步骤 1: 确保 nickname 列存在
ALTER TABLE users ADD COLUMN IF NOT EXISTS nickname VARCHAR(100);

-- 步骤 2: 更新现有记录的默认值（可选）
UPDATE users 
SET nickname = COALESCE(nickname, username) 
WHERE nickname IS NULL OR nickname = '';

-- 步骤 3: 刷新 PostgREST schema 缓存（关键步骤）
NOTIFY pgrst, 'reload schema';

-- 步骤 4: 验证修复结果
-- 检查列是否存在
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'nickname';

-- 测试查询是否正常工作
SELECT id, username, email, nickname 
FROM users 
LIMIT 1;

-- 如果有示例数据，检查 nickname 字段
SELECT * FROM users LIMIT 3;

-- 步骤 5: 重新应用 RLS 策略（确保包含 nickname 字段）
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

-- 最终验证：检查 RLS 策略
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
WHERE tablename = 'users';