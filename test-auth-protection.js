// 测试认证保护功能
// 在浏览器控制台运行此脚本来测试路由保护

console.log('🔐 开始测试认证保护功能...')

// 测试函数
function testAuthProtection() {
  console.log('\n📋 测试用例:')
  
  // 1. 检查当前登录状态
  console.log('\n1️⃣ 检查当前登录状态:')
  const currentUser = localStorage.getItem('currentUser')
  if (currentUser) {
    try {
      const user = JSON.parse(currentUser)
      console.log('✅ 用户已登录:', {
        id: user.id,
        username: user.username,
        nickname: user.nickname
      })
    } catch (error) {
      console.log('❌ 用户数据格式错误:', error)
    }
  } else {
    console.log('❌ 用户未登录')
  }
  
  // 2. 测试访问受保护页面
  console.log('\n2️⃣ 测试访问受保护页面:')
  const protectedRoutes = [
    '/',
    '/search', 
    '/profile',
    '/community',
    '/create-resource',
    '/history',
    '/liked',
    '/settings',
    '/study-plan'
  ]
  
  protectedRoutes.forEach(route => {
    console.log(`📍 尝试访问: ${route}`)
    console.log(`   - 预期行为: ${currentUser ? '✅ 允许访问' : '🔒 重定向到登录页'}`)
  })
  
  // 3. 测试公开页面
  console.log('\n3️⃣ 测试公开页面:')
  const publicRoutes = ['/login', '/register']
  
  publicRoutes.forEach(route => {
    console.log(`📍 尝试访问: ${route}`)
    console.log('   - 预期行为: ✅ 允许访问')
  })
  
  // 4. 模拟登录/退出
  console.log('\n4️⃣ 模拟登录状态切换:')
  
  console.log('🔓 模拟退出登录...')
  localStorage.removeItem('currentUser')
  console.log('状态: 已退出，访问受保护页面应被重定向')
  
  console.log('🔐 模拟登录...')
  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    username: 'testuser',
    nickname: '测试用户',
    email: 'testuser@edumatch.local'
  }
  localStorage.setItem('currentUser', JSON.stringify(mockUser))
  console.log('状态: 已登录，可以访问所有页面')
  
  console.log('\n🧪 测试完成！')
  console.log('\n💡 手动测试步骤:')
  console.log('1. 清除 localStorage 并尝试访问首页')
  console.log('2. 应该被重定向到登录页面')
  console.log('3. 登录成功后应该能访问所有页面')
  console.log('4. 退出登录后再次尝试访问受保护页面')
}

// 导出测试函数
window.testAuthProtection = testAuthProtection

console.log('✅ 测试函数已加载，运行 testAuthProtection() 开始测试')

// 自动运行测试
setTimeout(() => {
  testAuthProtection()
}, 1000)