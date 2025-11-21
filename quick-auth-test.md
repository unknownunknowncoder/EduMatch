# 快速认证测试指南

## 🚀 快速验证步骤

### 1. 确保数据库连接
```javascript
// 在浏览器控制台运行
window.dbStore = useDatabaseStore()
window.dbStore.getUsers().then(users => {
  console.log('数据库用户数量:', users.length)
  console.log('用户列表:', users.map(u => ({username: u.username, nickname: u.nickname})))
})
```

### 2. 清除现有测试用户
```javascript
// 如果有旧的测试用户，先清除
localStorage.removeItem('currentUser')
```

### 3. 注册新用户测试
1. 访问：`http://localhost:3001/register`
2. 填写信息：
   - 用户名：`testuser`
   - 昵称：`测试用户`
   - 密码：`123456`
   - 确认密码：`123456`
3. 点击"注册"

### 4. 验证数据库存储
```javascript
// 检查用户是否保存到数据库
window.dbStore.getUserByUsername('testuser').then(user => {
  if (user) {
    console.log('✅ 用户已保存到数据库:', {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      hasPasswordHash: !!user.password_hash
    })
  } else {
    console.log('❌ 用户未找到')
  }
})
```

### 5. 登录测试
1. 访问：`http://localhost:3001/login`
2. 输入：
   - 用户名：`testuser`
   - 密码：`123456`
3. 点击"登录"

### 6. 验证登录状态
```javascript
// 检查登录状态
const currentUser = localStorage.getItem('currentUser')
if (currentUser) {
  const user = JSON.parse(currentUser)
  console.log('✅ 登录成功:', {
    username: user.username,
    nickname: user.nickname,
    isLoggedIn: true
  })
} else {
  console.log('❌ 未登录')
}
```

## 🎯 预期结果

### 注册成功
- 控制台显示"注册成功！正在跳转到登录页面..."
- 数据库中新增用户记录
- 自动跳转到登录页面

### 登录成功
- 控制台显示"登录成功！正在跳转..."
- localStorage 存储用户信息
- 跳转到首页，显示用户信息

### 数据库验证
- 用户表包含新用户记录
- 密码已正确哈希存储
- 可以根据用户名查询到用户

## 🔍 故障排除

### 如果注册失败
1. 检查浏览器控制台错误
2. 确认 Supabase 配置正确
3. 验证数据库表结构

### 如果登录失败
1. 确认用户已正确注册
2. 检查密码哈希算法一致
3. 验证数据库查询正常

### 如果数据库连接失败
```javascript
// 检查 Supabase 连接
import { supabaseService } from '@/services/supabase'
supabaseService.getClient().from('users').select('*').limit(1).then(result => {
  console.log('数据库连接测试:', result)
}).catch(error => {
  console.error('数据库连接失败:', error)
})
```

---

**按照以上步骤即可验证完整的数据库认证功能！** 🎉