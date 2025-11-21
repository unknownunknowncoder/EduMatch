-- 修复 study_plans 表的 RLS 策略
-- 在 Supabase SQL Editor 中执行以下语句

-- 删除现有的限制性策略
DROP POLICY IF EXISTS "Users can view their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can create their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can update their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can delete their own study plans" ON study_plans;

-- 创建更宽松的策略（适合开发和测试）
CREATE POLICY "Anyone can view study plans" ON study_plans
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create study plans" ON study_plans
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update study plans" ON study_plans
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete study plans" ON study_plans
    FOR DELETE USING (true);

-- 生产环境应该使用更严格的策略：
-- CREATE POLICY "Users can view their own study plans" ON study_plans
--     FOR SELECT USING (auth.uid()::text = user_id::text OR auth.uid() IS NULL);
-- 
-- CREATE POLICY "Users can create their own study plans" ON study_plans
--     FOR INSERT WITH CHECK (auth.uid()::text = user_id::text OR auth.uid() IS NULL);
-- 
-- CREATE POLICY "Users can update their own study plans" ON study_plans
--     FOR UPDATE USING (auth.uid()::text = user_id::text OR auth.uid() IS NULL);
-- 
-- CREATE POLICY "Users can delete their own study plans" ON study_plans
--     FOR DELETE USING (auth.uid()::text = user_id::text OR auth.uid() IS NULL);