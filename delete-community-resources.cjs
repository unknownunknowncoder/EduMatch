// 删除社区中所有资源类型的帖子
// 这个脚本会删除所有分类为资源相关的社区帖子

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function deleteResourcePosts() {
  try {
    console.log('🔄 开始删除社区中的资源帖子...')
    
    // 查找所有资源类型的社区帖子
    const { data: resourcePosts, error: fetchError } = await supabase
      .from('community_posts')
      .select('*')
      .in('category', ['course', 'book', 'video', 'article', 'tool', 'other'])
      .or('title.ilike.%资源%,content.ilike.%资源%,title.ilike.%学习%,content.ilike.%学习%')
    
    if (fetchError) {
      console.error('❌ 查询资源帖子失败:', fetchError)
      return
    }
    
    console.log(`📊 找到 ${resourcePosts?.length || 0} 个资源相关的社区帖子`)
    
    if (!resourcePosts || resourcePosts.length === 0) {
      console.log('✅ 没有找到资源相关的社区帖子')
      return
    }
    
    // 删除这些帖子
    const { error: deleteError } = await supabase
      .from('community_posts')
      .delete()
      .in('id', resourcePosts.map(post => post.id))
    
    if (deleteError) {
      console.error('❌ 删除资源帖子失败:', deleteError)
      return
    }
    
    console.log(`✅ 成功删除了 ${resourcePosts.length} 个资源相关的社区帖子`)
    
    // 显示删除的帖子列表
    console.log('\n📋 删除的帖子列表:')
    resourcePosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title} (${post.category})`)
    })
    
  } catch (error) {
    console.error('❌ 删除过程中出现错误:', error)
  }
}

// 执行删除
deleteResourcePosts()