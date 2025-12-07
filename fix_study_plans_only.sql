-- ============================================
-- 学习计划功能专用修复脚本
-- 在 Supabase SQL Editor 中执行这个脚本
-- ============================================

-- 1. 首先检查并创建 study_plans 表
-- ============================================
CREATE TABLE IF NOT EXISTS study_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('pending', 'in_progress', 'completed', 'paused')),
    start_date DATE NOT NULL,
    target_date DATE NOT NULL,
    daily_hours DECIMAL(4,2) DEFAULT 2.0 CHECK (daily_hours > 0 AND daily_hours <= 24),
    total_hours DECIMAL(6,2),  -- 学习总时长（可选）
    resource_name VARCHAR(255),  -- 关联资源名称
    resource_url TEXT,  -- 资源链接
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. 创建 study_plan_checkins 表
-- ============================================
CREATE TABLE IF NOT EXISTS study_plan_checkins (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    study_plan_id UUID NOT NULL REFERENCES study_plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
    checkin_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. 创建索引以提高查询性能
-- ============================================
-- study_plans 表索引
CREATE INDEX IF NOT EXISTS idx_study_plans_user_id ON study_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_study_plans_status ON study_plans(status);
CREATE INDEX IF NOT EXISTS idx_study_plans_created_at ON study_plans(created_at DESC);

-- study_plan_checkins 表索引
CREATE INDEX IF NOT EXISTS idx_study_plan_checkins_study_plan_id ON study_plan_checkins(study_plan_id);
CREATE INDEX IF NOT EXISTS idx_study_plan_checkins_user_id ON study_plan_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_study_plan_checkins_date ON study_plan_checkins(checkin_date);
CREATE INDEX IF NOT EXISTS idx_study_plan_checkins_created_at ON study_plan_checkins(created_at DESC);

-- 确保每个用户每天只能为同一个学习计划打卡一次
CREATE UNIQUE INDEX IF NOT EXISTS unique_checkin_per_day 
ON study_plan_checkins(study_plan_id, user_id, checkin_date);

-- 4. 创建触发器自动更新 updated_at 字段
-- ============================================
-- study_plans 表触发器
DROP TRIGGER IF EXISTS update_study_plans_updated_at ON study_plans;
CREATE TRIGGER update_study_plans_updated_at 
    BEFORE UPDATE ON study_plans 
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- study_plan_checkins 表触发器
DROP TRIGGER IF EXISTS update_study_plan_checkins_updated_at ON study_plan_checkins;
CREATE TRIGGER update_study_plan_checkins_updated_at 
    BEFORE UPDATE ON study_plan_checkins 
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. 禁用并重新配置 RLS (行级安全策略)
-- ============================================
-- 先禁用 RLS
ALTER TABLE study_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE study_plan_checkins DISABLE ROW LEVEL SECURITY;

-- 删除现有策略（如果存在）
DROP POLICY IF EXISTS "Users can view their own plans" ON study_plans;
DROP POLICY IF EXISTS "Users can create their own plans" ON study_plans;
DROP POLICY IF EXISTS "Users can update their own plans" ON study_plans;
DROP POLICY IF EXISTS "Users can delete their own plans" ON study_plans;

DROP POLICY IF EXISTS "Users can view their own checkins" ON study_plan_checkins;
DROP POLICY IF EXISTS "Users can create their own checkins" ON study_plan_checkins;
DROP POLICY IF EXISTS "Users can update their own checkins" ON study_plan_checkins;
DROP POLICY IF EXISTS "Users can delete their own checkins" ON study_plan_checkins;

-- 重新启用 RLS
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plan_checkins ENABLE ROW LEVEL SECURITY;

-- study_plans 表策略 - 用户只能操作自己的计划
CREATE POLICY "Users can view their own plans" ON study_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own plans" ON study_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plans" ON study_plans
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plans" ON study_plans
    FOR DELETE USING (auth.uid() = user_id);

-- study_plan_checkins 表策略 - 用户只能操作自己的打卡记录
CREATE POLICY "Users can view their own checkins" ON study_plan_checkins
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own checkins" ON study_plan_checkins
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checkins" ON study_plan_checkins
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own checkins" ON study_plan_checkins
    FOR DELETE USING (auth.uid() = user_id);

-- 6. 插入一些测试数据（可选）
-- ============================================
-- 注意：如果已经有数据，这部分可以跳过

-- 检查是否已有数据，如果没有则插入测试数据
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM study_plans LIMIT 1) THEN
        -- 插入测试学习计划
        INSERT INTO study_plans (title, description, user_id, start_date, target_date, daily_hours, total_hours, resource_name, resource_url, status, progress)
        VALUES 
        (
            'Vue.js 入门学习',
            '学习 Vue.js 基础知识，包括组件、指令、生命周期等',
            (SELECT id FROM auth.users LIMIT 1), -- 使用第一个用户ID
            CURRENT_DATE,
            CURRENT_DATE + INTERVAL '14 days',
            2.0,
            28.0,
            'Vue.js 官方文档',
            'https://vuejs.org/',
            'in_progress',
            20
        ),
        (
            'React 高级特性',
            '深入学习 React Hooks、Context、性能优化等高级主题',
            (SELECT id FROM auth.users LIMIT 1),
            CURRENT_DATE + INTERVAL '7 days',
            CURRENT_DATE + INTERVAL '21 days',
            3.0,
            42.0,
            'React 官方教程',
            'https://react.dev/',
            'in_progress',
            0
        );
        
        -- 为第一个计划插入一些测试打卡记录
        INSERT INTO study_plan_checkins (study_plan_id, user_id, checkin_date, notes)
        SELECT 
            sp.id,
            sp.user_id,
            CURRENT_DATE - INTERVAL '1 day', -- 昨天
            'Vue.js 基础学习完成'
        FROM study_plans sp
        WHERE sp.title = 'Vue.js 入门学习'
        LIMIT 1;
    END IF;
END $$;

-- 7. 验证脚本执行结果
-- ============================================
SELECT 
    'study_plans' as table_name,
    COUNT(*) as record_count,
    MIN(created_at) as earliest_record,
    MAX(created_at) as latest_record
FROM study_plans

UNION ALL

SELECT 
    'study_plan_checkins' as table_name,
    COUNT(*) as record_count,
    MIN(created_at) as earliest_record,
    MAX(created_at) as latest_record
FROM study_plan_checkins;

-- 8. 显示成功消息
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ 学习计划功能数据库修复完成！';
    RAISE NOTICE '📋 创建的表: study_plans, study_plan_checkins';
    RAISE NOTICE '🔒 RLS 策略已配置，用户只能访问自己的数据';
    RAISE NOTICE '⚡ 索引已创建，查询性能已优化';
    RAISE NOTICE '🎯 如有测试数据，可以直接测试打卡功能';
END $$;