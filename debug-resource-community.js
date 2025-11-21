// 调试资源创建和社区帖子同步的脚本
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://aonlahundnkxuyxfsmcy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE'
)

async function testResourceAndCommunityCreation() {
  try {
    console.log('🔍 开始测试资源创建和社区帖子同步...')
    
    // 1. 获取admin用户
    const { data: adminUser, error: userError } = await supabase
      .from('users')
      .select('id, username')
      .eq('username', 'admin')
      .maybeSingle()
    
    if (userError || !adminUser) {
      console.error('❌ 获取admin用户失败:', userError)
      return
    }
    
    console.log('✅ 获取admin用户成功:', adminUser)
    const userId = adminUser.id
    
    // 2. 创建测试资源
    const resourceData = {
      title: '测试资源 ' + new Date().toLocaleTimeString(),
      description: '这是一个测试资源的描述',
      type: 'article',
      category: '前端开发',
      difficulty: 'beginner',
      created_by: userId
    }
    
    const { data: createdResource, error: resourceError } = await supabase
      .from('resources')
      .insert([resourceData])
      .select()
    
    if (resourceError || !createdResource) {
      console.error('❌ 创建资源失败:', resourceError)
      return
    }
    
    console.log('✅ 资源创建成功:', createdResource[0])
    
    // 3. 创建对应的社区帖子
    const postData = {
      user_id: userId,
      title: resourceData.title,
      content: resourceData.description,
      category: resourceData.type,
      likes_count: 0,
      views_count: 0
    }
    
    const { data: createdPost, error: postError } = await supabase
      .from('community_posts')
      .insert([postData])
      .select()
    
    if (postError || !createdPost) {
      console.error('❌ 创建社区帖子失败:', postError)
      console.log('📄 资源已创建，但社区帖子创建失败')
      return
    }
    
    console.log('✅ 社区帖子创建成功:', createdPost[0])
    
    // 4. 验证数据是否正确存储
    console.log('🔍 验证数据存储情况...')
    
    // 检查resources表
    const { data: resources, error: resourcesError } = await supabase
      .from('resources')
      .select('*')
      .eq('id', createdResource[0].id)
    
    if (resourcesError) {
      console.error('❌ 验证资源失败:', resourcesError)
    } else {
      console.log('✅ 资源数据验证成功:', resources[0])
    }
    
    // 检查community_posts表
    const { data: posts, error: postsError } = await supabase
      .from('community_posts')
      .select('*')
      .eq('id', createdPost[0].id)
    
    if (postsError) {
      console.error('❌ 验证社区帖子失败:', postsError)
    } else {
      console.log('✅ 社区帖子数据验证成功:', posts[0])
    }
    
    console.log('🎉 测试完成！')
    console.log(`📊 资源ID: ${createdResource[0].id}`)
    console.log(`📊 社区帖子ID: ${createdPost[0].id}`)
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error)
  }
}

// 执行测试
testResourceAndCommunityCreation()