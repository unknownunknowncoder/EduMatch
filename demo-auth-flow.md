# 认证保护功能演示

## 🎬 完整用户流程演示

### 场景1：新用户首次访问

1. **打开首页** (`/`)
   - 📍 用户访问：`http://localhost:3001/`
   - 🔄 系统检测到未登录
   - 🔀 自动重定向到：`/login?redirect=/`
   - 📱 显示登录页面，包含提示"请登录以访问学习平台"

2. **注册新账号**
   - 👆 点击"注册新账号"链接
   - 🔄 跳转到注册页面：`/register`
   - 📝 填写用户名、昵称、密码、确认密码
   - ✅ 注册成功，显示"注册成功！正在跳转到登录页面..."
   - 🔀 自动跳转到登录页面

3. **登录账号**
   - 📱 在登录页面输入刚注册的用户名和密码
   - ✅ 登录成功，显示"登录成功！正在跳转..."
   - 🔀 跳转到目标页面（首页 `/`）
   - 🏠 首页显示用户信息栏和退出登录按钮

### 场景2：已注册用户直接访问受保护页面

1. **尝试访问搜索页面**
   - 📍 用户访问：`http://localhost:3001/search`
   - 🔀 自动重定向到：`/login?redirect=/search`
   - 📱 显示登录页面

2. **登录后跳转**
   - 📝 输入用户名和密码登录
   - ✅ 登录成功
   - 🔀 自动跳转到目标页面：`/search`

### 场景3：用户退出登录

1. **在首页退出**
   - 🏠 首页显示用户信息
   - 👆 点击"退出登录"按钮
   - 🗑️ 清除 localStorage 中的用户数据
   - 🔀 重定向到登录页面：`/login`

2. **尝试再次访问受保护页面**
   - 📍 尝试访问：`/profile`
   - 🔀 再次重定向到登录页面
   - 📱 需要重新登录

## 🔧 技术实现细节

### 路由保护流程
```
用户访问页面
    ↓
检查路由 meta.requiresAuth
    ↓
如果需要认证：
    ├─ 检查 localStorage 中的 currentUser
    ├─ 如果不存在 → 重定向到 /login?redirect=当前路径
    └─ 如果存在 → 验证数据格式 → 允许访问
如果不需要认证 → 直接允许访问
```

### 登录成功流程
```
登录验证成功
    ↓
存储用户信息到 localStorage
    ↓
检查 URL 中的 redirect 参数
    ├─ 有 → 跳转到指定页面
    └─ 无 → 跳转到首页
```

### 退出登录流程
```
点击退出按钮
    ↓
清除 localStorage.currentUser
    ↓
重定向到登录页面
```

## 🧪 快速测试步骤

### 准备测试账号
```javascript
// 在浏览器控制台执行
localStorage.removeItem('currentUser')
// 现在处于未登录状态
```

### 测试1：访问首页
1. 打开 `http://localhost:3001/`
2. **预期**：重定向到登录页面
3. **URL**：`http://localhost:3001/login?redirect=/`

### 测试2：直接注册
1. 点击"注册新账号"
2. 填写表单：
   - 用户名：`testuser`
   - 昵称：`测试用户`
   - 密码：`123456`
   - 确认密码：`123456`
3. **预期**：注册成功，跳转到登录页面

### 测试3：登录
1. 输入：
   - 用户名：`testuser`
   - 密码：`123456`
2. **预期**：登录成功，跳转到首页
3. **验证**：首页显示"欢迎回来 测试用户"

### 测试4：退出登录
1. 点击"退出登录"按钮
2. **预期**：重定向到登录页面
3. **验证**：首页不再显示用户信息

### 测试5：访问其他受保护页面
1. 在未登录状态下访问 `http://localhost:3001/search`
2. **预期**：重定向到登录页面
3. **URL**：`http://localhost:3001/login?redirect=/search`

## 🔍 调试技巧

### 检查登录状态
```javascript
// 查看当前登录状态
console.log('登录状态:', localStorage.getItem('currentUser'))

// 查看用户信息
const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
console.log('用户信息:', user)
```

### 模拟登录状态
```javascript
// 模拟登录
localStorage.setItem('currentUser', JSON.stringify({
  id: 'test-id',
  username: 'testuser',
  nickname: '测试用户',
  email: 'test@edumatch.local'
}))

// 模拟退出
localStorage.removeItem('currentUser')
```

### 检查路由守卫
```javascript
// 查看当前路由
console.log('当前路由:', window.$router?.currentRoute.value)

// 手动触发路由守卫测试
window.$router.push('/protected-page')
```

## 📱 用户体验优化

### 友好的提示信息
- 登录页面：显示"请登录以访问学习平台"
- 注册页面：显示"创建账号以开始您的学习之旅"
- 首页：显示"欢迎回来 [用户昵称]"

### 智能重定向
- 记住用户尝试访问的页面
- 登录成功后自动跳转到目标页面
- 避免重复操作

### 一致的交互
- 所有页面都使用相同的认证机制
- 统一的错误提示和成功反馈
- 清晰的操作指引

---

**这就是完整的认证保护系统！** 🎉

现在用户必须先注册登录才能使用平台的所有功能。