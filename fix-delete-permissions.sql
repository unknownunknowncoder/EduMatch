-- 修复删除功能的 RLS 策略
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 检查 community_posts 表的当前策略
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'community_posts'
ORDER BY policyname;

-- 2. 确保 community_posts 表有正确的删除策略
DROP POLICY IF EXISTS "Enable delete for all users" ON community_posts;
CREATE POLICY "Enable delete for all users" ON community_posts
    FOR DELETE USING (true);

-- 3. 确保 resources 表的删除策略（如果启用了 RLS）
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view resources" ON resources;
DROP POLICY IF EXISTS "Authenticated users can insert resources" ON resources;
DROP POLICY IF EXISTS "Users can update their own resources" ON resources;
DROP POLICY IF EXISTS "Users can delete their own resources" ON resources;

-- 4. 为 resources 表创建宽松的策略（开发环境）
CREATE POLICY "Enable read access for all users" ON resources
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON resources
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON resources
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON resources
    FOR DELETE USING (true);

-- 5. 刷新 schema 缓存
NOTIFY pgrst, 'reload schema';

-- 6. 验证策略创建成功
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
WHERE tablename IN ('community_posts', 'resources')
ORDER BY tablename, policyname;

-- 7. 显示成功消息
DO $$
BEGIN
    RAISE NOTICE '✅ 删除功能的 RLS 策略已修复！';
    RAISE NOTICE 'community_posts 和 resources 表现在支持删除操作。';
END $$;