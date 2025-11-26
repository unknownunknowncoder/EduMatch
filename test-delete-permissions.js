// 测试删除权限的脚本
// 在浏览器控制台中运行此脚本来测试删除功能

async function testDeletePermissions() {
  console.log('🧪 开始测试删除权限...')
  
  // 检查当前用户
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
  if (!currentUser.id) {
    console.error('❌ 用户未登录')
    return
  }
  
  console.log('✅ 当前用户ID:', currentUser.id)
  
  // 尝试导入和测试Supabase服务
  try {
    const { supabaseService } = await import('./src/services/supabase.js')
    const client = supabaseService.getClient()
    
    console.log('✅ Supabase客户端获取成功')
    
    // 测试查询用户的帖子
    console.log('🔍 测试查询用户帖子...')
    const { data: posts, error: postsError } = await client
      .from('community_posts')
      .select('*')
      .eq('user_id', currentUser.id)
      .limit(1)
    
    if (postsError) {
      console.error('❌ 查询帖子失败:', postsError)
      return
    }
    
    console.log('✅ 查询帖子成功，找到', posts.length, '个帖子')
    
    if (posts.length === 0) {
      console.log('ℹ️ 没有找到可测试删除的帖子')
      return
    }
    
    const testPost = posts[0]
    console.log('🎯 将测试删除帖子:', testPost.title)
    
    // 不执行实际删除，只测试权限
    console.log('⚠️ 仅测试删除权限，不执行实际删除')
    
    // 测试用户的资源
    console.log('🔍 测试查询用户资源...')
    const { data: resources, error: resourcesError } = await client
      .from('resources')
      .select('*')
      .eq('created_by', currentUser.id)
      .limit(1)
    
    if (resourcesError) {
      console.error('❌ 查询资源失败:', resourcesError)
      return
    }
    
    console.log('✅ 查询资源成功，找到', resources.length, '个资源')
    
    if (resources.length > 0) {
      console.log('🎯 可测试删除的资源:', resources[0].title)
    }
    
    // 检查网络连接
    console.log('🌐 检查网络连接...')
    const testResponse = await fetch(client.supabaseUrl + '/rest/v1/', {
      headers: {
        'apikey': client.supabaseKey,
        'Authorization': `Bearer ${client.supabaseKey}`
      }
    })
    
    console.log('✅ 网络连接测试，状态码:', testResponse.status)
    
    console.log('🎉 权限测试完成！')
    
  } catch (error) {
    console.error('❌ 测试过程中出错:', error)
  }
}

// 运行测试
testDeletePermissions()