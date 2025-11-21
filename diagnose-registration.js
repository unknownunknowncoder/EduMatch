// 诊断注册失败问题
// 在浏览器控制台运行

console.log('🔍 开始诊断注册失败问题...')

// 检查环境配置
function checkEnvironment() {
  console.log('\n🌐 检查环境配置:')
  
  // 检查环境变量
  const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY
  
  console.log('Supabase URL:', supabaseUrl ? '✅ 已配置' : '❌ 未配置')
  console.log('Supabase Key:', supabaseKey ? '✅ 已配置' : '❌ 未配置')
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 环境配置不完整，请检查 .env 文件')
    return false
  }
  
  return true
}

// 检查数据库连接
async function checkDatabaseConnection() {
  console.log('\n🗄️ 检查数据库连接:')
  
  try {
    if (!window.dbStore) {
      console.log('❌ dbStore 未初始化')
      console.log('💡 请在 Vue 应用中运行此脚本')
      return false
    }
    
    // 尝试获取用户列表
    const users = await window.dbStore.getUsers()
    console.log('✅ 数据库连接正常')
    console.log(`当前用户数量: ${users.length}`)
    
    // 显示现有用户
    users.forEach(user => {
      console.log(`- ${user.username} (${user.nickname || '无昵称'})`)
    })
    
    return true
  } catch (error) {
    console.error('❌ 数据库连接失败:', error)
    console.error('错误详情:', {
      message: error.message,
      code: error.code
    })
    return false
  }
}

// 检查表结构
async function checkTableStructure() {
  console.log('\n📋 检查表结构:')
  
  try {
    const client = window.supabaseService.getClient()
    
    // 检查 users 表是否存在
    const { data, error } = await client
      .from('users')
      .select('id, username, email, nickname, password_hash')
      .limit(1)
    
    if (error) {
      console.error('❌ 表结构检查失败:', error)
      
      // 常见错误的解决建议
      if (error.code === 'PGRST204') {
        console.log('💡 建议: users 表可能不存在，需要创建表结构')
        console.log('💡 请在 Supabase SQL Editor 中执行 supabase-schema.sql')
      } else if (error.code === 'PGRST301') {
        console.log('💡 建议: RLS (Row Level Security) 策略问题')
        console.log('💡 请检查 users 表的 RLS 策略配置')
      }
      return false
    }
    
    console.log('✅ 表结构正常')
    if (data && data.length > 0) {
      const user = data[0]
      console.log('表字段示例:', Object.keys(user))
    }
    
    return true
  } catch (error) {
    console.error('❌ 表结构检查异常:', error)
    return false
  }
}

// 模拟注册测试
async function testRegistration() {
  console.log('\n📝 测试注册流程:')
  
  const testUser = {
    username: `testuser_${Date.now()}`,
    nickname: '测试用户',
    password: '123456'
  }
  
  console.log('测试用户数据:', testUser)
  
  try {
    // 1. 检查用户名是否已存在
    console.log('1. 检查用户名唯一性...')
    const existingUser = await window.dbStore.getUserByUsername(testUser.username)
    if (existingUser) {
      console.log('❌ 用户名已存在:', existingUser)
      return false
    }
    console.log('✅ 用户名可用')
    
    // 2. 哈希密码
    console.log('2. 哈希密码...')
    const encoder = new TextEncoder()
    const data = encoder.encode(testUser.password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    console.log('✅ 密码哈希完成:', passwordHash.substring(0, 16) + '...')
    
    // 3. 创建用户
    console.log('3. 创建用户记录...')
    const newUser = await window.dbStore.createUser({
      username: testUser.username,
      email: `${testUser.username}@edumatch.local`,
      nickname: testUser.nickname,
      password_hash: passwordHash
    })
    
    console.log('✅ 注册成功:', {
      id: newUser.id,
      username: newUser.username,
      nickname: newUser.nickname,
      email: newUser.email
    })
    
    return true
    
  } catch (error) {
    console.error('❌ 注册测试失败:', error)
    console.error('错误详情:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    })
    
    // 提供具体解决建议
    if (error.code === '23505') {
      console.log('💡 解决方案: 违反唯一约束，用户名或邮箱已存在')
    } else if (error.code === '23514') {
      console.log('💡 解决方案: 违反外键约束')
    } else if (error.code === 'PGRST301') {
      console.log('💡 解决方案: RLS 权限问题，需要检查表权限')
    } else if (error.code === '42501') {
      console.log('💡 解决方案: 权限不足，检查用户权限')
    }
    
    return false
  }
}

// 检查浏览器兼容性
function checkBrowserCompatibility() {
  console.log('\n🌍 检查浏览器兼容性:')
  
  if (!crypto || !crypto.subtle) {
    console.log('❌ Web Crypto API 不可用')
    console.log('💡 建议: 使用现代浏览器 (Chrome 37+, Firefox 34+, Safari 7.1+)')
    return false
  }
  
  if (!window.TextEncoder) {
    console.log('❌ TextEncoder 不可用')
    return false
  }
  
  console.log('✅ 浏览器兼容性正常')
  return true
}

// 主诊断函数
async function runDiagnosis() {
  console.log('🎯 开始完整诊断...\n')
  
  const results = {
    environment: await checkEnvironment(),
    browser: checkBrowserCompatibility(),
    database: await checkDatabaseConnection(),
    table: await checkTableStructure(),
    registration: false // 最后测试
  }
  
  // 如果前面的检查都通过，才测试注册
  if (results.environment && results.browser && results.database && results.table) {
    console.log('\n🚀 环境检查通过，开始注册测试...')
    results.registration = await testRegistration()
  }
  
  // 输出诊断结果
  console.log('\n📊 诊断结果汇总:')
  console.log('环境配置:', results.environment ? '✅' : '❌')
  console.log('浏览器兼容:', results.browser ? '✅' : '❌')
  console.log('数据库连接:', results.database ? '✅' : '❌')
  console.log('表结构:', results.table ? '✅' : '❌')
  console.log('注册测试:', results.registration ? '✅' : '❌')
  
  if (Object.values(results).every(Boolean)) {
    console.log('\n🎉 所有检查都通过！注册功能应该正常工作。')
  } else {
    console.log('\n⚠️ 发现问题，请按照上述建议解决。')
  }
}

// 导出诊断函数
window.diagnoseRegistration = {
  runDiagnosis,
  checkEnvironment,
  checkDatabaseConnection,
  checkTableStructure,
  testRegistration,
  checkBrowserCompatibility
}

console.log('🔧 诊断工具已加载')
console.log('运行 window.diagnoseRegistration.runDiagnosis() 开始完整诊断')

// 自动运行诊断
setTimeout(() => {
  window.diagnoseRegistration.runDiagnosis()
}, 1000)

console.log('\n💡 如果注册仍然失败，请检查:')
console.log('1. Supabase 配置是否正确')
console.log('2. 数据库表是否已创建')
console.log('3. RLS 策略是否正确配置')
console.log('4. 网络连接是否正常')