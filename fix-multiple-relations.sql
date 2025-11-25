-- 修复多个外键关系导致的查询冲突

-- 1. 首先检查当前的外键关系
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

-- 2. 如果存在多个外键关系，我们需要删除重复的或不需要的关系
-- 检查是否存在多个指向 community_posts 的外键
DO $$
DECLARE
    fk_count INTEGER;
    fk_name TEXT;
BEGIN
    -- 统计指向 community_posts 的外键数量
    SELECT COUNT(*) INTO fk_count
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
    WHERE tc.table_name = 'post_likes'
    AND tc.constraint_type = 'FOREIGN KEY'
    AND ccu.table_name = 'community_posts';
    
    IF fk_count > 1 THEN
        RAISE NOTICE '发现 % 个指向 community_posts 的外键，需要清理', fk_count;
        
        -- 保留一个外键，删除其他的
        -- 获取第一个外键名称
        SELECT tc.constraint_name INTO fk_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
        WHERE tc.table_name = 'post_likes'
        AND tc.constraint_type = 'FOREIGN KEY'
        AND ccu.table_name = 'community_posts'
        LIMIT 1;
        
        RAISE NOTICE '保留外键: %', fk_name;
        
        -- 删除其他指向 community_posts 的外键
        FOR fk_name IN 
            SELECT tc.constraint_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
                ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage AS ccu
                ON ccu.constraint_name = tc.constraint_name
            WHERE tc.table_name = 'post_likes'
            AND tc.constraint_type = 'FOREIGN KEY'
            AND ccu.table_name = 'community_posts'
            AND tc.constraint_name != fk_name
        LOOP
            EXECUTE 'ALTER TABLE post_likes DROP CONSTRAINT IF EXISTS ' || fk_name;
            RAISE NOTICE '删除外键: %', fk_name;
        END LOOP;
    ELSE
        RAISE NOTICE '外键关系正常，无需清理';
    END IF;
END $$;

-- 3. 确保只保留一个指向 community_posts 的外键
-- 如果不存在外键，重新添加一个
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'post_likes' 
        AND constraint_type = 'FOREIGN KEY'
        AND constraint_name = 'post_likes_post_id_fkey'
    ) THEN
        -- 添加外键约束
        ALTER TABLE post_likes 
        ADD CONSTRAINT post_likes_post_id_fkey 
        FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE;
        RAISE NOTICE '添加了 post_id 外键约束';
    ELSE
        RAISE NOTICE 'post_id 外键约束已存在';
    END IF;
    
    -- 同样处理指向 auth.users 的外键
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'post_likes' 
        AND constraint_type = 'FOREIGN KEY'
        AND constraint_name = 'post_likes_user_id_fkey'
    ) THEN
        ALTER TABLE post_likes 
        ADD CONSTRAINT post_likes_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
        RAISE NOTICE '添加了 user_id 外键约束';
    ELSE
        RAISE NOTICE 'user_id 外键约束已存在';
    END IF;
END $$;

-- 4. 验证修复结果
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