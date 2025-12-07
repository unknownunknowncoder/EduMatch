-- 为 study_plan_checkins 表添加 hours 字段
-- 学习时长字段，用于存储每次打卡的学习时长

-- 检查表是否存在，然后添加字段
DO $$ 
BEGIN
    -- 检查表是否存在
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'study_plan_checkins') THEN
        -- 检查字段是否已存在
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_name = 'study_plan_checkins' AND column_name = 'hours') THEN
            -- 添加 hours 字段
            ALTER TABLE study_plan_checkins ADD COLUMN hours DECIMAL(4,1) DEFAULT 1.0;
            
            -- 添加注释
            COMMENT ON COLUMN study_plan_checkins.hours IS '学习时长（小时）';
            
            RAISE NOTICE '✅ 成功为 study_plan_checkins 表添加 hours 字段';
        ELSE
            RAISE NOTICE 'ℹ️ study_plan_checkins 表已存在 hours 字段';
        END IF;
    ELSE
        RAISE NOTICE '❌ study_plan_checkins 表不存在，请先创建表';
    END IF;
END $$;

-- 验证字段添加成功
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'study_plan_checkins' 
    AND column_name = 'hours';