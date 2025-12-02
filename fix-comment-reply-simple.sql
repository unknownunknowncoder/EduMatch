-- 简化版评论回复功能数据库迁移
-- 专门解决PostgreSQL语法兼容性问题

-- 1. 添加 parent_id 字段
ALTER TABLE post_comments 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES post_comments(id) ON DELETE CASCADE;

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_post_comments_parent_id ON post_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_top_level ON post_comments(post_id, created_at) WHERE parent_id IS NULL;

-- 3. 安全地添加检查约束（避免语法错误）
DO $$
BEGIN
    -- 检查约束是否已存在
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'check_no_self_reply' 
        AND table_name = 'post_comments' 
        AND table_schema = 'public'
    ) THEN
        -- 如果存在，先删除
        ALTER TABLE post_comments DROP CONSTRAINT check_no_self_reply;
    END IF;
    
    -- 添加新约束
    ALTER TABLE post_comments 
    ADD CONSTRAINT check_no_self_reply 
    CHECK (id != parent_id OR parent_id IS NULL);
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '约束添加失败，但其他功能应该正常工作: %', SQLERRM;
END $$;

-- 4. 更新RLS策略
-- 删除现有策略（如果存在）
DROP POLICY IF EXISTS "Users can view all comments" ON post_comments;
DROP POLICY IF EXISTS "Users can insert comments" ON post_comments;
DROP POLICY IF EXISTS "Users can update own comments" ON post_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON post_comments;

-- 创建新的策略
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

-- 确保RLS已启用
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- 验证结果
DO $$
BEGIN
    RAISE NOTICE '=====================================';
    RAISE NOTICE '评论回复功能迁移完成！';
    RAISE NOTICE '=====================================';
    
    -- 检查字段是否添加成功
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'post_comments' 
        AND column_name = 'parent_id'
    ) THEN
        RAISE NOTICE '✓ parent_id 字段添加成功';
    ELSE
        RAISE NOTICE '✗ parent_id 字段添加失败';
    END IF;
    
    -- 检查索引是否创建成功
    IF EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'post_comments' 
        AND indexname = 'idx_post_comments_parent_id'
    ) THEN
        RAISE NOTICE '✓ parent_id 索引创建成功';
    ELSE
        RAISE NOTICE '✗ parent_id 索引创建失败';
    END IF;
    
    RAISE NOTICE '=====================================';
END $$;