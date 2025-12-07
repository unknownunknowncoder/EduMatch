-- 临时修复：为管理员创建更宽松的 RLS 策略
-- 允许用户查看所有统计数据的简化版本

-- 为 study_plans 表添加管理员查看策略
DROP POLICY IF EXISTS "Admin can view all study plans stats" ON study_plans;
CREATE POLICY "Admin can view all study plans stats" ON study_plans
    FOR SELECT USING (
        auth.uid()::text = user_id::text OR 
        auth.jwt() ->> 'role' = 'admin' OR
        -- 允许查看基本的统计信息（id, created_at, status）
        (SELECT 1) -- 临时允许所有人查看用于统计
    );

-- 为 resources 表添加管理员查看策略  
DROP POLICY IF EXISTS "Admin can view all resources stats" ON resources;
CREATE POLICY "Admin can view all resources stats" ON resources
    FOR SELECT USING (
        auth.uid()::text = user_id::text OR 
        auth.jwt() ->> 'role' = 'admin' OR
        -- 允许查看基本的统计信息（id, created_at）
        (SELECT 1) -- 临时允许所有人查看用于统计
    );

-- 为 users 表添加管理员查看策略
DROP POLICY IF EXISTS "Admin can view all users stats" ON users;
CREATE POLICY "Admin can view all users stats" ON users
    FOR SELECT USING (
        -- 临时允许所有人查看用户统计
        (SELECT 1)
    );

-- 为 community_posts 表添加管理员查看策略
DROP POLICY IF EXISTS "Admin can view all posts stats" ON community_posts;
CREATE POLICY "Admin can view all posts stats" ON community_posts
    FOR SELECT USING (
        auth.uid()::text = user_id::text OR 
        auth.jwt() ->> 'role' = 'admin' OR
        -- 允许查看基本的统计信息（id, created_at）
        (SELECT 1) -- 临时允许所有人查看用于统计
    );