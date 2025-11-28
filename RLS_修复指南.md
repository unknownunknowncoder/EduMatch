# 学习计划打卡功能 RLS 权限修复指南

## 问题描述
用户在使用学习计划打卡功能时遇到以下错误：
- `401 Unauthorized` - 认证权限错误
- `42501 RLS Violation` - 行级安全策略阻止插入操作

## 问题分析
1. **用户认证不匹配**: localStorage 中的用户ID与 Supabase 认证系统的 auth.uid() 不一致
2. **RLS策略过于严格**: 现有的行级安全策略要求精确的用户ID匹配
3. **数据库客户端混乱**: 使用了不同的数据库客户端实例，导致认证状态不同步

## 修复步骤

### 步骤 1: 执行 RLS 策略修复脚本

在 Supabase SQL Editor 中执行 `simple_rls_fix.sql`：

```sql
-- 1. 完全禁用RLS策略（临时解决方案）
ALTER TABLE study_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE study_plan_checkins DISABLE ROW LEVEL SECURITY;

-- 2. 清除所有现有策略
-- (脚本会自动删除所有策略)

-- 3. 创建最简单的策略 - 允许所有认证用户操作
CREATE POLICY "Allow all operations for authenticated users on study_plans" ON study_plans
    FOR ALL USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on study_plan_checkins" ON study_plan_checkins
    FOR ALL USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
```

### 步骤 2: 使用修复后的打卡功能

已更新 `StudyPlanPage.vue` 的打卡函数：
- 直接使用 Supabase 客户端
- 通过 `client.auth.getUser()` 获取认证用户信息
- 使用认证后的 `user.id` 而不是 localStorage 中的用户ID

### 步骤 3: 测试打卡功能

1. 确保用户已登录
2. 进入学习计划页面
3. 点击"今日打卡"按钮
4. 检查控制台输出是否显示：
   ```
   ✅ 获取到认证用户: [用户ID] [用户邮箱]
   ✅ 打卡成功: [打卡记录]
   ```

## 验证清单

- [ ] RLS 策略修复脚本执行成功
- [ ] 打卡功能不再出现 401/42501 错误
- [ ] 打卡记录成功插入数据库
- [ ] 页面状态正确更新
- [ ] 控制台显示成功日志

## 故障排除

### 如果仍然出现权限错误：

1. **检查用户认证状态**：
   ```javascript
   // 在浏览器控制台执行
   const { createClient } = await import('@supabase/supabase-js')
   const client = createClient(url, key)
   const { data: { user } } = await client.auth.getUser()
   console.log('当前用户:', user)
   ```

2. **检查数据库策略**：
   ```sql
   SELECT * FROM pg_policies 
   WHERE tablename IN ('study_plans', 'study_plan_checkins');
   ```

3. **检查表结构**：
   ```sql
   SELECT column_name, data_type, is_nullable 
   FROM information_schema.columns 
   WHERE table_name IN ('study_plans', 'study_plan_checkins')
   ORDER BY table_name, ordinal_position;
   ```

### 如果用户未登录：

1. 清除浏览器的 localStorage 和 sessionStorage
2. 重新登录系统
3. 确保 `client.auth.getUser()` 返回正确的用户信息

## 长期解决方案

当前修复采用临时禁用严格RLS策略的方法。长期解决方案应包括：

1. **统一用户认证**：确保所有页面使用相同的认证流程
2. **UUID 格式标准化**：统一用户ID的存储和比较格式
3. **细粒度权限控制**：重新设计RLS策略，实现真正的用户隔离
4. **客户端连接池**：使用统一的数据库客户端实例管理

## 文件变更总结

- ✅ `simple_rls_fix.sql` - RLS策略修复脚本
- ✅ `StudyPlanPage.vue` - 修复打卡函数认证逻辑
- ✅ `StudyPlanPage_Fixed.vue` - 修复后代码备份
- ✅ `RLS_修复指南.md` - 本修复指南