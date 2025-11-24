-- 验证数据库清理结果
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 检查最终数据状态
DO $$
DECLARE
    user_count INTEGER;
    post_count INTEGER;
    comment_count INTEGER;
    mock_post_count INTEGER;
    invalid_comment_count INTEGER;
    table_exists BOOLEAN;
BEGIN
    -- 统计用户数量
    SELECT COUNT(*) INTO user_count FROM users;
    
    -- 统计帖子数量
    SELECT COUNT(*) INTO post_count FROM community_posts;
    
    -- 检查 post_comments 表是否存在
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'post_comments'
    ) INTO table_exists;
    
    -- 如果表存在则统计评论数量
    IF table_exists THEN
        SELECT COUNT(*) INTO comment_count FROM post_comments;
    ELSE
        comment_count := 0;
    END IF;
    
    -- 检查剩余模拟帖子
    SELECT COUNT(*) INTO mock_post_count 
    FROM community_posts 
    WHERE user_id NOT IN (SELECT id FROM users);
    
    -- 检查剩余无效评论
    IF table_exists THEN
        SELECT COUNT(*) INTO invalid_comment_count 
        FROM post_comments 
        WHERE user_id NOT IN (SELECT id FROM users);
    ELSE
        invalid_comment_count := 0;
    END IF;
    
    RAISE NOTICE '🎉 数据库清理验证完成！';
    RAISE NOTICE '📊 当前数据库状态:';
    RAISE NOTICE '   👥 注册用户数量: %', user_count;
    RAISE NOTICE '   📄 帖子数量: %', post_count;
    RAISE NOTICE '   💬 评论数量: %', comment_count;
    RAISE NOTICE '🔍 剩余模拟帖子: %', mock_post_count;
    RAISE NOTICE '🔍 剩余无效用户评论: %', invalid_comment_count;
    
    IF mock_post_count = 0 AND invalid_comment_count = 0 THEN
        RAISE NOTICE '✅ 所有模拟数据清理完成！';
        RAISE NOTICE '✅ 数据库已准备好进行正常使用';
    ELSE
        RAISE NOTICE '⚠️ 仍有部分模拟数据需要手动清理';
    END IF;
    
    IF NOT table_exists THEN
        RAISE NOTICE '⚠️ post_comments 表不存在，请先创建该表';
    ELSE
        RAISE NOTICE '✅ post_comments 表已存在且正常';
    END IF;
END $$;