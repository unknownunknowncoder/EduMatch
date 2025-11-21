-- 修复 community_posts 表的 RLS 策略
-- 在 Supabase SQL Editor 中执行以下语句

-- 1. 先禁用 RLS，避免策略冲突
ALTER TABLE community_posts DISABLE ROW LEVEL SECURITY;

-- 2. 删除所有现有策略
DROP POLICY IF EXISTS "Anyone can view posts" ON community_posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON community_posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON community_posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON community_posts;

-- 3. 重新启用 RLS
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- 4. 创建开发环境策略（允许所有操作）
CREATE POLICY "Enable read access for all users" ON community_posts
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON community_posts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON community_posts
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON community_posts
    FOR DELETE USING (true);

-- 5. 验证策略创建成功
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
WHERE tablename = 'community_posts';