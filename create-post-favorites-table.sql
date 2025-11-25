-- 创建帖子收藏表
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 创建帖子收藏表
CREATE TABLE IF NOT EXISTS post_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- 确保一个用户只能收藏同一帖子一次
    UNIQUE(user_id, post_id)
);

-- 2. 为表添加索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_post_favorites_user_id ON post_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_post_favorites_post_id ON post_favorites(post_id);
CREATE INDEX IF NOT EXISTS idx_post_favorites_created_at ON post_favorites(created_at);

-- 3. 启用行级安全策略
ALTER TABLE post_favorites ENABLE ROW LEVEL SECURITY;

-- 4. 创建 RLS 策略
-- 用户可以查看自己的收藏
CREATE POLICY "Users can view their own post favorites" ON post_favorites
    FOR SELECT USING (auth.uid() = user_id);

-- 用户可以添加自己的收藏
CREATE POLICY "Users can insert their own post favorites" ON post_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 用户可以删除自己的收藏
CREATE POLICY "Users can delete their own post favorites" ON post_favorites
    FOR DELETE USING (auth.uid() = user_id);

-- 5. 创建触发器自动更新帖子收藏数
CREATE OR REPLACE FUNCTION update_post_favorite_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- 新增收藏时，帖子收藏数+1
        UPDATE community_posts 
        SET favorite_count = COALESCE(favorite_count, 0) + 1
        WHERE id = NEW.post_id;
        
    ELSIF TG_OP = 'DELETE' THEN
        -- 删除收藏时，帖子收藏数-1
        UPDATE community_posts 
        SET favorite_count = GREATEST(COALESCE(favorite_count, 0) - 1, 0)
        WHERE id = OLD.post_id;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
DROP TRIGGER IF EXISTS trigger_update_post_favorite_count ON post_favorites;
CREATE TRIGGER trigger_update_post_favorite_count
    AFTER INSERT OR DELETE ON post_favorites
    FOR EACH ROW EXECUTE FUNCTION update_post_favorite_count();

-- 6. 验证表创建
DO $$
DECLARE
    table_exists BOOLEAN;
    trigger_exists BOOLEAN;
BEGIN
    -- 检查表是否存在
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'post_favorites'
    ) INTO table_exists;
    
    -- 检查触发器是否存在
    SELECT EXISTS (
        SELECT FROM information_schema.triggers 
        WHERE trigger_name = 'trigger_update_post_favorite_count'
    ) INTO trigger_exists;
    
    RAISE NOTICE '🎉 帖子收藏表创建完成！';
    RAISE NOTICE '📊 表创建状态: %', 
        CASE WHEN table_exists THEN '✅ 已创建' ELSE '❌ 创建失败' END;
    RAISE NOTICE '🔧 触发器状态: %', 
        CASE WHEN trigger_exists THEN '✅ 已创建' ELSE '❌ 创建失败' END;
    
    IF table_exists AND trigger_exists THEN
        RAISE NOTICE '✅ 帖子收藏功能已准备就绪！';
    ELSE
        RAISE NOTICE '⚠️ 请检查表创建是否成功';
    END IF;
END $$;