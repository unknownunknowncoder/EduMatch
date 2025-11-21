// 调试前端社区帖子获取问题
import { createClient } from '@supabase/supabase-js'

// Supabase 配置
const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE'

console.log('🔧 调试前端社区帖子获取...')

async function debugFrontendPosts() {
  try {
    // 创建 Supabase 客户端
    const client = createClient(supabaseUrl, supabaseKey)
    console.log('✅ Supabase 客户端创建成功')

    // 测试连接
    console.log('\n📡 测试数据库连接...')
    
    // 直接查询 community_posts 表
    console.log('\n📝 直接查询 community_posts 表:')
    const { data: directData, error: directError } = await client
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (directError) {
      console.error('❌ 直接查询失败:', directError)
      return
    }
    console.log('✅ 直接查询成功，获取到', directData?.length || 0, '条帖子')
    
    if (directData && directData.length > 0) {
      directData.forEach((post, index) => {
        console.log(`\n📄 帖子 ${index + 1}:`)
        console.log('  ID:', post.id)
        console.log('  标题:', post.title)
        console.log('  作者:', post.author)
        console.log('  内容:', post.content?.substring(0, 100) + '...')
        console.log('  创建时间:', post.created_at)
        console.log('  标签:', post.tags)
        console.log('  分类:', post.category)
        console.log('  点赞数:', post.likes_count)
      })
    }

    // 测试前端代码中使用的查询方式
    console.log('\n🔍 测试前端代码查询方式:')
    const { data: frontendData, error: frontendError } = await client
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (frontendError) {
      console.error('❌ 前端查询失败:', frontendError)
      return
    }
    console.log('✅ 前端查询成功，获取到', frontendData?.length || 0, '条帖子')

    // 测试热门标签查询
    console.log('\n🏷️ 测试热门标签查询:')
    const { data: tagsData, error: tagsError } = await client
      .from('community_posts')
      .select('tags')

    if (tagsError) {
      console.error('❌ 标签查询失败:', tagsError)
    } else {
      console.log('✅ 标签查询成功')
      
      // 统计标签
      const tagCount = {}
      tagsData?.forEach((post) => {
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach((tag) => {
            tagCount[tag] = (tagCount[tag] || 0) + 1
          })
        }
      })
      
      console.log('📊 标签统计:')
      Object.entries(tagCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .forEach(([tag, count]) => {
          console.log(`  ${tag}: ${count}次`)
        })
    }

    // 测试 RLS 策略
    console.log('\n🔐 检查 RLS 策略:')
    const { data: rlsTest, error: rlsError } = await client
      .from('community_posts')
      .select('id, title')
      .limit(1)

    if (rlsError) {
      console.error('❌ RLS 测试失败:', rlsError)
      console.error('错误代码:', rlsError.code)
      console.error('错误详情:', rlsError.details)
    } else {
      console.log('✅ RLS 允许匿名访问')
    }

  } catch (error) {
    console.error('❌ 调试过程中发生错误:', error)
  }
}

debugFrontendPosts()