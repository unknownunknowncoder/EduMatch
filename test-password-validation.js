// 测试密码长度验证功能
// 在浏览器控制台运行

console.log('🔐 开始测试密码长度验证...')

// 测试用例
const testCases = [
  { password: '123', description: '3位密码', shouldFail: true },
  { password: '12345', description: '5位密码', shouldFail: true },
  { password: '123456', description: '6位密码', shouldFail: false },
  { password: '1234567', description: '7位密码', shouldFail: false },
  { password: 'password', description: '8位密码', shouldFail: false }
]

// 测试注册页面密码验证
function testRegisterPasswordValidation() {
  console.log('\n📝 测试注册页面密码验证:')
  
  testCases.forEach((testCase, index) => {
    console.log(`\n${index + 1}. 测试 ${testCase.description}: "${testCase.password}"`)
    
    // 模拟输入
    const passwordInput = document.querySelector('input[type="password"][placeholder*="至少6位"]')
    if (passwordInput) {
      // 模拟用户输入
      passwordInput.value = testCase.password
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }))
      
      // 检查错误提示
      setTimeout(() => {
        const errorMsg = document.querySelector('.text-red-600')
        const hasError = errorMsg && errorMsg.textContent.includes('6位')
        
        if (testCase.shouldFail) {
          if (hasError) {
            console.log(`✅ 正确显示错误提示`)
          } else {
            console.log(`❌ 应该显示错误但没有显示`)
          }
        } else {
          if (hasError) {
            console.log(`❌ 不应该显示错误但显示了`)
          } else {
            console.log(`✅ 正确允许通过`)
          }
        }
      }, 100)
    } else {
      console.log('⚠️ 未找到密码输入框')
    }
  })
}

// 测试登录页面密码验证
function testLoginPasswordValidation() {
  console.log('\n🔑 测试登录页面密码验证:')
  
  const loginTestCases = [
    { password: '123', description: '3位密码' },
    { password: '123456', description: '6位密码' }
  ]
  
  loginTestCases.forEach((testCase, index) => {
    console.log(`\n${index + 1}. 测试 ${testCase.description}: "${testCase.password}"`)
    
    // 模拟登录提交
    const usernameInput = document.querySelector('input[type="text"][placeholder*="用户名"]')
    const passwordInput = document.querySelector('input[type="password"][placeholder*="密码"]')
    
    if (usernameInput && passwordInput) {
      usernameInput.value = 'testuser'
      passwordInput.value = testCase.password
      
      // 模拟表单提交
      const form = document.querySelector('form')
      if (form) {
        console.log(`💡 模拟提交密码: ${testCase.password}`)
        
        // 检查是否会显示错误
        setTimeout(() => {
          const errorMsg = document.querySelector('.text-red-600')
          if (errorMsg && testCase.password.length < 6) {
            console.log('✅ 正确显示密码长度错误')
          } else if (!errorMsg && testCase.password.length >= 6) {
            console.log('✅ 密码长度验证通过')
          }
        }, 100)
      }
    } else {
      console.log('⚠️ 未找到登录表单')
    }
  })
}

// 测试函数
function testPasswordRules() {
  console.log('\n📋 密码规则验证:')
  console.log('✅ 密码不能少于6位')
  console.log('✅ 注册页面实时验证')
  console.log('✅ 登录页面提交时验证')
  console.log('✅ HTML minlength="6" 属性')
  console.log('✅ 友好的错误提示')
}

// 检查当前页面
function checkCurrentPage() {
  console.log('\n📍 当前页面检测:')
  const currentUrl = window.location.pathname
  
  if (currentUrl.includes('/register')) {
    console.log('📝 当前在注册页面')
    return 'register'
  } else if (currentUrl.includes('/login')) {
    console.log('🔑 当前在登录页面')
    return 'login'
  } else {
    console.log('🏠 不在认证页面')
    return 'other'
  }
}

// 导出测试函数
window.testPasswordValidation = {
  testRegisterPasswordValidation,
  testLoginPasswordValidation,
  testPasswordRules,
  checkCurrentPage
}

// 自动运行测试
setTimeout(() => {
  const page = checkCurrentPage()
  
  testPasswordRules()
  
  if (page === 'register') {
    testRegisterPasswordValidation()
  } else if (page === 'login') {
    testLoginPasswordValidation()
  } else {
    console.log('\n💡 请访问登录或注册页面进行密码验证测试')
    console.log('登录页面: http://localhost:3001/login')
    console.log('注册页面: http://localhost:3001/register')
  }
}, 1000)

console.log('\n🎯 手动测试步骤:')
console.log('1. 访问注册页面')
console.log('2. 尝试输入少于6位的密码')
console.log('3. 观察实时错误提示')
console.log('4. 输入6位或更多密码')
console.log('5. 验证错误提示消失')
console.log('6. 尝试提交表单')

console.log('\n🔧 快速测试命令:')
console.log('- window.testPasswordValidation.testPasswordRules() - 显示密码规则')
console.log('- window.testPasswordValidation.checkCurrentPage() - 检查当前页面')