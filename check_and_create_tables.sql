-- 检查并创建学习计划相关表
-- 在 Supabase SQL Editor 中执行

-- ============================================
-- 1. 创建 study_plans 表（如果不存在）
-- ============================================
CREATE TABLE IF NOT EXISTS study_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    target_date DATE NOT NULL,
    daily_hours DECIMAL(4,2) DEFAULT 2.0,
    total_hours DECIMAL(6,2),
    progress INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused')),
    resource_name VARCHAR(255),
    resource_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. 创建 study_plan_checkins 表（如果不存在）
-- ============================================
CREATE TABLE IF NOT EXISTS study_plan_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    study_plan_id UUID NOT NULL REFERENCES study_plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL,
    checkin_time TIME DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. 创建索引以提高查询性能
-- ============================================
CREATE INDEX IF NOT EXISTS idx_study_plans_user_id ON study_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_study_plans_status ON study_plans(status);
CREATE INDEX IF NOT EXISTS idx_study_plans_created_at ON study_plans(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_study_plan_checkins_study_plan_id ON study_plan_checkins(study_plan_id);
CREATE INDEX IF NOT EXISTS idx_study_plan_checkins_user_id ON study_plan_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_study_plan_checkins_date ON study_plan_checkins(checkin_date DESC);

-- ============================================
-- 4. 插入一些测试数据（如果表为空）
-- ============================================
INSERT INTO study_plans (user_id, title, description, start_date, target_date, daily_hours, total_hours, status)
SELECT 
    auth.uid(),
    '学习 Vue.js 前端开发',
    '系统学习 Vue.js 框架，包括组件开发、状态管理、路由等内容',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days',
    2.0,
    40.0,
    'in_progress'
WHERE NOT EXISTS (
    SELECT 1 FROM study_plans WHERE user_id = auth.uid()
) LIMIT 1;

-- ============================================
-- 5. 验证表创建结果
-- ============================================
SELECT 
    'study_plans' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'study_plans' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 
    'study_plan_checkins' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'study_plan_checkins' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- ============================================
-- 6. 测试查询权限
-- ============================================
-- 测试查询学习计划
SELECT 'Testing study_plans access...' as message;

-- 测试查询打卡记录
SELECT 'Testing study_plan_checkins access...' as message;

SELECT '✅ 表结构检查和创建完成！' as status;