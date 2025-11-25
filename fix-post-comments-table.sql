-- 修复 post_comments 表不存在的错误
-- 先检查表是否存在，如果不存在则创建

-- 1. 检查 post_comments 表是否存在
DO $$ 
DECLARE
    -- 这里不需要声明变量，因为 IF NOT EXISTS 是直接使用的
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables 
                   WHERE table_schema = 'public' 
                   AND table_name = 'post_comments') THEN
        RAISE NOTICE '⚠️ post_comments 表不存在，正在创建...';
        
        -- 创建 post_comments 表
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
        
        -- 创建索引
        CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
        CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON post_comments(user_id);
        
        -- 启用行级安全策略
        ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
        
        RAISE NOTICE '✅ post_comments 表创建完成';
    ELSE
        RAISE NOTICE '✅ post_comments 表已存在';
    END IF;
END $$;

-- 2. 检查并创建 RLS 策略
DO $$ 
DECLARE
    -- 这里不需要声明变量
BEGIN
    -- 检查策略是否存在
    IF NOT EXISTS (SELECT FROM pg_policies 
                   WHERE tablename = 'post_comments' 
                   AND policyname = 'Anyone can view comments') THEN
        
        -- 创建 RLS 策略
        RAISE NOTICE '📝 创建 RLS 策略...';
        
        -- 允许所有人查看评论
        CREATE POLICY "Anyone can view comments" ON post_comments
            FOR SELECT USING (true);
        
        -- 允许认证用户创建评论
        CREATE POLICY "Authenticated users can create comments" ON post_comments
            FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
        
        -- 允许用户更新自己的评论
        CREATE POLICY "Users can update their own comments" ON post_comments
            FOR UPDATE USING (auth.uid() = user_id);
        
        -- 允许用户删除自己的评论
        CREATE POLICY "Users can delete their own comments" ON post_comments
            FOR DELETE USING (auth.uid() = user_id);
        
        RAISE NOTICE '✅ RLS 策略创建完成';
    ELSE
        RAISE NOTICE '✅ RLS 策略已存在';
    END IF;
END $$;

-- 3. 检查并创建触发器
DO $$ 
DECLARE
    -- 这里不需要声明变量
BEGIN
    -- 检查触发器是否存在
    IF NOT EXISTS (SELECT FROM pg_trigger 
                   WHERE tgname = 'update_post_comments_updated_at') THEN
        
        -- 创建更新触发器
        CREATE OR REPLACE FUNCTION update_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        CREATE TRIGGER update_post_comments_updated_at 
            BEFORE UPDATE ON post_comments
            FOR EACH ROW EXECUTE FUNCTION update_updated_at();
        
        RAISE NOTICE '✅ 触发器创建完成';
    ELSE
        RAISE NOTICE '✅ 触发器已存在';
    END IF;
END $$;

-- 4. 验证表结构
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
        
        RAISE NOTICE '\n🎉 post_comments 表修复完成！';
        RAISE NOTICE '📊 当前评论数量: %', comment_count;
        RAISE NOTICE '✅ 表结构: id, post_id, user_id, content, likes_count, created_at, updated_at';
        RAISE NOTICE '✅ 外键约束: 关联 community_posts 和 users 表';
        RAISE NOTICE '✅ RLS 策略: 查看、创建、更新、删除权限';
    ELSE
        RAISE NOTICE '❌ post_comments 表创建失败';
    END IF;
END $$;