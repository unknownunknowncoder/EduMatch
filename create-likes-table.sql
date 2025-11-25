-- 创建点赞表
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 确保每个用户对每个帖子只能点赞一次
  UNIQUE(post_id, user_id)
);

-- 为点赞表创建索引
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_created_at ON post_likes(created_at);

-- 为现有帖子更新点赞计数（如果社区帖子表已经有likes_count字段）
UPDATE community_posts 
SET likes_count = (
  SELECT COUNT(*) 
  FROM post_likes 
  WHERE post_likes.post_id = community_posts.id
)
WHERE EXISTS (SELECT 1 FROM post_likes WHERE post_likes.post_id = community_posts.id);