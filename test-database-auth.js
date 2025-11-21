// 测试数据库认证功能
// 在浏览器控制台运行

console.log('🗄️ 开始测试数据库认证功能...')

// 密码哈希函数
async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// 测试数据
const testUsers = [
  {
    username: 'testuser',
    nickname: '测试用户',
    password: '123456'
  },
  {
    username: 'demouser',
    nickname: '演示用户', 
    password: 'password123'
  }
]

// 测试函数
async function testDatabaseAuth() {
  console.log('\n📋 测试数据库认证功能:')
  
  try {
    // 1. 测试注册功能
    console.log('\n1️⃣ 测试用户注册...')
    for (const user of testUsers) {
      console.log(`\n📝 注册用户: ${user.username}`)
      
      // 检查用户名是否已存在
      const existingUser = await window.dbStore.getUserByUsername(user.username)
      if (existingUser) {
        console.log(`⚠️ 用户 ${user.username} 已存在，跳过注册`)
        console.log('现有用户信息:', {
          id: existingUser.id,
          username: existingUser.username,
          nickname: existingUser.nickname,
          email: existingUser.email
        })
        continue
      }
      
      // 创建用户
      const passwordHash = await hashPassword(user.password)
      console.log('密码哈希:', passwordHash.substring(0, 16) + '...')
      
      const newUser = await window.dbStore.createUser({
        username: user.username,
        email: `${user.username}@edumatch.local`,
        nickname: user.nickname,
        password_hash: passwordHash
      })
      
      console.log('✅ 用户注册成功:', {
        id: newUser.id,
        username: newUser.username,
        nickname: newUser.nickname,
        email: newUser.email
      })
    }
    
    // 2. 测试登录功能
    console.log('\n2️⃣ 测试用户登录...')
    for (const user of testUsers) {
      console.log(`\n🔐 测试登录: ${user.username}`)
      
      // 从数据库获取用户
      const foundUser = await window.dbStore.getUserByUsername(user.username)
      if (!foundUser) {
        console.log(`❌ 用户 ${user.username} 不存在`)
        continue
      }
      
      console.log('数据库用户信息:', {
        id: foundUser.id,
        username: foundUser.username,
        nickname: foundUser.nickname,
        email: foundUser.email,
        hasPasswordHash: !!foundUser.password_hash
      })
      
      // 验证密码
      const inputPasswordHash = await hashPassword(user.password)
      console.log('输入密码哈希:', inputPasswordHash.substring(0, 16) + '...')
      console.log('数据库密码哈希:', foundUser.password_hash.substring(0, 16) + '...')
      
      if (foundUser.password_hash === inputPasswordHash) {
        console.log('✅ 密码验证成功')
        
        // 模拟登录（存储到 localStorage）
        localStorage.setItem('currentUser', JSON.stringify({
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email,
          nickname: foundUser.nickname,
          avatar_url: foundUser.avatar_url
        }))
        
        console.log('✅ 模拟登录成功，用户信息已保存到 localStorage')
      } else {
        console.log('❌ 密码验证失败')
      }
    }
    
    // 3. 测试错误情况
    console.log('\n3️⃣ 测试错误情况...')
    
    // 测试不存在的用户
    console.log('\n🔍 测试不存在的用户:')
    const nonExistentUser = await window.dbStore.getUserByUsername('nonexistent')
    if (nonExistentUser) {
      console.log('❌ 不存在的用户却被找到了')
    } else {
      console.log('✅ 正确：不存在的用户未找到')
    }
    
    // 测试错误密码
    console.log('\n🔍 测试错误密码:')
    if (testUsers.length > 0) {
      const user = await window.dbStore.getUserByUsername(testUsers[0].username)
      if (user) {
        const wrongPasswordHash = await hashPassword('wrongpassword')
        if (user.password_hash !== wrongPasswordHash) {
          console.log('✅ 正确：错误密码被拒绝')
        } else {
          console.log('❌ 错误：错误密码被接受')
        }
      }
    }
    
    // 4. 显示所有用户
    console.log('\n4️⃣ 数据库中的所有用户:')
    const allUsers = await window.dbStore.getUsers()
    allUsers.forEach(user => {
      console.log(`- ${user.username} (${user.nickname}) - ${user.email}`)
    })
    
    console.log('\n🎉 数据库认证测试完成！')
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error)
  }
}

// 检查依赖
async function checkDependencies() {
  console.log('🔍 检查依赖...')
  
  if (typeof window.dbStore === 'undefined') {
    console.error('❌ dbStore 未定义')
    console.log('💡 请在 Vue 应用页面中运行此脚本，或在控制台执行:')
    console.log('   window.dbStore = useDatabaseStore()')
    return false
  } else {
    console.log('✅ dbStore 可用')
  }
  
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    console.log('✅ crypto API 可用')
  } else {
    console.error('❌ crypto API 不可用')
    return false
  }
  
  return true
}

// 导出测试函数
window.testDatabaseAuth = testDatabaseAuth

// 自动检查依赖并运行测试
setTimeout(async () => {
  if (await checkDependencies()) {
    console.log('\n🚀 依赖检查通过，开始测试...')
    testDatabaseAuth()
  }
}, 1000)

console.log('\n📖 使用说明:')
console.log('- 等待依赖检查完成')
console.log('- 如果依赖不可用，请先在 Vue 应用中运行')
console.log('- 测试完成后可以查看数据库中的用户数据')