# 用户数据隔离指南

## 问题描述

当前数据库中所有数据都属于"zxq"用户，当切换其他账号时，无法看到除了学习社区以外的内容（学习计划、个人资源等），只有在新账号中自己发布的内容才可见。

## 解决方案

### 1. 执行数据库RLS策略修复

**重要：先在 Supabase SQL Editor 中执行以下SQL脚本**

```sql
-- 复制以下内容到 Supabase SQL Editor 中执行
-- 文件位置：fix-user-data-isolation.sql

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
```

### 2. 前端代码修复

我已经修复了前端代码中的硬编码用户ID问题：

**已修复的文件：**

1. **`src/views/StudyPlanPage.vue`**
   - 移除硬编码的admin用户ID
   - 改为从localStorage获取当前登录用户
   - 添加登录检查逻辑

2. **`src/views/CreateResource.vue`**
   - 移除硬编码的admin用户ID
   - 改为从localStorage获取当前登录用户
   - 添加登录检查逻辑

### 3. 测试流程

#### 步骤1：执行SQL脚本
1. 登录 Supabase 控制台
2. 进入 SQL Editor
3. 复制并执行 `fix-user-data-isolation.sql` 文件中的SQL语句
4. 确认所有策略创建成功

#### 步骤2：测试用户数据隔离
1. 使用 "zxq" 账号登录
2. 查看学习计划、个人资源等页面
3. 使用其他账号登录（如新注册的账号）
4. 确认新账号只能看到空列表或自己创建的内容

#### 步骤3：测试数据创建
1. 使用新账号创建学习计划
2. 使用新账号发布资源
3. 确认数据正确关联到当前用户
4. 切换回 "zxq" 账号，确认看不到新账号创建的内容

### 4. 预期效果

**数据隔离规则：**

- **学习计划 (study_plans)**：每个用户只能看到自己的学习计划
- **个人资源 (resources)**：所有人可以查看，但只能管理自己创建的资源
- **学习记录 (learning_records)**：每个用户只能看到自己的学习记录
- **收藏 (favorites)**：每个用户只能看到自己的收藏
- **社区帖子 (community_posts)**：所有人可以查看，但只能管理自己的帖子
- **评论 (post_comments)**：所有人可以查看，但只能管理自己的评论

**用户界面：**

- 未登录用户：显示空列表或提示登录
- 已登录用户：只能看到自己创建的内容
- 学习社区：所有用户都可以查看所有帖子（公共区域）

### 5. 故障排除

**常见问题：**

1. **RLS策略不生效**
   - 检查SQL执行结果，确认策略创建成功
   - 执行 `NOTIFY pgrst, 'reload schema';` 刷新缓存

2. **前端显示错误**
   - 检查浏览器控制台错误信息
   - 确认localStorage中存储了正确的用户信息

3. **数据访问权限问题**
   - 确认数据库中的 `user_id` 或 `created_by` 字段正确关联到用户ID
   - 检查RLS策略中的条件是否正确

### 6. 文件清单

- `fix-user-data-isolation.sql` - 数据库RLS策略修复脚本
- `src/views/StudyPlanPage.vue` - 学习计划页面（已修复）
- `src/views/CreateResource.vue` - 创建资源页面（已修复）
- `src/views/ProfilePage.vue` - 个人中心页面（部分修复）

### 7. 注意事项

1. **数据迁移**：现有数据仍然属于"zxq"用户，新用户需要自行创建内容
2. **社区功能**：学习社区仍然是公共区域，所有用户都可以查看所有帖子
3. **登录检查**：前端已添加登录检查，未登录用户将无法创建内容
4. **测试验证**：请务必按照测试流程验证修复效果

完成以上步骤后，用户数据隔离功能将正常工作，每个用户只能看到和管理自己的数据。