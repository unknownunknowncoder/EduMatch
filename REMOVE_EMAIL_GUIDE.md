# 移除 Email 字段修复指南

## 问题
注册时出现 PGRST204 错误：`Could not find the 'email' column of 'users' in the schema cache`

## 解决方案

### 1. 在 Supabase SQL Editor 中执行以下 SQL

```sql
-- 删除 email 列和相关约束
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE users DROP COLUMN IF EXISTS email;

-- 确保 nickname 列存在
ALTER TABLE users ADD COLUMN IF NOT EXISTS nickname VARCHAR(100);

-- 刷新缓存
NOTIFY pgrst, 'reload schema';
```

### 2. 已完成的代码修改

✅ **RegisterPage.vue** - 移除了 email 字段传递
✅ **supabase.ts** - 使 email 参数完全可选
✅ **database.ts** - 更新了 createUser 方法签名
✅ **supabase-schema.sql** - 更新了表结构定义

### 3. 现在的用户表结构

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    nickname VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### 4. 验证修复

执行完 SQL 后，测试注册功能：

1. 用户名：`testuser123`
2. 密码：`123456`
3. 确认密码：`123456`
4. 昵称：`测试用户`

应该能够成功注册并自动登录！

## 为什么移除 Email？

- 简化用户注册流程
- 减少必填字段
- 提高注册转化率
- 符合某些应用的业务需求

## 注意事项

- 确保用户名保持唯一性
- 考虑添加密码找回功能（可能需要恢复邮箱字段）
- RLS 策略已更新，不包含 email 相关检查