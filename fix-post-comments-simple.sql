-- 简单修复 post_comments 表不存在的错误
-- 这个版本确保没有语法错误

-- 1. 检查并创建 post_comments 表（如果不存在）
CREATE TABLE IF NOT EXISTS post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 外键约束
    CONSTRAINT fk_post_comments_post 
        FOREIGN KEY (post_id) 
        REFERENCES community_posts(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_post_comments_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON post_comments(user_id);

-- 3. 启用行级安全策略
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- 4. 创建 RLS 策略（如果不存在）
DO $$ 
BEGIN
    -- 允许所有人查看评论
    IF NOT EXISTS (SELECT FROM pg_policies 
                   WHERE tablename = 'post_comments' 
                   AND policyname = 'Anyone can view comments') THEN
        CREATE POLICY "Anyone can view comments" ON post_comments
            FOR SELECT USING (true);
    END IF;
    
    -- 允许认证用户创建评论
    IF NOT EXISTS (SELECT FROM pg_policies 
                   WHERE tablename = 'post_comments' 
                   AND policyname = 'Authenticated users can create comments') THEN
        CREATE POLICY "Authenticated users can create comments" ON post_comments
            FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
    END IF;
    
    -- 允许用户更新自己的评论
    IF NOT EXISTS (SELECT FROM pg_policies 
                   WHERE tablename = 'post_comments' 
                   AND policyname = 'Users can update their own comments') THEN
        CREATE POLICY "Users can update their own comments" ON post_comments
            FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    -- 允许用户删除自己的评论
    IF NOT EXISTS (SELECT FROM pg_policies 
                   WHERE tablename = 'post_comments' 
                   AND policyname = 'Users can delete their own comments') THEN
        CREATE POLICY "Users can delete their own comments" ON post_comments
            FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- 5. 创建更新触发器
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_post_comments_updated_at 
    BEFORE UPDATE ON post_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 6. 验证表创建成功
DO $$ 
DECLARE
    table_exists BOOLEAN;
    comment_count INTEGER;
BEGIN
    -- 检查表是否存在
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'post_comments'
    ) INTO table_exists;
    
    IF table_exists THEN
        -- 统计评论数量
        SELECT COUNT(*) INTO comment_count FROM post_comments;
        
        RAISE NOTICE '✅ post_comments 表创建成功！';
        RAISE NOTICE '📊 当前评论数量: %', comment_count;
    ELSE
        RAISE NOTICE '❌ post_comments 表创建失败';
    END IF;
END $$;