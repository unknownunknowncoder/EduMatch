-- 添加学习计划表
-- 在 Supabase SQL Editor 中执行以下语句

-- 学习计划表
CREATE TABLE IF NOT EXISTS study_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    progress DECIMAL(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'paused')),
    start_date DATE,
    target_date DATE,
    daily_hours DECIMAL(4,2) CHECK (daily_hours > 0),
    resource_name VARCHAR(255),
    resource_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_study_plans_user_id ON study_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_study_plans_status ON study_plans(status);
CREATE INDEX IF NOT EXISTS idx_study_plans_created_at ON study_plans(created_at DESC);

-- 启用 RLS
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;

-- 删除现有的策略（如果存在）
DROP POLICY IF EXISTS "Users can view their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can create their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can update their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can delete their own study plans" ON study_plans;

-- 创建 RLS 策略
CREATE POLICY "Users can view their own study plans" ON study_plans
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own study plans" ON study_plans
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own study plans" ON study_plans
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own study plans" ON study_plans
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- 创建更新时间触发器
CREATE TRIGGER update_study_plans_updated_at BEFORE UPDATE ON study_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();