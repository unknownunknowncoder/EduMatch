-- 修复用户数据隔离 - 基于用户ID的RLS策略
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 首先检查表结构和RLS状态
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS启用状态"
FROM pg_tables 
WHERE tablename IN ('study_plans', 'resources', 'learning_records', 'favorites');

-- 2. 确保所有表都启用了RLS
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 3. 删除所有现有策略（从头开始）
-- study_plans 表
DROP POLICY IF EXISTS "Users can view their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can insert their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can update their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can delete their own study plans" ON study_plans;

-- resources 表
DROP POLICY IF EXISTS "Anyone can view resources" ON resources;
DROP POLICY IF EXISTS "Users can insert their own resources" ON resources;
DROP POLICY IF EXISTS "Users can update their own resources" ON resources;
DROP POLICY IF EXISTS "Users can delete their own resources" ON resources;

-- learning_records 表
DROP POLICY IF EXISTS "Users can view their own learning records" ON learning_records;
DROP POLICY IF EXISTS "Users can insert their own learning records" ON learning_records;
DROP POLICY IF EXISTS "Users can update their own learning records" ON learning_records;

-- favorites 表
DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can manage their own favorites" ON favorites;

-- 4. 创建新的基于用户ID的RLS策略
-- study_plans 表：用户只能看到自己的学习计划
CREATE POLICY "Users can view their own study plans" ON study_plans
    FOR SELECT USING (user_id::text = current_setting('request.headers')::json->>'x-user-id');

CREATE POLICY "Users can insert their own study plans" ON study_plans
    FOR INSERT WITH CHECK (user_id::text = current_setting('request.headers')::json->>'x-user-id');

CREATE POLICY "Users can update their own study plans" ON study_plans
    FOR UPDATE USING (user_id::text = current_setting('request.headers')::json->>'x-user-id');

CREATE POLICY "Users can delete their own study plans" ON study_plans
    FOR DELETE USING (user_id::text = current_setting('request.headers')::json->>'x-user-id');

-- resources 表：所有人可查看，但只能管理自己的资源
CREATE POLICY "Anyone can view resources" ON resources
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own resources" ON resources
    FOR INSERT WITH CHECK (created_by::text = current_setting('request.headers')::json->>'x-user-id');

CREATE POLICY "Users can update their own resources" ON resources
    FOR UPDATE USING (created_by::text = current_setting('request.headers')::json->>'x-user-id');

CREATE POLICY "Users can delete their own resources" ON resources
    FOR DELETE USING (created_by::text = current_setting('request.headers')::json->>'x-user-id');

-- learning_records 表：用户只能看到自己的学习记录
CREATE POLICY "Users can view their own learning records" ON learning_records
    FOR SELECT USING (user_id::text = current_setting('request.headers')::json->>'x-user-id');

CREATE POLICY "Users can insert their own learning records" ON learning_records
    FOR INSERT WITH CHECK (user_id::text = current_setting('request.headers')::json->>'x-user-id');

CREATE POLICY "Users can update their own learning records" ON learning_records
    FOR UPDATE USING (user_id::text = current_setting('request.headers')::json->>'x-user-id');

-- favorites 表：用户只能看到自己的收藏
CREATE POLICY "Users can view their own favorites" ON favorites
    FOR SELECT USING (user_id::text = current_setting('request.headers')::json->>'x-user-id');

CREATE POLICY "Users can manage their own favorites" ON favorites
    FOR ALL USING (user_id::text = current_setting('request.headers')::json->>'x-user-id');

-- 5. 验证策略创建成功
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual 
FROM pg_policies 
WHERE tablename IN ('study_plans', 'resources', 'learning_records', 'favorites')
ORDER BY tablename, cmd;

-- 6. 重要：刷新缓存确保策略生效
NOTIFY pgrst, 'reload schema';

-- 完成！现在RLS策略应该正确工作了
-- 注意：这种方案需要前端在请求头中传递用户ID