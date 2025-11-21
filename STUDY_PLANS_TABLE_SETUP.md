# 学习计划表创建指南

## 问题分析

当前学习计划无法保存到数据库，控制台显示 404 错误，这是因为 Supabase 数据库中缺少 `study_plans` 表。

## 解决方案

### 方法1：在 Supabase 控制台手动执行（推荐）

1. 打开 Supabase 控制台：https://app.supabase.com/project/aonlahundnkxuyxfsmcy/database
2. 点击 "SQL Editor" 
3. 复制以下完整的 SQL 代码并执行：

```sql
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

-- 创建 RLS 策略（宽松版本，适合开发）
CREATE POLICY "Anyone can view study plans" ON study_plans
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create study plans" ON study_plans
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update study plans" ON study_plans
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete study plans" ON study_plans
    FOR DELETE USING (true);

-- 创建更新时间触发器（如果不存在）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建更新时间触发器
CREATE TRIGGER update_study_plans_updated_at BEFORE UPDATE ON study_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 方法2：使用 SQL 文件

1. 打开 `create_study_plans_table.sql` 文件
2. 复制全部内容
3. 在 Supabase SQL Editor 中粘贴并执行

## 验证表创建成功

执行完 SQL 后，刷新页面，在左侧表列表中应该能看到 `study_plans` 表。

## 已修复的代码问题

1. ✅ 修复了 `database.ts` 中 Supabase 数据处理错误
2. ✅ 修复了 `StudyPlanPage.vue` 中的 `forEach` 错误
3. ✅ 添加了数据类型检查和错误处理

## 测试步骤

1. 执行上述 SQL 创建表
2. 重新启动应用：`npm run dev`
3. 创建一个测试学习计划
4. 检查控制台是否还有错误
5. 验证学习计划是否成功保存

## 如果仍有问题

如果执行 SQL 时遇到错误，请检查：
- 是否有足够的权限
- `users` 表是否已存在
- 触发器函数是否已存在