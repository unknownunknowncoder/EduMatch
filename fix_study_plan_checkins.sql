-- 创建学习计划打卡记录表（完整版）
-- 在 Supabase SQL Editor 中执行以下语句

-- 首先检查表是否存在，如果不存在则创建
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

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_study_plan_checkins_study_plan_id ON study_plan_checkins(study_plan_id);
CREATE INDEX IF NOT EXISTS idx_study_plan_checkins_user_id ON study_plan_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_study_plan_checkins_date ON study_plan_checkins(checkin_date);
CREATE INDEX IF NOT EXISTS idx_study_plan_checkins_created_at ON study_plan_checkins(created_at DESC);

-- 确保每个用户每天只能为同一个学习计划打卡一次
CREATE UNIQUE INDEX IF NOT EXISTS unique_checkin_per_day 
ON study_plan_checkins(study_plan_id, user_id, checkin_date);

-- 启用 RLS
ALTER TABLE study_plan_checkins ENABLE ROW LEVEL SECURITY;

-- 删除现有的策略（如果存在）
DROP POLICY IF EXISTS "Users can view their own checkins" ON study_plan_checkins;
DROP POLICY IF EXISTS "Users can create their own checkins" ON study_plan_checkins;
DROP POLICY IF EXISTS "Users can update their own checkins" ON study_plan_checkins;
DROP POLICY IF EXISTS "Users can delete their own checkins" ON study_plan_checkins;

-- 创建 RLS 策略
CREATE POLICY "Users can view their own checkins" ON study_plan_checkins
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own checkins" ON study_plan_checkins
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own checkins" ON study_plan_checkins
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own checkins" ON study_plan_checkins
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- 创建触发器以自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_study_plan_checkins_updated_at 
    BEFORE UPDATE ON study_plan_checkins 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 验证表创建成功
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'study_plan_checkins' 
ORDER BY ordinal_position;