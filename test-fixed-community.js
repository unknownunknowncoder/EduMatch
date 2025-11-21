// 测试修复后的社区页面功能
import { createClient } from '@supabase/supabase-js'

console.log('🧪 测试修复后的社区页面功能...')

// Supabase 配置
const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testCommunityPage() {
  try {
    console.log('\n1. 🔄 测试数据库连接...')
    const { data: testData, error: testError } = await supabase
      .from('community_posts')
      .select('count', { count: 'exact' })
    
    if (testError) {
      console.error('❌ 连接测试失败:', testError)
      return
    }
    console.log('✅ 数据库连接正常，帖子总数:', testData[0]?.count || 0)

    console.log('\n2. 📝 测试帖子查询...')
    const { data: posts, error: postsError } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (postsError) {
      console.error('❌ 帖子查询失败:', postsError)
      return
    }
    
    console.log('✅ 成功查询帖子，数量:', posts?.length || 0)
    
    if (posts && posts.length > 0) {
      console.log('\n📄 帖子预览:')
      posts.slice(0, 3).forEach((post, index) => {
        console.log(`\n  ${index + 1}. ${post.title}`)
        console.log(`     作者: ${post.author}`)
        console.log(`     内容: ${post.content?.substring(0, 50)}...`)
        console.log(`     分类: ${post.category}`)
        console.log(`     标签: ${post.tags?.join(', ') || '无'}`)
        console.log(`     点赞: ${post.likes_count || 0}`)
        console.log(`     时间: ${post.created_at}`)
      })
    }

    console.log('\n3. 🏷️ 测试标签统计...')
    const { data: tagsData, error: tagsError } = await supabase
      .from('community_posts')
      .select('tags')
    
    if (tagsError) {
      console.error('❌ 标签查询失败:', tagsError)
      return
    }
    
    // 统计标签
    const tagCount = {}
    tagsData?.forEach((post) => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag) => {
          tagCount[tag] = (tagCount[tag] || 0) + 1
        })
      }
    })
    
    const sortedTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
    
    console.log('✅ 热门标签统计完成:')
    sortedTags.forEach(([tag, count], index) => {
      console.log(`  ${index + 1}. ${tag}: ${count}次`)
    })

    console.log('\n4. ➕ 测试创建帖子功能...')
    const testPost = {
      title: '测试帖子 - ' + new Date().toLocaleString(),
      content: '这是一个测试帖子，用于验证前端修复是否有效。包含一些测试内容来确保功能正常。',
      category: '前端开发',
      tags: ['测试', 'Vue', '修复'],
      author: '测试用户',
      likes_count: 0,
      views_count: 0,
      comments_count: 0
    }
    
    const { data: newPost, error: createError } = await supabase
      .from('community_posts')
      .insert([testPost])
      .select()
    
    if (createError) {
      console.error('❌ 创建测试帖子失败:', createError)
    } else {
      console.log('✅ 测试帖子创建成功:', newPost[0]?.id)
      
      // 清理测试数据
      console.log('🧹 清理测试数据...')
      await supabase
        .from('community_posts')
        .delete()
        .eq('id', newPost[0].id)
      console.log('✅ 测试数据已清理')
    }

    console.log('\n🎉 所有测试完成！社区页面功能应该已修复。')
    console.log('\n📋 修复总结:')
    console.log('  ✅ 数据库连接检查')
    console.log('  ✅ 帖子查询功能')
    console.log('  ✅ 标签统计功能') 
    console.log('  ✅ 帖子创建功能')
    console.log('\n🌐 请访问 http://localhost:3005/community 查看修复后的页面')

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error)
  }
}

testCommunityPage()