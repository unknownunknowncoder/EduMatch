-- 创建帖子点赞表
CREATE TABLE IF NOT EXISTS post_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- 确保每个用户对每个帖子只能点赞一次
    UNIQUE(post_id, user_id)
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_created_at ON post_likes(created_at DESC);

-- 创建触发器函数：更新帖子点赞数
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

-- 创建触发器
DROP TRIGGER IF EXISTS trigger_update_post_likes_count ON post_likes;
CREATE TRIGGER trigger_update_post_likes_count
    AFTER INSERT OR DELETE ON post_likes
    FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

-- 启用行级安全策略(RLS)
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户可以查看所有点赞记录
CREATE POLICY "任何人都可以查看点赞记录" ON post_likes
    FOR SELECT USING (true);

-- 创建策略：用户只能插入自己的点赞记录
CREATE POLICY "用户只能添加自己的点赞" ON post_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 创建策略：用户只能删除自己的点赞记录
CREATE POLICY "用户只能删除自己的点赞" ON post_likes
    FOR DELETE USING (auth.uid() = user_id);

-- 创建策略：用户不能更新点赞记录
CREATE POLICY "禁止更新点赞记录" ON post_likes
    FOR UPDATE USING (false);

-- 注释说明
COMMENT ON TABLE post_likes IS '存储帖子点赞记录，支持用户对帖子进行点赞和取消点赞操作';
COMMENT ON COLUMN post_likes.id IS '主键ID';
COMMENT ON COLUMN post_likes.post_id IS '关联的帖子ID';
COMMENT ON COLUMN post_likes.user_id IS '点赞的用户ID';
COMMENT ON COLUMN post_likes.created_at IS '点赞时间';

-- 插入一些示例数据用于测试
-- INSERT INTO post_likes (post_id, user_id) VALUES 
--     ('123e4567-e89b-12d3-a456-426614174000', 'b6c871eb-717c-4a40-859b-b639cf8ccd08'),
--     ('123e4567-e89b-12d3-a456-426614174001', 'b6c871eb-717c-4a40-859b-b639cf8ccd08');

-- 验证表结构
SELECT 
    '✅ 点赞表创建成功' as status,
    COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_name = 'post_likes';

-- 显示表结构
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'post_likes' 
ORDER BY ordinal_position;