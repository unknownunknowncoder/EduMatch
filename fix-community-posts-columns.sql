-- 修复 community_posts 表缺少的字段
-- 在 Supabase SQL Editor 中执行这些语句

-- 1. 添加缺少的整数字段
ALTER TABLE community_posts 
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

ALTER TABLE community_posts 
ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;

ALTER TABLE community_posts 
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

-- 2. 检查表结构
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'community_posts' 
ORDER BY ordinal_position;

-- 3. 确保所有必需的索引存在
CREATE INDEX IF NOT EXISTS idx_community_posts_likes_count ON community_posts(likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_comments_count ON community_posts(comments_count DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_views_count ON community_posts(views_count DESC);

-- 4. 更新现有记录的默认值（如果有的话）
UPDATE community_posts 
SET likes_count = 0 
WHERE likes_count IS NULL;

UPDATE community_posts 
SET comments_count = 0 
WHERE comments_count IS NULL;

UPDATE community_posts 
SET views_count = 0 
WHERE views_count IS NULL;

-- 5. 检查 RLS 策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'community_posts';

-- 6. 如果需要，重新创建 RLS 策略
-- 删除现有策略
DROP POLICY IF EXISTS "Anyone can view posts" ON community_posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON community_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON community_posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON community_posts;

-- 创建新策略
CREATE POLICY "Anyone can view posts" ON community_posts
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON community_posts
    FOR INSERT WITH CHECK (
        auth.uid()::text = user_id::text OR
        user_id IS NULL  -- 允许匿名发布（可选）
    );

CREATE POLICY "Users can update own posts" ON community_posts
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own posts" ON community_posts
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- 7. 验证修复
SELECT COUNT(*) as total_posts,
       COUNT(CASE WHEN likes_count IS NOT NULL THEN 1 END) as posts_with_likes,
       COUNT(CASE WHEN comments_count IS NOT NULL THEN 1 END) as posts_with_comments,
       COUNT(CASE WHEN views_count IS NOT NULL THEN 1 END) as posts_with_views
FROM community_posts;