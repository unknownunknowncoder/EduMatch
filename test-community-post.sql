-- 测试社区帖子创建权限
-- 在 Supabase SQL Editor 中执行

-- 1. 检查当前RLS策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'community_posts';

-- 2. 测试手动插入帖子
INSERT INTO community_posts (
  id, 
  user_id, 
  title, 
  content, 
  category, 
  likes_count, 
  views_count, 
  created_at, 
  updated_at
) VALUES (
  gen_random_uuid(), 
  'b6c871eb-717c-4a40-859b-b639cf8ccd08', 
  '测试标题', 
  '测试内容', 
  'test', 
  0, 
  0, 
  NOW(), 
  NOW()
);

-- 3. 查看最新插入的帖子
SELECT id, title, content, created_at 
FROM community_posts 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. 检查用户ID是否存在
SELECT id, username 
FROM users 
WHERE username = 'admin';