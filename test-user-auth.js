// 测试用户认证功能
// 在浏览器控制台中运行此脚本来测试用户注册和登录

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
    username: 'testuser1',
    nickname: '测试用户1',
    password: 'password123'
  },
  {
    username: 'testuser2', 
    nickname: '测试用户2',
    password: 'password456'
  }
]

// 测试函数
async function testUserAuth() {
  console.log('🧪 开始测试用户认证功能...')
  
  try {
    // 测试注册功能
    console.log('\n📝 测试用户注册...')
    for (const user of testUsers) {
      console.log(`注册用户: ${user.username}`)
      
      // 检查用户名是否已存在
      const existingUser = await window.dbStore.getUserByUsername(user.username)
      if (existingUser) {
        console.log(`⚠️  用户 ${user.username} 已存在，跳过注册`)
        continue
      }
      
      // 创建用户
      const passwordHash = await hashPassword(user.password)
      const newUser = await window.dbStore.createUser({
        username: user.username,
        email: `${user.username}@edumatch.local`,
        nickname: user.nickname,
        password_hash: passwordHash
      })
      
      console.log(`✅ 用户 ${user.username} 注册成功:`, newUser)
    }
    
    // 测试登录功能
    console.log('\n🔐 测试用户登录...')
    for (const user of testUsers) {
      console.log(`登录用户: ${user.username}`)
      
      // 获取用户
      const foundUser = await window.dbStore.getUserByUsername(user.username)
      if (!foundUser) {
        console.log(`❌ 用户 ${user.username} 不存在`)
        continue
      }
      
      // 验证密码
      const inputPasswordHash = await hashPassword(user.password)
      if (foundUser.password_hash === inputPasswordHash) {
        console.log(`✅ 用户 ${user.username} 登录成功`)
        
        // 存储用户信息到 localStorage
        localStorage.setItem('currentUser', JSON.stringify({
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email,
          nickname: foundUser.nickname,
          avatar_url: foundUser.avatar_url
        }))
      } else {
        console.log(`❌ 用户 ${user.username} 密码错误`)
      }
    }
    
    // 测试错误情况
    console.log('\n🚫 测试错误情况...')
    
    // 测试重复注册
    const duplicateUser = testUsers[0]
    console.log(`测试重复注册用户: ${duplicateUser.username}`)
    
    try {
      const passwordHash = await hashPassword('newpassword')
      await window.dbStore.createUser({
        username: duplicateUser.username,
        email: `${duplicateUser.username}@edumatch.local`,
        nickname: '重复用户',
        password_hash: passwordHash
      })
      console.log(`❌ 重复注册应该失败但却成功了`)
    } catch (error) {
      console.log(`✅ 重复注册正确失败:`, error.message)
    }
    
    // 测试错误密码登录
    console.log(`测试错误密码登录: ${testUsers[0].username}`)
    const user = await window.dbStore.getUserByUsername(testUsers[0].username)
    if (user) {
      const wrongPasswordHash = await hashPassword('wrongpassword')
      if (user.password_hash !== wrongPasswordHash) {
        console.log(`✅ 错误密码正确被拒绝`)
      } else {
        console.log(`❌ 错误密码被错误接受`)
      }
    }
    
    console.log('\n🎉 测试完成！')
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error)
  }
}

// 检查依赖
if (typeof window.dbStore === 'undefined') {
  console.error('❌ 请先确保应用正在运行，并且 dbStore 已初始化')
  console.log('💡 在控制台运行: window.dbStore = useDatabaseStore()')
} else {
  // 导出测试函数到全局作用域
  window.testUserAuth = testUserAuth
  console.log('✅ 测试函数已加载，运行 testUserAuth() 开始测试')
}