# 用户登录注册系统使用指南

## 🎯 功能概述

已完成完整的用户认证系统，支持用户注册和登录功能。系统使用用户名和密码进行认证，昵称用于显示。

## 📋 功能特性

### 注册功能
- **必填字段**：用户名、密码
- **可选字段**：昵称（默认使用用户名）
- **密码验证**：必须输入两次密码，确保一致
- **字段要求**：
  - 用户名：3-50字符
  - 密码：至少6字符
  - 昵称：可选，默认为用户名

### 登录功能  
- **登录方式**：用户名 + 密码
- **验证机制**：密码哈希比对
- **会话管理**：登录成功后存储用户信息到 localStorage

## 🚀 使用方法

### 访问页面
- **注册页面**：`http://localhost:3001/register`
- **登录页面**：`http://localhost:3001/login`

### 注册流程
1. 访问 `/register` 页面
2. 填写用户名（至少3个字符）
3. 填写昵称（可选）
4. 输入密码（至少6个字符）
5. 再次输入密码确认
6. 点击"注册"按钮
7. 注册成功后自动跳转到登录页面

### 登录流程
1. 访问 `/login` 页面
2. 输入用户名
3. 输入密码
4. 点击"登录"按钮
5. 登录成功后跳转到首页

## 🛡️ 安全特性

### 密码安全
- 使用 SHA-256 哈希算法存储密码
- 密码长度要求至少6位
- 前端实时密码确认验证

### 数据验证
- 用户名唯一性检查
- 实时表单验证
- 错误提示和友好反馈

### 数据库安全
- Row Level Security (RLS) 启用
- 用户只能访问自己的数据
- SQL 注入防护（通过 Supabase 参数化查询）

## 🗄️ 数据库结构

```sql
users (
    id UUID PRIMARY KEY,                    -- 用户ID
    username VARCHAR(50) UNIQUE NOT NULL,   -- 用户名（用于登录）
    email VARCHAR(100) UNIQUE NOT NULL,      -- 邮箱（自动生成）
    nickname VARCHAR(100),                  -- 昵称（用于显示）
    password_hash VARCHAR(255) NOT NULL,     -- 密码哈希值
    avatar_url VARCHAR(255),                -- 头像URL（可选）
    created_at TIMESTAMP,                    -- 创建时间
    updated_at TIMESTAMP                     -- 更新时间
)
```

## 💻 API 接口

### 用户注册
```typescript
await dbStore.createUser({
  username: 'newuser',
  email: 'newuser@edumatch.local',  // 自动生成
  nickname: '新用户',              // 可选
  password_hash: 'hashed_password'
})
```

### 用户登录
```typescript
// 根据用户名获取用户
const user = await dbStore.getUserByUsername('username')

// 验证密码
if (user.password_hash === hashPassword(inputPassword)) {
  // 登录成功
}
```

## 🧪 测试功能

### 自动化测试
在浏览器控制台运行测试脚本：
```javascript
// 确保先加载 dbStore
window.dbStore = useDatabaseStore()

// 运行测试
testUserAuth()
```

### 手动测试
1. **注册测试**：
   - 访问注册页面
   - 测试各种输入组合
   - 验证错误处理

2. **登录测试**：
   - 访问登录页面  
   - 测试正确和错误的凭据
   - 验证跳转逻辑

## 🔧 开发调试

### 查看用户数据
```sql
-- 在 Supabase SQL Editor 中执行
SELECT id, username, nickname, created_at FROM users;
```

### 清理测试数据
```sql
-- 删除测试用户
DELETE FROM users WHERE username LIKE 'test%';
```

### 常见问题
1. **注册失败**：检查用户名是否已存在
2. **登录失败**：确认密码是否正确
3. **数据库连接**：检查 Supabase 配置

## 📱 用户体验

### 表单验证
- 实时输入验证
- 友好的错误提示
- 加载状态反馈

### 页面设计
- 响应式布局
- 现代化 UI 设计
- 渐变背景和阴影效果

### 交互反馈
- 成功/错误消息提示
- 按钮状态变化
- 自动页面跳转

## 🚀 下一步扩展

1. **功能增强**：
   - 密码重置功能
   - 邮箱验证
   - 第三方登录（Google、GitHub）

2. **安全提升**：
   - 使用 bcrypt 替代 SHA-256
   - 添加登录尝试限制
   - 实施 CSRF 保护

3. **用户体验**：
   - 记住登录状态
   - 密码强度指示器
   - 用户资料完善页面

## 📞 技术支持

如需技术支持，请检查：
1. 控制台错误信息
2. 网络连接状态
3. Supabase 配置信息
4. 浏览器兼容性

---

**注意**：当前系统为演示版本，生产环境部署前请务必进行安全加固和充分测试。