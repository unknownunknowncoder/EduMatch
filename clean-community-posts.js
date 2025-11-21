// 清理社区测试帖子
import { createClient } from '@supabase/supabase-js'

console.log('🧹 开始清理社区测试帖子...')

// Supabase 配置
const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function cleanCommunityPosts() {
  try {
    console.log('\n📋 当前帖子列表:')
    
    // 获取所有帖子
    const { data: posts, error: fetchError } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (fetchError) {
      console.error('❌ 获取帖子失败:', fetchError)
      return
    }
    
    if (!posts || posts.length === 0) {
      console.log('✅ 没有找到帖子，无需清理')
      return
    }
    
    // 显示当前帖子
    posts.forEach((post, index) => {
      console.log(`${index + 1}. "${post.title}" - ${post.author} (${post.created_at})`)
    })
    
    console.log('\n🗑️ 开始删除帖子...')
    
    // 删除所有帖子
    const { error: deleteError } = await supabase
      .from('community_posts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // 删除所有记录
    
    if (deleteError) {
      console.error('❌ 删除帖子失败:', deleteError)
      return
    }
    
    console.log(`✅ 成功删除 ${posts.length} 条帖子`)
    
    // 验证清理结果
    console.log('\n🔍 验证清理结果...')
    const { data: remainingPosts, error: verifyError } = await supabase
      .from('community_posts')
      .select('count', { count: 'exact' })
    
    if (verifyError) {
      console.error('❌ 验证失败:', verifyError)
    } else {
      const count = remainingPosts[0]?.count || 0
      if (count === 0) {
        console.log('✅ 验证成功：所有测试帖子已清理完毕')
      } else {
        console.log(`⚠️ 警告：仍有 ${count} 条帖子未清理`)
      }
    }
    
    console.log('\n🎉 社区帖子清理完成！')
    console.log('📝 现在社区页面将是空白的，等待真实用户发布内容')
    
  } catch (error) {
    console.error('❌ 清理过程中发生错误:', error)
  }
}

cleanCommunityPosts()