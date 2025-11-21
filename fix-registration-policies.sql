-- 修复用户注册问题的 RLS 策略更新
-- 在 Supabase SQL Editor 中执行此文件

-- 删除现有的限制性策略
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

-- 创建允许注册的新策略
CREATE POLICY "Allow public user registration" ON users
    FOR INSERT WITH CHECK (true);

-- 重新创建查看和更新策略
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text OR auth.uid() IS NULL);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- 验证策略是否正确创建
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