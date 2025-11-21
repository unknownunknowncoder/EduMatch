# 用户表设置说明

## 概述
本文档说明如何在 EduMatch 平台中设置和使用用户表，包括用户名、密码和昵称的存储管理。

## 数据库结构

### 用户表 (users)
```sql
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,        -- 用户名
    email VARCHAR(100) UNIQUE NOT NULL,           -- 邮箱（用于登录）
    nickname VARCHAR(100),                        -- 昵称（可选）
    password_hash VARCHAR(255) NOT NULL,          -- 密码哈希值
    avatar_url VARCHAR(255),                      -- 头像URL（可选）
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 设置步骤

### 1. 执行数据库迁移
在 Supabase SQL Editor 中执行以下文件：

1. **完整表结构**：`supabase-schema.sql`
2. **添加昵称字段**：`migration_add_nickname.sql`

### 2. 验证表结构
```sql
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
```

## 功能特性

### 1. 用户注册
- **页面**：`/register`
- **功能**：创建新用户，包含用户名、昵称、密码
- **验证**：
  - 用户名长度至少3位
  - 密码长度至少6位
  - 用户名唯一性检查
  - 密码确认匹配（必须输入两次密码且一致）
- **字段说明**：
  - **用户名**：必填，用于登录，长度3-50字符
  - **昵称**：可选，显示名称，默认使用用户名
  - **密码**：必填，长度至少6位，需要输入两次确认

### 2. 用户登录
- **页面**：`/login`
- **功能**：使用用户名和密码登录
- **验证**：
  - 用户名存在性检查
  - 密码哈希比对
- **字段说明**：
  - **用户名**：注册时使用的用户名
  - **密码**：注册时设置的密码

### 3. 密码安全
- 使用 SHA-256 哈希算法
- 实际生产环境建议使用 bcrypt 等更安全的算法

## API 接口

### 数据库存储方法 (useDatabaseStore)
```typescript
// 创建用户
await dbStore.createUser({
  username: 'testuser',
  email: 'testuser@edumatch.local',
  nickname: '测试用户',
  password_hash: 'hashed_password'
})

// 根据用户名获取用户
const user = await dbStore.getUserByUsername('testuser')

// 根据邮箱获取用户
const user = await dbStore.getUserByEmail('test@example.com')

// 根据昵称获取用户
const user = await dbStore.getUserByNickname('测试用户')

// 更新用户昵称
await dbStore.updateUserNickname(userId, '新昵称')

// 获取所有用户
const users = await dbStore.getUsers()
```

### Supabase 服务方法 (supabaseService)
```typescript
// 直接使用 Supabase 服务
const newUser = await supabaseService.createUser(userData)
const user = await supabaseService.getUserByUsername(username)
const user = await supabaseService.getUserByEmail(email)
const user = await supabaseService.getUserByNickname(nickname)
const updatedUser = await supabaseService.updateUserNickname(userId, nickname)
```

## 使用示例

### 注册新用户
```vue
<script setup>
import { useDatabaseStore } from '@/stores/database'

const dbStore = useDatabaseStore()

async function registerUser() {
  try {
    const passwordHash = await hashPassword('userpassword')
    const user = await dbStore.createUser({
      username: 'newuser',
      email: 'newuser@edumatch.local', // 自动生成邮箱
      nickname: '新用户',
      password_hash: passwordHash
    })
    console.log('用户创建成功:', user)
  } catch (error) {
    console.error('注册失败:', error)
  }
}
</script>
```

### 用户登录
```vue
<script setup>
import { useDatabaseStore } from '@/stores/database'

const dbStore = useDatabaseStore()

async function loginUser() {
  try {
    const user = await dbStore.getUserByUsername('newuser')
    if (user && user.password_hash === hashPassword('userpassword')) {
      // 登录成功，存储用户信息
      localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
        nickname: user.nickname
      }))
    }
  } catch (error) {
    console.error('登录失败:', error)
  }
}
</script>
```

## 注意事项

### 1. 安全考虑
- **密码存储**：当前使用 SHA-256，生产环境建议使用 bcrypt
- **数据验证**：所有用户输入都应进行服务器端验证
- **SQL 注入**：使用 Supabase 的参数化查询，避免 SQL 注入

### 2. 数据完整性
- 用户名和邮箱必须唯一
- 密码哈希为必填字段
- 昵称为可选项，默认使用用户名

### 3. 权限控制
- 启用了 Row Level Security (RLS)
- 用户只能查看和修改自己的信息
- 其他用户可以查看基本信息（根据 RLS 策略）

## 故障排除

### 常见问题
1. **邮箱已存在**：检查邮箱唯一性约束
2. **密码错误**：确认密码哈希算法一致
3. **连接失败**：检查 Supabase 配置

### 调试方法
```sql
-- 检查用户表数据
SELECT * FROM users;

-- 检查索引
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'users';

-- 检查约束
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'users';
```

## 下一步计划
1. 集成第三方登录（Google、GitHub）
2. 实现密码重置功能
3. 添加邮箱验证
4. 用户权限管理系统
5. 用户资料页面优化