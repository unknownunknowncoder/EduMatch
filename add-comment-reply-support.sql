-- 为 post_comments 表添加 parent_id 字段以支持评论回复功能
-- 这个字段将引用父评论的ID，如果是顶级评论则为 NULL

-- 添加 parent_id 字段
ALTER TABLE post_comments 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES post_comments(id) ON DELETE CASCADE;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_post_comments_parent_id ON post_comments(parent_id);

-- 创建部分索引，只对顶级评论（parent_id IS NULL）创建索引，以提高主评论查询性能
CREATE INDEX IF NOT EXISTS idx_post_comments_top_level ON post_comments(post_id, created_at) WHERE parent_id IS NULL;

-- 添加检查约束，确保评论不能回复自己
-- 首先检查约束是否已存在
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'check_no_self_reply' 
        AND table_name = 'post_comments' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE post_comments DROP CONSTRAINT check_no_self_reply;
    END IF;
END $$;

-- 然后添加约束
ALTER TABLE post_comments 
ADD CONSTRAINT check_no_self_reply 
CHECK (id != parent_id OR parent_id IS NULL);

-- 更新现有评论数据，确保所有现有评论的 parent_id 为 NULL
UPDATE post_comments 
SET parent_id = NULL 
WHERE parent_id IS NOT NULL AND id = parent_id;

-- 为回复功能添加视图，方便查询评论及其回复
CREATE OR REPLACE VIEW comment_threads AS
SELECT 
    c.id,
    c.post_id,
    c.user_id,
    c.content,
    c.created_at,
    c.updated_at,
    c.parent_id,
    u.username,
    u.nickname,
    CASE 
        WHEN c.parent_id IS NULL THEN 'comment'
        ELSE 'reply'
    END as comment_type,
    -- 计算该评论的回复数量
    (SELECT COUNT(*) FROM post_comments WHERE parent_id = c.id) as reply_count
FROM post_comments c
LEFT JOIN users u ON c.user_id = u.id;

-- 创建更新时间戳的触发器（如果不存在）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为 post_comments 表创建更新时间戳触发器
DROP TRIGGER IF EXISTS update_post_comments_updated_at ON post_comments;
CREATE TRIGGER update_post_comments_updated_at
    BEFORE UPDATE ON post_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 添加RLS策略以支持回复功能
-- 允许用户查看所有评论和回复
CREATE POLICY IF NOT EXISTS "Users can view all comments" ON post_comments
    FOR SELECT USING (true);

-- 允许认证用户插入顶级评论
CREATE POLICY IF NOT EXISTS "Users can insert top-level comments" ON post_comments
    FOR INSERT WITH CHECK (
        parent_id IS NULL AND 
        auth.uid() = user_id
    );

-- 允许认证用户插入回复评论
CREATE POLICY IF NOT EXISTS "Users can insert reply comments" ON post_comments
    FOR INSERT WITH CHECK (
        parent_id IS NOT NULL AND 
        auth.uid() = user_id AND
        EXISTS (SELECT 1 FROM post_comments WHERE id = parent_id)
    );

-- 允许用户更新自己的评论和回复
CREATE POLICY IF NOT EXISTS "Users can update own comments" ON post_comments
    FOR UPDATE USING (auth.uid() = user_id);

-- 允许用户删除自己的评论和回复
CREATE POLICY IF NOT EXISTS "Users can delete own comments" ON post_comments
    FOR DELETE USING (auth.uid() = user_id);

COMMENT ON COLUMN post_comments.parent_id IS '父评论ID，用于支持评论回复功能；NULL表示顶级评论';