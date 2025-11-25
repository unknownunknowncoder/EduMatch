-- 修复点赞和收藏功能的数据库结构

-- 1. 确保 post_likes 表有正确的结构
DO $$ 
BEGIN
    -- 检查并修复 post_likes 表
    IF NOT EXISTS (SELECT FROM information_schema.tables 
                   WHERE table_schema = 'public' 
                   AND table_name = 'post_likes') THEN
        CREATE TABLE post_likes (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL,
            post_id UUID NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, post_id)
        );
        
        -- 添加外键约束
        ALTER TABLE post_likes ADD CONSTRAINT fk_post_likes_user 
            FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
        ALTER TABLE post_likes ADD CONSTRAINT fk_post_likes_post 
            FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE;
            
        -- 创建索引
        CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);
        CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
        CREATE INDEX idx_post_likes_created_at ON post_likes(created_at);
        
        RAISE NOTICE '创建了 post_likes 表';
    ELSE
        -- 检查并修复外键约束
        IF NOT EXISTS (SELECT FROM information_schema.table_constraints 
                       WHERE constraint_name = 'fk_post_likes_post') THEN
            ALTER TABLE post_likes ADD CONSTRAINT fk_post_likes_post 
                FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE;
            RAISE NOTICE '添加了 post_likes 表的外键约束';
        END IF;
    END IF;
    
    -- 检查并修复 post_favorites 表
    IF NOT EXISTS (SELECT FROM information_schema.tables 
                   WHERE table_schema = 'public' 
                   AND table_name = 'post_favorites') THEN
        CREATE TABLE post_favorites (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL,
            post_id UUID NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, post_id)
        );
        
        -- 添加外键约束
        ALTER TABLE post_favorites ADD CONSTRAINT fk_post_favorites_user 
            FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
        ALTER TABLE post_favorites ADD CONSTRAINT fk_post_favorites_post 
            FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE;
            
        -- 创建索引
        CREATE INDEX idx_post_favorites_user_id ON post_favorites(user_id);
        CREATE INDEX idx_post_favorites_post_id ON post_favorites(post_id);
        CREATE INDEX idx_post_favorites_created_at ON post_favorites(created_at);
        
        RAISE NOTICE '创建了 post_favorites 表';
    END IF;
    
    -- 2. 启用和配置 RLS
    ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
    ALTER TABLE post_favorites ENABLE ROW LEVEL SECURITY;
    
    -- 3. 创建 RLS 策略
    -- 点赞表的策略：用户可以查看所有点赞，但只能管理自己的点赞
    DROP POLICY IF EXISTS "任何人都可以查看点赞" ON post_likes;
    CREATE POLICY "任何人都可以查看点赞" ON post_likes
        FOR SELECT USING (true);
        
    DROP POLICY IF EXISTS "用户只能管理自己的点赞" ON post_likes;
    CREATE POLICY "用户只能管理自己的点赞" ON post_likes
        FOR ALL USING (auth.uid() = user_id);
    
    -- 收藏表的策略：用户可以查看所有收藏，但只能管理自己的收藏
    DROP POLICY IF EXISTS "任何人都可以查看收藏" ON post_favorites;
    CREATE POLICY "任何人都可以查看收藏" ON post_favorites
        FOR SELECT USING (true);
        
    DROP POLICY IF EXISTS "用户只能管理自己的收藏" ON post_favorites;
    CREATE POLICY "用户只能管理自己的收藏" ON post_favorites
        FOR ALL USING (auth.uid() = user_id);
    
    RAISE NOTICE 'RLS 策略配置完成';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '修复过程中出现错误: %', SQLERRM;
END $$;