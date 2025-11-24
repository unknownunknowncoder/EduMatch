-- 确保点赞和收藏表结构完整的SQL脚本
-- 在 Supabase SQL Editor 中执行

-- 1. 检查并创建帖子点赞表
DO $$
BEGIN
    -- 检查表是否存在
    IF NOT EXISTS (SELECT FROM information_schema.tables 
                   WHERE table_schema = 'public' 
                   AND table_name = 'post_likes') THEN
        
        -- 创建帖子点赞表
        CREATE TABLE post_likes (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            
            -- 确保每个用户对每个帖子只能点赞一次
            UNIQUE(post_id, user_id)
        );
        
        -- 创建索引
        CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
        CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);
        CREATE INDEX idx_post_likes_created_at ON post_likes(created_at DESC);
        
        RAISE NOTICE '✅ 帖子点赞表创建成功';
    ELSE
        RAISE NOTICE '📊 帖子点赞表已存在';
    END IF;
END $$;

-- 2. 检查并创建帖子收藏表
DO $$
BEGIN
    -- 检查表是否存在
    IF NOT EXISTS (SELECT FROM information_schema.tables 
                   WHERE table_schema = 'public' 
                   AND table_name = 'post_favorites') THEN
        
        -- 创建帖子收藏表
        CREATE TABLE post_favorites (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            
            -- 确保每个用户对每个帖子只能收藏一次
            UNIQUE(post_id, user_id)
        );
        
        -- 创建索引
        CREATE INDEX idx_post_favorites_post_id ON post_favorites(post_id);
        CREATE INDEX idx_post_favorites_user_id ON post_favorites(user_id);
        CREATE INDEX idx_post_favorites_created_at ON post_favorites(created_at DESC);
        
        RAISE NOTICE '✅ 帖子收藏表创建成功';
    ELSE
        RAISE NOTICE '📊 帖子收藏表已存在';
    END IF;
END $$;

-- 3. 确保 community_posts 表有收藏计数字段
DO $$
BEGIN
    -- 检查字段是否存在
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'community_posts' 
                   AND column_name = 'favorite_count') THEN
        
        -- 添加收藏计数字段
        ALTER TABLE community_posts ADD COLUMN favorite_count INTEGER DEFAULT 0;
        RAISE NOTICE '✅ 为社区帖子表添加了收藏计数字段';
    ELSE
        RAISE NOTICE '📊 社区帖子表已有收藏计数字段';
    END IF;
END $$;

-- 4. 创建点赞计数更新触发器
DO $$
BEGIN
    -- 检查触发器函数是否存在
    IF NOT EXISTS (SELECT FROM information_schema.routines 
                   WHERE routine_schema = 'public' 
                   AND routine_name = 'update_post_likes_count') THEN
        
        -- 创建点赞计数更新触发器函数
        CREATE OR REPLACE FUNCTION update_post_likes_count()
        RETURNS TRIGGER AS $$
        BEGIN
            IF TG_OP = 'INSERT' THEN
                UPDATE community_posts 
                SET likes_count = COALESCE(likes_count, 0) + 1
                WHERE id = NEW.post_id;
            ELSIF TG_OP = 'DELETE' THEN
                UPDATE community_posts 
                SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0)
                WHERE id = OLD.post_id;
            END IF;
            RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;
        
        RAISE NOTICE '✅ 点赞计数触发器函数创建成功';
    END IF;
    
    -- 检查触发器是否存在
    IF NOT EXISTS (SELECT FROM information_schema.triggers 
                   WHERE trigger_name = 'trigger_update_post_likes_count') THEN
        
        -- 创建触发器
        CREATE TRIGGER trigger_update_post_likes_count
            AFTER INSERT OR DELETE ON post_likes
            FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();
        
        RAISE NOTICE '✅ 点赞计数触发器创建成功';
    END IF;
END $$;

-- 5. 创建收藏计数更新触发器
DO $$
BEGIN
    -- 检查触发器函数是否存在
    IF NOT EXISTS (SELECT FROM information_schema.routines 
                   WHERE routine_schema = 'public' 
                   AND routine_name = 'update_post_favorite_count') THEN
        
        -- 创建收藏计数更新触发器函数
        CREATE OR REPLACE FUNCTION update_post_favorite_count()
        RETURNS TRIGGER AS $$
        BEGIN
            IF TG_OP = 'INSERT' THEN
                UPDATE community_posts 
                SET favorite_count = COALESCE(favorite_count, 0) + 1
                WHERE id = NEW.post_id;
            ELSIF TG_OP = 'DELETE' THEN
                UPDATE community_posts 
                SET favorite_count = GREATEST(COALESCE(favorite_count, 0) - 1, 0)
                WHERE id = OLD.post_id;
            END IF;
            RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;
        
        RAISE NOTICE '✅ 收藏计数触发器函数创建成功';
    END IF;
    
    -- 检查触发器是否存在
    IF NOT EXISTS (SELECT FROM information_schema.triggers 
                   WHERE trigger_name = 'trigger_update_post_favorite_count') THEN
        
        -- 创建触发器
        CREATE TRIGGER trigger_update_post_favorite_count
            AFTER INSERT OR DELETE ON post_favorites
            FOR EACH ROW EXECUTE FUNCTION update_post_favorite_count();
        
        RAISE NOTICE '✅ 收藏计数触发器创建成功';
    END IF;
END $$;

-- 6. 启用行级安全策略(RLS)
DO $$
BEGIN
    -- 点赞表RLS
    IF NOT EXISTS (SELECT FROM information_schema.tables 
                   WHERE table_schema = 'public' 
                   AND table_name = 'post_likes' 
                   AND row_security = 'YES') THEN
        
        ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE '✅ 点赞表RLS已启用';
    END IF;
    
    -- 收藏表RLS
    IF NOT EXISTS (SELECT FROM information_schema.tables 
                   WHERE table_schema = 'public' 
                   AND table_name = 'post_favorites' 
                   AND row_security = 'YES') THEN
        
        ALTER TABLE post_favorites ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE '✅ 收藏表RLS已启用';
    END IF;
END $$;

-- 7. 创建RLS策略
DO $$
BEGIN
    -- 点赞表策略
    -- 任何人都可以查看点赞记录
    IF NOT EXISTS (SELECT FROM pg_policies 
                   WHERE tablename = 'post_likes' 
                   AND policyname = '任何人都可以查看点赞记录') THEN
        
        CREATE POLICY "任何人都可以查看点赞记录" ON post_likes
            FOR SELECT USING (true);
    END IF;
    
    -- 用户只能添加自己的点赞
    IF NOT EXISTS (SELECT FROM pg_policies 
                   WHERE tablename = 'post_likes' 
                   AND policyname = '用户只能添加自己的点赞') THEN
        
        CREATE POLICY "用户只能添加自己的点赞" ON post_likes
            FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    -- 用户只能删除自己的点赞
    IF NOT EXISTS (SELECT FROM pg_policies 
                   WHERE tablename = 'post_likes' 
                   AND policyname = '用户只能删除自己的点赞') THEN
        
        CREATE POLICY "用户只能删除自己的点赞" ON post_likes
            FOR DELETE USING (auth.uid() = user_id);
    END IF;
    
    -- 禁止更新点赞记录
    IF NOT EXISTS (SELECT FROM pg_policies 
                   WHERE tablename = 'post_likes' 
                   AND policyname = '禁止更新点赞记录') THEN
        
        CREATE POLICY "禁止更新点赞记录" ON post_likes
            FOR UPDATE USING (false);
    END IF;
    
    -- 收藏表策略
    -- 用户可以查看自己的收藏
    IF NOT EXISTS (SELECT FROM pg_policies 
                   WHERE tablename = 'post_favorites' 
                   AND policyname = '用户可以查看自己的收藏') THEN
        
        CREATE POLICY "用户可以查看自己的收藏" ON post_favorites
            FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    -- 用户可以添加自己的收藏
    IF NOT EXISTS (SELECT FROM pg_policies 
                   WHERE tablename = 'post_favorites' 
                   AND policyname = '用户可以添加自己的收藏') THEN
        
        CREATE POLICY "用户可以添加自己的收藏" ON post_favorites
            FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    -- 用户可以删除自己的收藏
    IF NOT EXISTS (SELECT FROM pg_policies 
                   WHERE tablename = 'post_favorites' 
                   AND policyname = '用户可以删除自己的收藏') THEN
        
        CREATE POLICY "用户可以删除自己的收藏" ON post_favorites
            FOR DELETE USING (auth.uid() = user_id);
    END IF;
    
    -- 禁止更新收藏记录
    IF NOT EXISTS (SELECT FROM pg_policies 
                   WHERE tablename = 'post_favorites' 
                   AND policyname = '禁止更新收藏记录') THEN
        
        CREATE POLICY "禁止更新收藏记录" ON post_favorites
            FOR UPDATE USING (false);
    END IF;
    
    RAISE NOTICE '✅ RLS策略创建完成';
END $$;

-- 8. 验证表结构
DO $$
DECLARE
    likes_count INTEGER;
    favorites_count INTEGER;
    posts_count INTEGER;
BEGIN
    -- 统计表记录数量
    SELECT COUNT(*) INTO likes_count FROM post_likes;
    SELECT COUNT(*) INTO favorites_count FROM post_favorites;
    SELECT COUNT(*) INTO posts_count FROM community_posts;
    
    RAISE NOTICE '\n🎉 点赞和收藏功能数据库检查完成！';
    RAISE NOTICE '📊 表结构统计:';
    RAISE NOTICE '   ✅ community_posts: % 条记录', posts_count;
    RAISE NOTICE '   ✅ post_likes: % 条记录', likes_count;
    RAISE NOTICE '   ✅ post_favorites: % 条记录', favorites_count;
    RAISE NOTICE '\n🔧 功能特性:';
    RAISE NOTICE '   ✅ 完整的点赞和收藏表结构';
    RAISE NOTICE '   ✅ 自动计数更新触发器';
    RAISE NOTICE '   ✅ 行级安全策略(RLS)';
    RAISE NOTICE '   ✅ 高性能索引';
    RAISE NOTICE '\n🚀 点赞和收藏功能已准备就绪！';
END $$;