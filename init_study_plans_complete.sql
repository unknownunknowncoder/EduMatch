-- 完整的学习计划功能数据库初始化脚本
-- 在 Supabase SQL Editor 中按顺序执行以下语句

-- ============================================
-- 1. 创建 study_plans 表（如果不存在）
-- ============================================
CREATE TABLE IF NOT EXISTS study_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- ============================================
-- 2. 创建 study_plan_checkins 表（如果不存在）
-- ============================================
CREATE TABLE IF NOT EXISTS study_plan_checkins (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    study_plan_id UUID NOT NULL REFERENCES study_plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
    checkin_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
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

-- ============================================
-- 4. 启用 RLS (Row Level Security)
-- ============================================
-- 为 study_plans 表启用 RLS
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;

-- 为 study_plan_checkins 表启用 RLS
ALTER TABLE study_plan_checkins ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. 删除现有的 RLS 策略（如果存在）
-- ============================================
-- study_plans 表策略
DROP POLICY IF EXISTS "Users can view their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can create their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can update their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can delete their own study plans" ON study_plans;

-- study_plan_checkins 表策略
DROP POLICY IF EXISTS "Users can view their own checkins" ON study_plan_checkins;
DROP POLICY IF EXISTS "Users can create their own checkins" ON study_plan_checkins;
DROP POLICY IF EXISTS "Users can update their own checkins" ON study_plan_checkins;
DROP POLICY IF EXISTS "Users can delete their own checkins" ON study_plan_checkins;

-- ============================================
-- 6. 创建新的 RLS 策略
-- ============================================
-- study_plans 表策略
CREATE POLICY "Users can view their own study plans" ON study_plans
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own study plans" ON study_plans
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own study plans" ON study_plans
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own study plans" ON study_plans
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- study_plan_checkins 表策略
CREATE POLICY "Users can view their own checkins" ON study_plan_checkins
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own checkins" ON study_plan_checkins
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own checkins" ON study_plan_checkins
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own checkins" ON study_plan_checkins
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- ============================================
-- 7. 创建触发器以自动更新 updated_at 字段
-- ============================================
-- 创建通用的更新时间函数（如果不存在）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为 study_plans 表创建触发器
DROP TRIGGER IF EXISTS update_study_plans_updated_at ON study_plans;
CREATE TRIGGER update_study_plans_updated_at 
    BEFORE UPDATE ON study_plans 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 为 study_plan_checkins 表创建触发器
DROP TRIGGER IF EXISTS update_study_plan_checkins_updated_at ON study_plan_checkins;
CREATE TRIGGER update_study_plan_checkins_updated_at 
    BEFORE UPDATE ON study_plan_checkins 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. 验证表创建成功
-- ============================================
-- 检查 study_plans 表结构
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'study_plans' 
ORDER BY ordinal_position;

-- 检查 study_plan_checkins 表结构
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'study_plan_checkins' 
ORDER BY ordinal_position;

-- ============================================
-- 9. 检查 RLS 策略状态
-- ============================================
-- 检查 study_plans 表的 RLS 策略
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'study_plans';

-- 检查 study_plan_checkins 表的 RLS 策略
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'study_plan_checkins';

-- ============================================
-- 10. 测试数据插入（可选）
-- ============================================
-- 注意：取消注释以下代码可以插入测试数据
-- INSERT INTO study_plans (user_id, title, description, start_date, target_date, daily_hours)
-- VALUES (
--     auth.uid(),
--     '测试学习计划',
--     '这是一个测试学习计划，用于验证功能',
--     CURRENT_DATE,
--     CURRENT_DATE + INTERVAL '30 days',
--     2.0
-- );

SELECT '✅ 学习计划功能数据库初始化完成！' as status;