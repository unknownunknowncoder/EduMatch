-- 学习计划功能数据库修复脚本
-- 执行前请确保在 Supabase SQL Editor 中运行

-- 1. 修复 study_plans 表结构
ALTER TABLE study_plans 
DROP COLUMN IF EXISTS last_checkin_date,
ADD COLUMN IF NOT EXISTS checkin_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
ALTER COLUMN progress SET DEFAULT 0;

-- 2. 确保 study_plan_checkins 表有正确的字段和索引
CREATE INDEX IF NOT EXISTS idx_study_plan_checkins_plan_date ON study_plan_checkins(study_plan_id, checkin_date);
CREATE INDEX IF NOT EXISTS idx_study_plan_checkins_user_plan ON study_plan_checkins(user_id, study_plan_id);

-- 3. 删除并重新创建 RLS 策略（确保用户只能访问自己的数据）
DROP POLICY IF EXISTS "Users can view own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can insert own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can update own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can delete own study plans" ON study_plans;

CREATE POLICY "Users can view own study plans" ON study_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own study plans" ON study_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own study plans" ON study_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own study plans" ON study_plans FOR DELETE USING (auth.uid() = user_id);

-- 4. 修复 study_plan_checkins 表的 RLS 策略
DROP POLICY IF EXISTS "Users can view own checkins" ON study_plan_checkins;
DROP POLICY IF EXISTS "Users can insert own checkins" ON study_plan_checkins;

CREATE POLICY "Users can view own checkins" ON study_plan_checkins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own checkins" ON study_plan_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. 更新现有数据
UPDATE study_plans sp 
SET checkin_count = COALESCE(sub.checkin_count, 0)
FROM (
    SELECT study_plan_id, COUNT(*) as checkin_count
    FROM study_plan_checkins
    GROUP BY study_plan_id
) sub
WHERE sp.id = sub.study_plan_id;

-- 6. 基于打卡次数计算进度
UPDATE study_plans 
SET progress = LEAST(checkin_count * 10, 100)
WHERE checkin_count > 0 AND progress = 0;

-- 7. 显示修复结果
SELECT 
    'study_plans' as table_name, 
    COUNT(*) as record_count 
FROM study_plans
UNION ALL
SELECT 
    'study_plan_checkins' as table_name, 
    COUNT(*) as record_count 
FROM study_plan_checkins;

-- 完成提示
SELECT '✅ 学习计划数据库修复完成！' as status;