-- 删除 post_comments 表中的模拟评论数据
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 首先查看当前的评论数据
DO $$
DECLARE
    total_comments INTEGER;
    simulated_comments INTEGER;
    valid_comments INTEGER;
BEGIN
    -- 统计总评论数
    SELECT COUNT(*) INTO total_comments FROM post_comments;
    
    -- 统计模拟评论数（user_id 不在 users 表中的评论）
    SELECT COUNT(*) INTO simulated_comments 
    FROM post_comments 
    WHERE user_id NOT IN (SELECT id FROM users);
    
    -- 统计有效评论数
    SELECT COUNT(*) INTO valid_comments 
    FROM post_comments 
    WHERE user_id IN (SELECT id FROM users);
    
    RAISE NOTICE '📊 当前评论数据状态:';
    RAISE NOTICE '   总评论数量: %', total_comments;
    RAISE NOTICE '   模拟评论数量: %', simulated_comments;
    RAISE NOTICE '   有效评论数量: %', valid_comments;
    
    -- 显示模拟评论的详细信息
    IF simulated_comments > 0 THEN
        RAISE NOTICE '🔍 模拟评论详情:';
        -- 使用单独的变量来显示每条评论
        DECLARE
            comment_id UUID;
            comment_user_id UUID;
            comment_post_id UUID;
            comment_content TEXT;
            comment_created_at TIMESTAMP;
        BEGIN
            FOR comment_id, comment_user_id, comment_post_id, comment_content, comment_created_at IN 
                SELECT id, user_id, post_id, content, created_at 
                FROM post_comments 
                WHERE user_id NOT IN (SELECT id FROM users)
            LOOP
                RAISE NOTICE '   评论ID: %, 用户ID: %, 帖子ID: %, 内容: %, 创建时间: %', 
                    comment_id, 
                    comment_user_id, 
                    comment_post_id, 
                    comment_content, 
                    comment_created_at;
            END LOOP;
        END;
    END IF;
END $$;

-- 2. 删除模拟评论数据
DO $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- 删除所有模拟评论（user_id 不在 users 表中的评论）
    DELETE FROM post_comments 
    WHERE user_id NOT IN (SELECT id FROM users);
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RAISE NOTICE '🗑️ 已删除 % 条模拟评论', deleted_count;
    
    IF deleted_count = 0 THEN
        RAISE NOTICE '✅ 没有发现模拟评论需要删除';
    END IF;
END $$;

-- 3. 验证删除结果
DO $$
DECLARE
    remaining_simulated INTEGER;
    remaining_valid INTEGER;
BEGIN
    -- 检查剩余模拟评论
    SELECT COUNT(*) INTO remaining_simulated 
    FROM post_comments 
    WHERE user_id NOT IN (SELECT id FROM users);
    
    -- 检查剩余有效评论
    SELECT COUNT(*) INTO remaining_valid 
    FROM post_comments 
    WHERE user_id IN (SELECT id FROM users);
    
    RAISE NOTICE '\n🎉 评论清理完成！';
    RAISE NOTICE '📊 清理后评论状态:';
    RAISE NOTICE '   剩余模拟评论: %', remaining_simulated;
    RAISE NOTICE '   剩余有效评论: %', remaining_valid;
    
    IF remaining_simulated = 0 THEN
        RAISE NOTICE '✅ 所有模拟评论已成功删除！';
        RAISE NOTICE '✅ 现在只显示真实用户的评论';
    ELSE
        RAISE NOTICE '⚠️ 仍有 % 条模拟评论需要处理', remaining_simulated;
    END IF;
END $$;