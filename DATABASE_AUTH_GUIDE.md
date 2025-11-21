# 数据库认证系统指南

## 🎯 功能概述

已实现完整的数据库认证系统，用户输入的用户名、密码和昵称都保存在数据库的用户表中，登录时验证数据库中的用户名和密码。

## 🗄️ 数据库表结构

```sql
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,    -- 用户ID
    username VARCHAR(50) UNIQUE NOT NULL,               -- 用户名（登录用）
    email VARCHAR(100) UNIQUE NOT NULL,                  -- 邮箱（唯一标识）
    nickname VARCHAR(100),                               -- 昵称（显示用）
    password_hash VARCHAR(255) NOT NULL,                 -- 密码哈希值
    avatar_url VARCHAR(255),                             -- 头像URL（可选）
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 认证流程

### 用户注册流程
```
1. 用户填写表单（用户名、昵称、密码、确认密码）
   ↓
2. 前端验证（字段长度、密码一致性、用户名格式）
   ↓
3. 检查用户名是否已存在于数据库
   ↓
4. 密码哈希处理（SHA-256）
   ↓
5. 保存到数据库（users 表）
   ↓
6. 注册成功，跳转到登录页面
```

### 用户登录流程
```
1. 用户输入用户名和密码
   ↓
2. 根据用户名查询数据库
   ↓
3. 检查用户是否存在
   ↓
4. 哈希输入的密码
   ↓
5. 对比数据库中的密码哈希值
   ↓
6. 验证成功，存储登录状态到 localStorage
   ↓
7. 跳转到目标页面
```

## 💻 实现细节

### 密码安全
```typescript
// SHA-256 密码哈希
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
```

### 数据库操作
```typescript
// 创建用户
const newUser = await dbStore.createUser({
  username: formData.username,
  email: `${formData.username}@edumatch.local`,
  nickname: formData.nickname || formData.username,
  password_hash: passwordHash
})

// 验证登录
const user = await dbStore.getUserByUsername(formData.username)
const inputPasswordHash = await hashPassword(formData.password)
if (user.password_hash === inputPasswordHash) {
  // 登录成功
}
```

## 📋 API 接口

### 用户相关接口
- `dbStore.createUser(userData)` - 创建新用户
- `dbStore.getUserByUsername(username)` - 根据用户名查询
- `dbStore.getUserByEmail(email)` - 根据邮箱查询
- `dbStore.getUserByNickname(nickname)` - 根据昵称查询
- `dbStore.updateUserNickname(userId, nickname)` - 更新昵称

### Supabase 服务方法
```typescript
// 直接调用数据库
const client = supabaseService.getClient()

// 查询用户
const { data, error } = await client
  .from('users')
  .select('*')
  .eq('username', username)
  .single()

// 创建用户
const { data, error } = await client
  .from('users')
  .insert([userData])
  .select()
```

## 🧪 测试验证

### 自动化测试
在浏览器控制台运行：
```javascript
testDatabaseAuth()
```

测试内容：
- ✅ 用户注册到数据库
- ✅ 用户名唯一性检查
- ✅ 密码哈希验证
- ✅ 登录验证流程
- ✅ 错误情况处理
- ✅ 数据持久化验证

### 手动测试步骤
1. **注册新用户**：
   - 访问 `/register`
   - 填写：用户名 `testuser`，昵称 `测试用户`，密码 `123456`
   - 验证注册成功并保存到数据库

2. **数据库验证**：
   ```sql
   SELECT id, username, nickname, email, created_at 
   FROM users 
   WHERE username = 'testuser';
   ```

3. **登录测试**：
   - 访问 `/login`
   - 使用刚注册的用户名和密码登录
   - 验证登录成功

4. **密码验证测试**：
   - 使用错误密码登录
   - 验证被正确拒绝

## 🔍 数据验证规则

### 前端验证
- **用户名**：3-50字符，必填
- **昵称**：可选，默认使用用户名
- **密码**：至少6字符，必填
- **确认密码**：必须与密码一致

### 数据库约束
- **username**：UNIQUE 唯一约束
- **email**：UNIQUE 唯一约束
- **password_hash**：NOT NULL 非空约束

### 安全措施
- 密码以哈希形式存储
- 数据库启用 RLS（行级安全）
- 前端实时验证
- 防止 SQL 注入（参数化查询）

## 📊 数据存储示例

### 注册后的数据库记录
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "username": "testuser",
  "email": "testuser@edumatch.local",
  "nickname": "测试用户",
  "password_hash": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
  "avatar_url": null,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### 登录时的 localStorage 存储
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "username": "testuser",
  "email": "testuser@edumatch.local",
  "nickname": "测试用户",
  "avatar_url": null
}
```

## 🔧 故障排除

### 常见问题
1. **用户已存在**：检查数据库中是否有重复用户名
2. **密码错误**：验证哈希算法一致性
3. **连接失败**：检查 Supabase 配置
4. **注册失败**：查看数据库约束和错误信息

### 调试方法
```javascript
// 查看当前用户
console.log('当前登录用户:', JSON.parse(localStorage.getItem('currentUser') || 'null'))

// 检查数据库连接
window.dbStore.getUsers().then(users => {
  console.log('数据库用户列表:', users)
})

// 测试密码哈希
hashPassword('123456').then(hash => {
  console.log('密码哈希:', hash)
})
```

### 数据库查询
```sql
-- 查看所有用户
SELECT * FROM users;

-- 检查用户是否存在
SELECT COUNT(*) FROM users WHERE username = 'testuser';

-- 验证密码哈希
SELECT password_hash FROM users WHERE username = 'testuser';
```

## 🚀 扩展功能

### 计划中的功能
1. **密码重置**：通过邮箱重置密码
2. **邮箱验证**：注册时验证邮箱有效性
3. **密码强度**：实时密码强度检查
4. **登录限制**：防止暴力破解
5. **社交登录**：第三方账号集成

### 安全增强
1. **升级哈希算法**：使用 bcrypt 或 Argon2
2. **JWT Token**：替代 localStorage 存储
3. **CSRF 保护**：跨站请求伪造防护
4. **审计日志**：记录登录/注册行为

---

**数据库认证系统已完全实现！** 🎉

所有用户数据都安全存储在数据库中，登录时进行严格的数据库验证。