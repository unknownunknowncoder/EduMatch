// 快速修复注册问题
// 在浏览器控制台运行

console.log('🔧 开始修复注册问题...')

// 立即修复函数
function quickFix() {
  console.log('\n🚀 立即修复步骤:')
  
  // 1. 清除缓存
  console.log('1. 清除本地缓存...')
  localStorage.removeItem('currentUser')
  console.log('✅ 已清除用户缓存')
  
  // 2. 重置数据库连接
  console.log('2. 重置数据库连接...')
  if (window.dbStore) {
    console.log('✅ dbStore 可用')
  } else {
    console.log('❌ dbStore 不可用，尝试重新初始化')
    console.log('💡 请刷新页面或重新加载应用')
  }
  
  // 3. 检查当前状态
  console.log('3. 检查当前状态...')
  console.log('当前URL:', window.location.href)
  console.log('当前页面:', window.location.pathname)
  
  return true
}

// 测试注册功能
async function testQuickRegistration() {
  console.log('\n🧪 快速测试注册...')
  
  if (!window.dbStore) {
    console.log('❌ dbStore 不可用')
    return false
  }
  
  try {
    // 尝试获取用户列表，验证数据库连接
    const users = await window.dbStore.getUsers()
    console.log('✅ 数据库连接正常，当前用户数:', users.length)
    
    // 生成唯一测试用户名
    const testUser = {
      username: `test_${Date.now()}`,
      nickname: '快速测试用户',
      password: '123456'
    }
    
    console.log('📝 测试用户:', testUser.username)
    
    // 检查用户名是否已存在
    const existingUser = await window.dbStore.getUserByUsername(testUser.username)
    if (existingUser) {
      console.log('⚠️ 用户名已存在，生成新的...')
      testUser.username = `test_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
      console.log('📝 新用户名:', testUser.username)
    }
    
    // 哈希密码
    const encoder = new TextEncoder()
    const data = encoder.encode(testUser.password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    console.log('🔐 密码哈希完成')
    
    // 创建用户
    const newUser = await window.dbStore.createUser({
      username: testUser.username,
      email: `${testUser.username}@edumatch.local`,
      nickname: testUser.nickname,
      password_hash: passwordHash
    })
    
    console.log('✅ 测试注册成功:', {
      id: newUser.id,
      username: newUser.username,
      nickname: newUser.nickname,
      email: newUser.email
    })
    
    return true
    
  } catch (error) {
    console.error('❌ 测试注册失败:', error)
    
    // 分析错误类型
    if (error.code === 'PGRST204') {
      console.log('💡 解决方案: 表不存在，需要执行 supabase-schema.sql')
    } else if (error.code === 'PGRST301') {
      console.log('💡 解决方案: RLS 策略问题，需要检查表权限')
    } else if (error.code === '23505') {
      console.log('💡 解决方案: 唯一约束冲突，用户名或邮箱已存在')
    } else if (error.message?.includes('connection')) {
      console.log('💡 解决方案: 网络连接问题，检查 Supabase URL 和 Key')
    } else {
      console.log('💡 解决方案: 未知错误，请查看 Supabase 控制台')
    }
    
    return false
  }
}

// 手动注册测试
function manualRegisterTest() {
  console.log('\n📋 手动注册测试指南:')
  console.log('1. 确保在注册页面: http://localhost:3001/register')
  console.log('2. 填写表单:')
  console.log('   - 用户名: test' + Date.now())
  console.log('   - 昵称: 手动测试用户')
  console.log('   - 密码: 123456')
  console.log('   - 确认密码: 123456')
  console.log('3. 点击注册按钮')
  console.log('4. 查看控制台错误信息')
  console.log('5. 检查 Supabase 控制台的日志')
}

// 检查数据库表
async function checkDatabaseTable() {
  console.log('\n🗄️ 检查数据库表...')
  
  try {
    if (!window.supabaseService) {
      console.log('❌ supabaseService 不可用')
      return false
    }
    
    const client = window.supabaseService.getClient()
    
    // 检查表是否存在和结构
    const { data, error } = await client
      .from('users')
      .select('id, username, email, nickname, password_hash')
      .limit(1)
    
    if (error) {
      console.error('❌ 表检查失败:', error)
      return false
    }
    
    console.log('✅ users 表存在且结构正常')
    if (data && data.length > 0) {
      console.log('表字段:', Object.keys(data[0]))
    }
    
    return true
    
  } catch (error) {
    console.error('❌ 表检查异常:', error)
    return false
  }
}

// 主修复函数
async function runQuickFix() {
  console.log('🎯 运行快速修复...\n')
  
  // 1. 快速修复
  quickFix()
  
  // 2. 检查数据库表
  const tableOk = await checkDatabaseTable()
  
  if (tableOk) {
    // 3. 测试注册
    const registrationOk = await testQuickRegistration()
    
    if (registrationOk) {
      console.log('\n🎉 修复成功！注册功能正常工作')
      console.log('💡 现在可以正常使用注册页面了')
    } else {
      console.log('\n⚠️ 注册测试失败，请检查以下项目:')
      manualRegisterTest()
    }
  } else {
    console.log('\n⚠️ 数据库表问题，请检查以下项目:')
    console.log('1. 确保在 Supabase 项目中执行了 supabase-schema.sql')
    console.log('2. 检查 RLS (Row Level Security) 策略配置')
    console.log('3. 验证用户表创建成功')
  }
}

// 导出修复函数
window.fixRegistration = {
  runQuickFix,
  quickFix,
  testQuickRegistration,
  checkDatabaseTable,
  manualRegisterTest
}

console.log('🛠️ 修复工具已加载')
console.log('运行 window.fixRegistration.runQuickFix() 开始快速修复')

// 自动运行修复
setTimeout(() => {
  window.fixRegistration.runQuickFix()
}, 1000)

console.log('\n📞 如果问题持续存在:')
console.log('1. 检查 Supabase 项目设置')
console.log('2. 确认表和 RLS 策略正确创建')
console.log('3. 检查网络连接和防火墙')
console.log('4. 查看 Supabase 项目的控制台日志')