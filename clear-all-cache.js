// 强制清除所有缓存和自动登录状态
// 在浏览器控制台运行此脚本

console.log('🧹 开始清除所有缓存和自动登录状态...')

// 清除所有可能的 localStorage 项目
const keysToRemove = [
  'currentUser',
  'users', 
  'demoUser',
  'autoLogin',
  'auth-token',
  'user-session'
]

keysToRemove.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key)
    console.log(`✅ 已清除: ${key}`)
  } else {
    console.log(`ℹ️  不存在: ${key}`)
  }
})

// 清除 session storage
console.log('🗑️ 清除 sessionStorage...')
sessionStorage.clear()

// 强制刷新页面
console.log('🔄 准备强制刷新页面...')
console.log('💡 刷新后应该被重定向到登录页面')

// 询问用户是否要刷新
setTimeout(() => {
  if (confirm('已清除所有缓存，是否立即刷新页面？')) {
    window.location.reload()
  }
}, 1000)

// 导出清除函数供后续使用
window.clearAllCache = () => {
  keysToRemove.forEach(key => localStorage.removeItem(key))
  sessionStorage.clear()
  console.log('✅ 已清除所有缓存')
}

console.log('🎯 清除函数已加载，可使用 clearAllCache() 再次清除')