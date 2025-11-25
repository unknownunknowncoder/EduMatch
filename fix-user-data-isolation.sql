-- 修复用户数据隔离 - 让每个用户只能看到自己的数据
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 首先检查当前RLS策略状态
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS状态"
FROM pg_tables 
WHERE tablename IN ('study_plans', 'resources', 'learning_records', 'favorites', 'community_posts', 'post_comments');

-- 2. 为 study_plans 表添加用户隔离RLS策略
-- 删除现有策略
DROP POLICY IF EXISTS "Users can view their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can insert their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can update their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can delete their own study plans" ON study_plans;

-- 创建新的用户隔离策略
CREATE POLICY "Users can view their own study plans" ON study_plans
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own study plans" ON study_plans
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own study plans" ON study_plans
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own study plans" ON study_plans
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- 3. 为 resources 表添加用户隔离RLS策略
-- 删除现有策略
DROP POLICY IF EXISTS "Anyone can view resources" ON resources;
DROP POLICY IF EXISTS "Authenticated users can insert resources" ON resources;
DROP POLICY IF EXISTS "Users can update their own resources" ON resources;
DROP POLICY IF EXISTS "Users can delete their own resources" ON resources;

-- 创建新的用户隔离策略
-- 允许所有人查看资源（学习社区功能）
CREATE POLICY "Anyone can view resources" ON resources
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own resources" ON resources
    FOR INSERT WITH CHECK (auth.uid()::text = created_by::text);

CREATE POLICY "Users can update their own resources" ON resources
    FOR UPDATE USING (auth.uid()::text = created_by::text);

CREATE POLICY "Users can delete their own resources" ON resources
    FOR DELETE USING (auth.uid()::text = created_by::text);

-- 4. 为 learning_records 表添加用户隔离RLS策略
-- 删除现有策略
DROP POLICY IF EXISTS "Users can view their own learning records" ON learning_records;
DROP POLICY IF EXISTS "Users can insert their own learning records" ON learning_records;
DROP POLICY IF EXISTS "Users can update their own learning records" ON learning_records;

-- 创建新的用户隔离策略
CREATE POLICY "Users can view their own learning records" ON learning_records
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own learning records" ON learning_records
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own learning records" ON learning_records
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- 5. 为 favorites 表添加用户隔离RLS策略
-- 删除现有策略
DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can manage their own favorites" ON favorites;

-- 创建新的用户隔离策略
CREATE POLICY "Users can view their own favorites" ON favorites
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own favorites" ON favorites
    FOR ALL USING (auth.uid()::text = user_id::text);

-- 6. 为 community_posts 表保持现有策略（允许所有人查看，但只能管理自己的帖子）
-- 保持现有策略不变，因为社区帖子需要公开可见

-- 7. 为 post_comments 表保持现有策略（允许所有人查看，但只能管理自己的评论）
-- 保持现有策略不变，因为评论需要公开可见

-- 8. 验证所有表的RLS状态
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS状态",
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = t.tablename) as "策略数量"
FROM pg_tables t
WHERE tablename IN ('study_plans', 'resources', 'learning_records', 'favorites', 'community_posts', 'post_comments');

-- 9. 显示各表的策略详情
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

-- 10. 重要：刷新缓存确保策略生效
NOTIFY pgrst, 'reload schema';

-- 完成！现在每个用户只能看到和管理自己的数据
-- 学习社区中的帖子仍然对所有用户可见，这是预期的行为