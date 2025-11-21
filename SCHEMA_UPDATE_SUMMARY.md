# 数据库模式更新总结

## ✅ 已完成的更改

### 1. 用户表结构更新
```sql
-- 之前的结构
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,  -- 已移除
    nickname VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 更新后的结构
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

### 2. 移除的内容
- ✅ `email` 字段及其唯一约束
- ✅ `email` 相关的索引
- ✅ `DEFAULT uuid_generate_v4()` （简化为 UUID）
- ✅ `WITH TIME ZONE` 时间戳（简化）
- ✅ `ON CONFLICT (email)` 冲突处理

### 3. 保留的内容
- ✅ 用户名的唯一性约束
- ✅ username 和 nickname 索引
- ✅ 基本的时间戳字段
- ✅ 所有其他表的关联关系

## 🔧 代码同步更新

### 已更新的文件
1. **supabase-schema.sql** - 数据库模式定义
2. **RegisterPage.vue** - 移除 email 字段传递
3. **supabase.ts** - 使 email 参数可选
4. **database.ts** - 更新 createUser 方法签名

## 📋 迁移步骤

如果已有生产数据，请按以下步骤迁移：

```sql
-- 1. 备份现有数据
CREATE TABLE users_backup AS SELECT * FROM users;

-- 2. 移除 email 列
ALTER TABLE users DROP COLUMN IF EXISTS email;

-- 3. 移除 email 索引
DROP INDEX IF EXISTS idx_users_email;

-- 4. 刷新缓存
NOTIFY pgrst, 'reload schema';
```

## ⚠️ 注意事项

1. **数据丢失警告**: 如果表中有 email 数据，移除列会丢失这些数据
2. **唯一性**: 确保用户名保持唯一，因为不再有 email 作为备用标识
3. **认证逻辑**: 确保所有依赖 email 的登录逻辑都已更新
4. **外键关系**: 检查是否有其他表引用了 users.email 字段

## 🚀 验证清单

- [ ] 新用户注册成功
- [ ] 现有用户仍能登录
- [ ] 用户名唯一性检查正常
- [ ] 数据库索引正确创建
- [ ] 没有遗留的 email 相关错误

---

**状态**: ✅ 数据库模式已更新，代码已同步，可以测试注册功能。