-- 清理社区模拟数据 SQL 脚本
-- 在 Supabase SQL Editor 中直接执行此脚本

-- 0. 先检查 post_comments 表是否存在
DO $$ 
DECLARE
    table_exists BOOLEAN;
BEGIN
    -- 检查表是否存在
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'post_comments'
    ) INTO table_exists;
    
    IF NOT table_exists THEN
        RAISE NOTICE '⚠️ post_comments 表不存在，跳过评论相关的清理操作';
    END IF;
END $$;

-- 1. 首先检查当前数据库状态
DO $$ 
DECLARE
    user_count INTEGER;
    post_count INTEGER;
    comment_count INTEGER;
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
    
    RAISE NOTICE '📊 当前数据库状态:';
    RAISE NOTICE '   👥 注册用户数量: %', user_count;
    RAISE NOTICE '   📄 帖子数量: %', post_count;
    RAISE NOTICE '   💬 评论数量: %', comment_count;
    
    IF NOT table_exists THEN
        RAISE NOTICE '   ⚠️ post_comments 表不存在';
    END IF;
END $$;

-- 2. 识别并删除模拟帖子（没有对应注册用户的帖子）
DO $$ 
DECLARE
    mock_post_count INTEGER;
    mock_post_ids UUID[];
    table_exists BOOLEAN;
BEGIN
    -- 检查 post_comments 表是否存在
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'post_comments'
    ) INTO table_exists;
    
    -- 识别模拟帖子
    SELECT ARRAY_AGG(id) INTO mock_post_ids 
    FROM community_posts 
    WHERE user_id NOT IN (SELECT id FROM users);
    
    -- 统计数量
    SELECT COUNT(*) INTO mock_post_count 
    FROM community_posts 
    WHERE user_id NOT IN (SELECT id FROM users);
    
    IF mock_post_count > 0 THEN
        RAISE NOTICE '🔍 发现 % 个模拟帖子', mock_post_count;
        
        -- 如果 post_comments 表存在，先删除相关的评论
        IF table_exists THEN
            DELETE FROM post_comments 
            WHERE post_id = ANY(mock_post_ids);
            
            RAISE NOTICE '🗑️ 已删除模拟帖子相关的评论';
        END IF;
        
        -- 删除模拟帖子
        DELETE FROM community_posts 
        WHERE id = ANY(mock_post_ids);
        
        RAISE NOTICE '✅ 已删除 % 个模拟帖子', mock_post_count;
    ELSE
        RAISE NOTICE '✅ 没有发现模拟帖子';
    END IF;
END $$;

-- 3. 删除孤立评论（没有对应帖子的评论）
DO $$ 
DECLARE
    orphaned_comment_count INTEGER;
    table_exists BOOLEAN;
BEGIN
    -- 检查 post_comments 表是否存在
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'post_comments'
    ) INTO table_exists;
    
    IF NOT table_exists THEN
        RAISE NOTICE '⚠️ post_comments 表不存在，跳过孤立评论清理';
        RETURN;
    END IF;
    
    -- 统计孤立评论
    SELECT COUNT(*) INTO orphaned_comment_count 
    FROM post_comments pc
    LEFT JOIN community_posts cp ON pc.post_id = cp.id
    WHERE cp.id IS NULL;
    
    IF orphaned_comment_count > 0 THEN
        RAISE NOTICE '🔍 发现 % 个孤立评论', orphaned_comment_count;
        
        -- 删除孤立评论
        DELETE FROM post_comments pc
        WHERE NOT EXISTS (
            SELECT 1 FROM community_posts cp WHERE cp.id = pc.post_id
        );
        
        RAISE NOTICE '✅ 已删除 % 个孤立评论', orphaned_comment_count;
    ELSE
        RAISE NOTICE '✅ 没有发现孤立评论';
    END IF;
END $$;

-- 4. 删除没有对应注册用户的评论
DO $$ 
DECLARE
    invalid_user_comment_count INTEGER;
    table_exists BOOLEAN;
BEGIN
    -- 检查 post_comments 表是否存在
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'post_comments'
    ) INTO table_exists;
    
    IF NOT table_exists THEN
        RAISE NOTICE '⚠️ post_comments 表不存在，跳过无效用户评论清理';
        RETURN;
    END IF;
    
    -- 统计无效用户评论
    SELECT COUNT(*) INTO invalid_user_comment_count 
    FROM post_comments 
    WHERE user_id NOT IN (SELECT id FROM users);
    
    IF invalid_user_comment_count > 0 THEN
        RAISE NOTICE '🔍 发现 % 个无效用户评论', invalid_user_comment_count;
        
        -- 删除无效用户评论
        DELETE FROM post_comments 
        WHERE user_id NOT IN (SELECT id FROM users);
        
        RAISE NOTICE '✅ 已删除 % 个无效用户评论', invalid_user_comment_count;
    ELSE
        RAISE NOTICE '✅ 没有发现无效用户评论';
    END IF;
END $$;

-- 5. 验证清理结果
DO $$ 
DECLARE
    final_user_count INTEGER;
    final_post_count INTEGER;
    final_comment_count INTEGER;
    remaining_mock_posts INTEGER;
    remaining_invalid_comments INTEGER;
    table_exists BOOLEAN;
BEGIN
    -- 最终统计
    SELECT COUNT(*) INTO final_user_count FROM users;
    SELECT COUNT(*) INTO final_post_count FROM community_posts;
    
    -- 检查 post_comments 表是否存在
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'post_comments'
    ) INTO table_exists;
    
    -- 如果表存在则统计评论数量
    IF table_exists THEN
        SELECT COUNT(*) INTO final_comment_count FROM post_comments;
    ELSE
        final_comment_count := 0;
    END IF;
    
    -- 检查剩余模拟数据
    SELECT COUNT(*) INTO remaining_mock_posts 
    FROM community_posts 
    WHERE user_id NOT IN (SELECT id FROM users);
    
    -- 如果表存在则检查剩余无效评论
    IF table_exists THEN
        SELECT COUNT(*) INTO remaining_invalid_comments 
        FROM post_comments 
        WHERE user_id NOT IN (SELECT id FROM users);
    ELSE
        remaining_invalid_comments := 0;
    END IF;
    
    RAISE NOTICE '\n🎉 清理完成！';
    RAISE NOTICE '📊 最终数据库状态:';
    RAISE NOTICE '   👥 注册用户数量: %', final_user_count;
    RAISE NOTICE '   📄 帖子数量: %', final_post_count;
    RAISE NOTICE '   💬 评论数量: %', final_comment_count;
    RAISE NOTICE '🔍 剩余模拟帖子: %', remaining_mock_posts;
    RAISE NOTICE '🔍 剩余无效用户评论: %', remaining_invalid_comments;
    
    IF NOT table_exists THEN
        RAISE NOTICE '   ⚠️ post_comments 表不存在';
    END IF;
    
    IF remaining_mock_posts = 0 AND remaining_invalid_comments = 0 THEN
        RAISE NOTICE '✅ 所有模拟数据清理完成！';
        RAISE NOTICE '✅ 只保留注册用户发布的帖子和评论';
    ELSE
        RAISE NOTICE '⚠️ 仍有部分模拟数据需要手动清理';
    END IF;
END $$;