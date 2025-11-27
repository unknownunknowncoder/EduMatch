-- ============================================
-- 评论回复功能数据库迁移脚本
-- ============================================
-- 执行此脚本来添加评论回复功能到现有数据库

-- 1. 添加 parent_id 字段到 post_comments 表
ALTER TABLE post_comments 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES post_comments(id) ON DELETE CASCADE;

-- 2. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_post_comments_parent_id ON post_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_top_level ON post_comments(post_id, created_at) WHERE parent_id IS NULL;

-- 3. 添加检查约束，防止评论回复自己
-- 首先检查约束是否已存在，如果存在则删除
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

-- 4. 创建评论线程视图（可选）
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

-- 5. 更新RLS策略以支持回复功能
-- 删除现有的评论策略（如果存在）
DROP POLICY IF EXISTS "Users can view all comments" ON post_comments;
DROP POLICY IF EXISTS "Users can insert comments" ON post_comments;
DROP POLICY IF EXISTS "Users can update own comments" ON post_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON post_comments;

-- 创建新的RLS策略
CREATE POLICY "Users can view all comments" ON post_comments
    FOR SELECT USING (true);

CREATE POLICY "Users can insert top-level comments" ON post_comments
    FOR INSERT WITH CHECK (
        parent_id IS NULL AND 
        auth.uid() = user_id
    );

CREATE POLICY "Users can insert reply comments" ON post_comments
    FOR INSERT WITH CHECK (
        parent_id IS NOT NULL AND 
        auth.uid() = user_id AND
        EXISTS (SELECT 1 FROM post_comments WHERE id = parent_id)
    );

CREATE POLICY "Users can update own comments" ON post_comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON post_comments
    FOR DELETE USING (auth.uid() = user_id);

-- 6. 确保RLS已启用
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- 7. 验证迁移结果
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default 
FROM information_schema.columns 
WHERE table_name = 'post_comments' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 8. 显示创建的索引
SELECT 
    indexname, 
    tablename 
FROM pg_indexes 
WHERE tablename = 'post_comments' 
    AND schemaname = 'public'
ORDER BY indexname;

-- 迁移完成提示
DO $$
BEGIN
    RAISE NOTICE '===========================================';
    RAISE NOTICE '评论回复功能数据库迁移完成！';
    RAISE NOTICE '===========================================';
    RAISE NOTICE '已添加 parent_id 字段到 post_comments 表';
    RAISE NOTICE '已创建相关索引以提高查询性能';
    RAISE NOTICE '已更新RLS策略以支持评论回复';
    RAISE NOTICE '现在可以支持无限层级的评论回复功能';
    RAISE NOTICE '===========================================';
END $$;