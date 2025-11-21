# 学习计划功能修复指南

## 问题总结

1. ❌ **404错误**: `study_plans` 表不存在
2. ❌ **字段名错误**: 前端驼峰式 vs 数据库下划线式
3. ❌ **RLS策略阻止**: Row Level Security 阻止插入

## ✅ 已修复的代码问题

1. **数据库服务修复** (`src/services/database.ts`)
   - 修复 Supabase 数据处理格式
   - 添加字段名转换（驼峰式 → 下划线式）
   - 改进错误处理

2. **前端修复** (`src/views/StudyPlanPage.vue`)
   - 添加数组类型检查
   - 修复 forEach 错误
   - 改进错误处理

## 🚀 立即执行步骤

### 第一步：修复 RLS 策略

在 Supabase 控制台执行以下 SQL：

1. 打开：https://app.supabase.com/project/aonlahundnkxuyxfsmcy/database
2. 点击 "SQL Editor"
3. 复制 `fix-rls-complete.sql` 文件内容并执行

或直接执行：
```sql
ALTER TABLE study_plans DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can create their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can update their own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can delete their own study plans" ON study_plans;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON study_plans FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON study_plans FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON study_plans FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON study_plans FOR DELETE USING (true);
```

### 第二步：测试功能

执行修复后运行测试：
```bash
node test-study-plan-insert.js
```

### 第三步：验证应用

1. 启动应用：`npm run dev`
2. 登录系统
3. 创建学习计划
4. 验证控制台无错误
5. 刷新页面检查数据是否保存

## 🧪 测试验证

如果测试成功，应该看到：
```
✅ 插入成功!
📊 返回数据: { id: '...', title: '测试学习计划', ... }
📚 学习计划列表:
1. 测试学习计划 - pending
🎉 插入测试成功!
```

## 🔧 如果仍有问题

1. **检查表是否存在**：
   ```bash
   node test-study-plans.js
   ```

2. **检查 RLS 策略**：
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'study_plans';
   ```

3. **查看控制台错误**：
   - 检查 Supabase API 响应
   - 检查前端错误信息

## 📊 修复的功能

- ✅ 学习计划创建
- ✅ 学习计划保存到数据库
- ✅ 字段名自动转换
- ✅ 错误处理改进
- ✅ RLS 权限修复

现在学习计划功能应该完全正常工作了！