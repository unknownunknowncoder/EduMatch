// 测试认证页面布局
// 在浏览器控制台运行

console.log('🎨 开始测试认证页面布局...')

// 测试函数
function testAuthLayout() {
  console.log('\n📋 测试项目:')
  
  // 1. 检查当前页面
  console.log('\n1️⃣ 当前页面检查:')
  console.log('当前URL:', window.location.href)
  console.log('路径:', window.location.pathname)
  
  // 2. 检查导航栏是否存在
  console.log('\n2️⃣ 导航栏检查:')
  const sidebar = document.querySelector('aside')
  const bottomNav = document.querySelector('[class*="bottom"]')
  
  if (sidebar) {
    console.log('❌ 发现侧边导航栏 (不应该存在)')
    console.log('侧边栏元素:', sidebar)
  } else {
    console.log('✅ 没有侧边导航栏 (正确)')
  }
  
  if (bottomNav) {
    console.log('❌ 发现底部导航栏 (不应该存在)')
    console.log('底部导航栏元素:', bottomNav)
  } else {
    console.log('✅ 没有底部导航栏 (正确)')
  }
  
  // 3. 检查页面容器
  console.log('\n3️⃣ 页面容器检查:')
  const main = document.querySelector('main')
  if (main) {
    const styles = window.getComputedStyle(main)
    console.log('主容器样式:', {
      minHeight: styles.minHeight,
      width: styles.width,
      display: styles.display
    })
    
    if (styles.minHeight === '100vh' || styles.minHeight.includes('screen')) {
      console.log('✅ 主容器覆盖全屏 (正确)')
    } else {
      console.log('⚠️ 主容器可能未覆盖全屏')
    }
  } else {
    console.log('❌ 没有找到主容器')
  }
  
  // 4. 检查登录/注册表单
  console.log('\n4️⃣ 表单检查:')
  const form = document.querySelector('form')
  if (form) {
    console.log('✅ 找到表单')
    const inputs = form.querySelectorAll('input')
    console.log('输入框数量:', inputs.length)
    
    inputs.forEach((input, index) => {
      console.log(`输入框 ${index + 1}:`, {
        type: input.type,
        placeholder: input.placeholder,
        required: input.required
      })
    })
  } else {
    console.log('❌ 没有找到表单')
  }
  
  // 5. 测试页面跳转
  console.log('\n5️⃣ 页面跳转测试:')
  console.log('💡 手动测试以下链接:')
  console.log('- 访问 /login 应该没有导航栏')
  console.log('- 访问 /register 应该没有导航栏')
  console.log('- 登录后访问 / 应该有导航栏')
}

// 导出测试函数
window.testAuthLayout = testAuthLayout

console.log('✅ 测试函数已加载，运行 testAuthLayout() 开始测试')

// 自动运行测试
setTimeout(() => {
  testAuthLayout()
}, 1000)

// 额外的测试功能
window.navigateToAuth = (page) => {
  if (window.$router) {
    window.$router.push(page)
    console.log(`🚀 跳转到: ${page}`)
    setTimeout(() => {
      testAuthLayout()
    }, 500)
  } else {
    console.log('❌ 路由未可用，请手动访问:', page)
  }
}

console.log('\n🎯 快速导航命令:')
console.log('- navigateToAuth("/login") - 测试登录页面')
console.log('- navigateToAuth("/register") - 测试注册页面')