// 调试认证功能的脚本
// 在浏览器控制台中运行

console.log('🔍 开始调试认证功能...')

// 1. 检查当前状态
function checkCurrentState() {
  console.log('\n📊 当前状态:')
  console.log('URL:', window.location.href)
  console.log('localStorage.currentUser:', localStorage.getItem('currentUser'))
  
  const routes = [
    { path: '/', name: '首页', requiresAuth: true },
    { path: '/login', name: '登录页', requiresAuth: false },
    { path: '/register', name: '注册页', requiresAuth: false },
    { path: '/search', name: '搜索页', requiresAuth: true }
  ]
  
  routes.forEach(route => {
    console.log(`- ${route.name} (${route.path}): 需要认证=${route.requiresAuth}`)
  })
}

// 2. 强制清除登录状态
function forceClearAuth() {
  localStorage.removeItem('currentUser')
  console.log('✅ 已强制清除登录状态')
  console.log('💡 请按 F5 刷新页面，应该被重定向到登录页面')
}

// 3. 模拟登录状态
function simulateLogin() {
  const mockUser = {
    id: 'test-user-id',
    username: 'testuser',
    nickname: '测试用户',
    email: 'testuser@edumatch.local'
  }
  localStorage.setItem('currentUser', JSON.stringify(mockUser))
  console.log('✅ 已模拟登录状态:', mockUser)
  console.log('💡 请按 F5 刷新页面，应该可以访问首页')
}

// 4. 测试路由守卫
function testRouteGuard() {
  console.log('\n🛡️ 测试路由守卫:')
  
  // 检查 router 实例
  if (window.$router) {
    console.log('✅ 找到 router 实例')
    console.log('当前路由:', window.$router.currentRoute.value)
  } else {
    console.log('❌ 未找到 router 实例')
    console.log('💡 请在 Vue 应用页面中运行此脚本')
  }
  
  // 检查 Vue 应用
  if (document.querySelector('#app')) {
    console.log('✅ 找到 Vue 应用容器')
  } else {
    console.log('❌ 未找到 Vue 应用容器')
  }
}

// 5. 重定向测试
function testRedirect() {
  console.log('\n🔄 测试重定向:')
  
  // 清除登录状态
  forceClearAuth()
  
  // 尝试访问首页
  setTimeout(() => {
    if (window.$router) {
      window.$router.push('/')
      console.log('📍 尝试跳转到首页，观察是否被重定向到登录页面')
    }
  }, 1000)
}

// 导出所有函数
window.debugAuth = {
  checkCurrentState,
  forceClearAuth,
  simulateLogin,
  testRouteGuard,
  testRedirect
}

console.log('🎯 调试函数已加载:')
console.log('- debugAuth.checkCurrentState() - 检查当前状态')
console.log('- debugAuth.forceClearAuth() - 清除登录状态') 
console.log('- debugAuth.simulateLogin() - 模拟登录')
console.log('- debugAuth.testRouteGuard() - 测试路由守卫')
console.log('- debugAuth.testRedirect() - 测试重定向')

// 自动检查当前状态
setTimeout(() => {
  debugAuth.checkCurrentState()
}, 500)