import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE'

const client = createClient(supabaseUrl, supabaseKey)

async function checkAllData() {
  console.log('🔍 检查所有导出相关的数据表...')
  
  // 检查用户数据
  try {
    console.log('\n👥 检查用户数据...')
    const { data: users, error: usersError } = await client
      .from('users')
      .select('*')
      .limit(5)
    
    if (usersError) {
      console.error('❌ 获取用户失败:', usersError.message)
    } else {
      console.log(`✅ 用户数据: ${users.length} 条`)
      if (users.length > 0) {
        console.log('   示例:', users[0].username || users[0].nickname)
      }
    }
  } catch (error) {
    console.error('❌ 检查用户数据异常:', error.message)
  }
  
  // 检查社区帖子
  try {
    console.log('\n📝 检查社区帖子数据...')
    const { data: posts, error: postsError } = await client
      .from('community_posts')
      .select('*')
      .limit(5)
    
    if (postsError) {
      console.error('❌ 获取帖子失败:', postsError.message)
    } else {
      console.log(`✅ 帖子数据: ${posts.length} 条`)
      if (posts.length > 0) {
        console.log('   示例:', posts[0].title || '无标题')
      }
    }
  } catch (error) {
    console.error('❌ 检查帖子数据异常:', error.message)
  }
  
  // 检查学习计划
  try {
    console.log('\n📚 检查学习计划数据...')
    const { data: plans, error: plansError } = await client
      .from('study_plans')
      .select('*')
      .limit(5)
    
    if (plansError) {
      console.error('❌ 获取学习计划失败:', plansError.message)
    } else {
      console.log(`✅ 学习计划数据: ${plans.length} 条`)
      if (plans.length > 0) {
        console.log('   示例:', plans[0].title || '无标题')
      }
    }
  } catch (error) {
    console.error('❌ 检查学习计划数据异常:', error.message)
  }
  
  // 检查学习资源
  try {
    console.log('\n📁 检查学习资源数据...')
    const { data: resources, error: resourcesError } = await client
      .from('resources')
      .select('*')
      .limit(5)
    
    if (resourcesError) {
      console.error('❌ 获取学习资源失败:', resourcesError.message)
    } else {
      console.log(`✅ 学习资源数据: ${resources.length} 条`)
      if (resources.length > 0) {
        console.log('   示例:', resources[0].title || '无标题')
      }
    }
  } catch (error) {
    console.error('❌ 检查学习资源数据异常:', error.message)
  }
  
  console.log('\n📊 检查完成！如果某些数据表为空，将导致导出时只有用户数据。')
  console.log('💡 建议：确保所有数据表中都有测试数据，这样才能测试完整的导出功能。')
}

checkAllData()