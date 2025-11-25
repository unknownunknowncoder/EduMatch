-- 为 study_plans 表添加 total_hours 字段
-- 学习总时长字段，允许为空（可选字段）

-- 检查表是否存在，然后添加字段
DO $$ 
BEGIN
    -- 检查表是否存在
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'study_plans') THEN
        -- 检查字段是否已存在
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_name = 'study_plans' AND column_name = 'total_hours') THEN
            -- 添加 total_hours 字段
            ALTER TABLE study_plans ADD COLUMN total_hours DECIMAL(6,2);
            
            RAISE NOTICE '✅ 成功为 study_plans 表添加 total_hours 字段';
        ELSE
            RAISE NOTICE 'ℹ️ study_plans 表已存在 total_hours 字段';
        END IF;
    ELSE
        RAISE NOTICE '❌ study_plans 表不存在，请先创建表';
    END IF;
END $$;