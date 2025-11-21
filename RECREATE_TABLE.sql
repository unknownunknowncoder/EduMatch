-- 完全重新创建表（如果 RLS 禁用失败）
-- 仅在 ALTER TABLE 失败时使用

-- 1. 删除现有表
DROP TABLE IF EXISTS study_plans CASCADE;

-- 2. 重新创建表（不启用 RLS）
CREATE TABLE study_plans (
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

-- 3. 创建索引
CREATE INDEX idx_study_plans_user_id ON study_plans(user_id);
CREATE INDEX idx_study_plans_status ON study_plans(status);
CREATE INDEX idx_study_plans_created_at ON study_plans(created_at DESC);

-- 4. 确保触发器函数存在
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. 创建触发器（确保不会重复）
DROP TRIGGER IF EXISTS update_study_plans_updated_at ON study_plans;
CREATE TRIGGER update_study_plans_updated_at BEFORE UPDATE ON study_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. 验证表状态
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS状态"
FROM pg_tables 
WHERE tablename = 'study_plans';