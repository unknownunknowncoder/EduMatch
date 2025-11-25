-- 修复点赞功能完整SQL脚本
-- 在Supabase SQL编辑器中执行此脚本

-- 1. 禁用点赞表的RLS策略
ALTER TABLE post_likes DISABLE ROW LEVEL SECURITY;

-- 2. 确保点赞表有正确的外键关系
-- 检查并修复外键关系
DO $$ 
BEGIN
    -- 检查外键是否存在
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'post_likes_post_id_fkey' 
        AND table_name = 'post_likes'
    ) THEN
        -- 添加外键关系
        ALTER TABLE post_likes 
        ADD CONSTRAINT post_likes_post_id_fkey 
        FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'post_likes_user_id_fkey' 
        AND table_name = 'post_likes'
    ) THEN
        ALTER TABLE post_likes 
        ADD CONSTRAINT post_likes_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 3. 创建示例点赞数据
INSERT INTO post_likes (post_id, user_id) VALUES
    -- 为帖子1添加点赞
    ('第一个帖子的UUID', 'b6c871eb-717c-4a40-859b-b639cf8ccd08'),
    -- 为帖子2添加点赞
    ('第二个帖子的UUID', 'b6c871eb-717c-4a40-859b-b639cf8ccd08'),
    -- 为帖子3添加点赞
    ('第三个帖子的UUID', 'b6c871eb-717c-4a40-859b-b639cf8ccd08');

-- 注意：需要替换上面的UUID为实际的帖子ID

-- 4. 更新社区帖子的点赞计数
UPDATE community_posts 
SET likes_count = (
    SELECT COUNT(*) 
    FROM post_likes 
    WHERE post_likes.post_id = community_posts.id
);

-- 5. 创建合适的RLS策略（可选，根据安全需求）
-- ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- 6. 创建策略允许所有用户查看点赞
-- CREATE POLICY "任何人都可以查看点赞" ON post_likes
-- FOR SELECT USING (true);

-- 7. 创建策略允许认证用户点赞
-- CREATE POLICY "认证用户可以点赞" ON post_likes
-- FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 8. 创建策略允许用户取消自己的点赞
-- CREATE POLICY "用户可以取消自己的点赞" ON post_likes
-- FOR DELETE USING (auth.uid() = user_id);

-- 9. 验证修复结果
SELECT 
    p.id as post_id,
    p.title,
    p.likes_count,
    COUNT(pl.id) as actual_likes,
    u.username as liked_by
FROM community_posts p
LEFT JOIN post_likes pl ON p.id = pl.post_id
LEFT JOIN users u ON pl.user_id = u.id
GROUP BY p.id, p.title, p.likes_count, u.username
ORDER BY p.likes_count DESC;

-- 10. 显示详细的点赞信息
SELECT 
    p.title as "帖子标题",
    p.author as "帖子作者", 
    u.username as "点赞用户",
    u.nickname as "用户昵称",
    pl.created_at as "点赞时间"
FROM post_likes pl
JOIN community_posts p ON pl.post_id = p.id
JOIN users u ON pl.user_id = u.id
ORDER BY pl.created_at DESC;