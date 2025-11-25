-- 修复点赞表外键约束语法错误
-- 问题：PostgreSQL 不支持 ADD CONSTRAINT IF NOT EXISTS 语法

-- 1. 检查并创建点赞表（如果不存在）
CREATE TABLE IF NOT EXISTS post_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- 确保每个用户对每个帖子只能点赞一次
    UNIQUE(post_id, user_id)
);

-- 2. 安全地添加外键约束（先检查是否存在）
DO $$ 
BEGIN
    -- 检查并添加 post_id 外键
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_post_likes_post' 
        AND table_name = 'post_likes'
    ) THEN
        ALTER TABLE post_likes 
        ADD CONSTRAINT fk_post_likes_post 
        FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE;
        RAISE NOTICE '添加了 post_id 外键约束';
    END IF;
    
    -- 检查并添加 user_id 外键
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_post_likes_user' 
        AND table_name = 'post_likes'
    ) THEN
        ALTER TABLE post_likes 
        ADD CONSTRAINT fk_post_likes_user 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
        RAISE NOTICE '添加了 user_id 外键约束';
    END IF;
END $$;

-- 3. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_created_at ON post_likes(created_at DESC);

-- 4. 创建触发器函数：更新帖子点赞数
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

-- 5. 创建触发器
DROP TRIGGER IF EXISTS trigger_update_post_likes_count ON post_likes;
CREATE TRIGGER trigger_update_post_likes_count
    AFTER INSERT OR DELETE ON post_likes
    FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

-- 6. 禁用RLS（根据用户要求）
ALTER TABLE post_likes DISABLE ROW LEVEL SECURITY;

-- 7. 验证表结构
SELECT 
    '✅ 点赞表创建成功' as status,
    COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_name = 'post_likes';

-- 8. 显示表结构
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'post_likes' 
ORDER BY ordinal_position;

-- 9. 显示外键约束
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'post_likes'
ORDER BY tc.constraint_type, tc.constraint_name;