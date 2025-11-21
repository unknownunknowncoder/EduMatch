# 修复用户注册问题 - RLS 策略更新

## 问题描述
用户注册时显示"注册失败"或"没有找到该用户"，这是因为 Supabase 数据库的 RLS（Row Level Security）策略阻止了新用户创建。

## 解决方案

### 方法1：在 Supabase Dashboard 中修复

1. **登录 Supabase Dashboard**
   - 访问 [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - 选择你的项目

2. **打开 SQL Editor**
   - 在左侧导航栏找到 "SQL Editor"
   - 点击 "New query"

3. **执行以下 SQL 语句**

```sql
-- 删除现有的限制性策略
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

-- 创建允许注册的新策略
CREATE POLICY "Allow public user registration" ON users
    FOR INSERT WITH CHECK (true);

-- 重新创建查看和更新策略
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text OR auth.uid() IS NULL);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);
```

4. **点击 "RUN" 执行**

### 方法2：临时禁用 RLS（仅用于测试）

如果上面的方法不行，可以临时禁用用户表的 RLS：

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

**注意：** 这会降低安全性，仅建议用于快速测试。

## 验证修复

执行完修复后，尝试注册一个新用户：

1. 用户名：`test123`
2. 密码：`123456`
3. 确认密码：`123456`
4. 昵称：`测试用户`

注册应该能够成功。

## 如果问题仍然存在

1. **检查网络连接**
2. **确认 Supabase URL 和 API Key 配置正确**
3. **查看浏览器控制台的详细错误信息**
4. **确认数据库表存在且结构正确**

## 原因解释

Supabase 默认启用 RLS 来保护数据安全，但是默认的策略过于严格，不允许匿名用户（未注册用户）创建新账号。我们需要添加一个允许任何人注册的策略，同时保持其他操作的安全性。