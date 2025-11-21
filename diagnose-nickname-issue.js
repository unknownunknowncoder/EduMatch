// 诊断和修复 nickname 列问题的完整脚本
// 在浏览器控制台中运行此脚本来诊断问题

async function diagnoseNicknameIssue() {
  console.log('=== 诊断 nickname 列问题 ===')
  
  try {
    // 1. 检查 Supabase 连接
    const { supabaseService } = await import('@/services/supabase.js')
    const client = supabaseService.getClient()
    console.log('✅ Supabase 客户端连接成功')
    
    // 2. 检查表结构
    console.log('\n--- 检查 users 表结构 ---')
    try {
      const { data, error } = await client.rpc('get_table_columns', { table_name: 'users' })
      if (error) {
        console.log('⚠️ 无法通过 RPC 检查表结构，尝试其他方法...')
        
        // 尝试简单的查询来检查列是否存在
        const { data: testData, error: testError } = await client
          .from('users')
          .select('id, username, email, nickname')
          .limit(1)
          
        if (testError) {
          console.error('❌ nickname 列查询失败:', testError)
          
          // 尝试不包含 nickname 的查询
          const { data: basicData, error: basicError } = await client
            .from('users')
            .select('id, username, email')
            .limit(1)
            
          if (basicError) {
            console.error('❌ 基本查询也失败:', basicError)
          } else {
            console.log('✅ 基本查询成功，问题确实是 nickname 列')
          }
        } else {
          console.log('✅ nickname 列查询成功，数据:', testData)
        }
      }
    } catch (err) {
      console.error('❌ 表结构检查失败:', err)
    }
    
    // 3. 测试创建用户（不包含 nickname）
    console.log('\n--- 测试不包含 nickname 的用户创建 ---')
    try {
      const testUsername = 'test_' + Date.now()
      const { data, error } = await client
        .from('users')
        .insert({
          username: testUsername,
          email: `${testUsername}@test.com`,
          password_hash: 'test_hash'
        })
        .select()
        
      if (error) {
        console.error('❌ 创建用户失败:', error)
      } else {
        console.log('✅ 创建用户成功:', data)
        
        // 删除测试用户
        await client
          .from('users')
          .delete()
          .eq('username', testUsername)
        console.log('✅ 测试用户已清理')
      }
    } catch (err) {
      console.error('❌ 创建用户测试失败:', err)
    }
    
    // 4. 检查 PostgREST 配置
    console.log('\n--- PostgREST 配置信息 ---')
    console.log('检查以下配置:')
    console.log('1. Supabase 项目中 users 表是否真的包含 nickname 列')
    console.log('2. PostgREST schema 缓存是否需要手动刷新')
    console.log('3. API 权限配置是否正确')
    
    // 5. 提供修复建议
    console.log('\n=== 修复建议 ===')
    console.log('1. 在 Supabase Dashboard -> SQL Editor 中执行:')
    console.log(`
ALTER TABLE users ADD COLUMN IF NOT EXISTS nickname VARCHAR(100);
NOTIFY pgrst, 'reload schema';
    `)
    console.log('2. 检查 API 设置中的 Table Editor')
    console.log('3. 如果问题持续，尝试重启 Supabase 项目')
    
  } catch (error) {
    console.error('❌ 诊断过程出错:', error)
  }
}

// 临时修复注册函数（移除 nickname 字段）
async function fixedRegistration(userData) {
  console.log('=== 使用临时修复注册 ===')
  
  try {
    const { supabaseService } = await import('@/services/supabase.js')
    const client = supabaseService.getClient()
    
    // 暂时不包含 nickname 字段
    const { data, error } = await client
      .from('users')
      .insert({
        username: userData.username,
        email: userData.email,
        password_hash: userData.password_hash
        // 暂时移除 nickname
      })
      .select()
    
    if (error) throw error
    
    console.log('✅ 临时注册成功:', data)
    return data
    
  } catch (error) {
    console.error('❌ 临时注册失败:', error)
    throw error
  }
}

// 导出函数供控制台使用
window.diagnoseNicknameIssue = diagnoseNicknameIssue
window.fixedRegistration = fixedRegistration

console.log('诊断脚本已加载。运行 diagnoseNicknameIssue() 开始诊断。')
console.log('临时修复：运行 fixedRegistration(userData) 进行不包含 nickname 的注册。')