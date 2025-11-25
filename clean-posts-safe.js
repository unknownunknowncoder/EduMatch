// 安全删除社区测试帖子
import { createClient } from '@supabase/supabase-js'

console.log('🧹 安全清理社区测试帖子...')

// Supabase 配置
const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function cleanPostsSafely() {
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
      console.log(`${index + 1}. ID: ${post.id} - "${post.title}" - ${post.author}`)
    })
    
    console.log('\n🗑️ 开始逐条删除帖子...')
    let deletedCount = 0
    let failedCount = 0
    
    // 逐条删除帖子
    for (const post of posts) {
      try {
        console.log(`🗑️ 删除帖子: "${post.title}" (ID: ${post.id})`)
        
        const { error: deleteError } = await supabase
          .from('community_posts')
          .delete()
          .eq('id', post.id)
        
        if (deleteError) {
          console.error(`❌ 删除失败: ${deleteError.message}`)
          failedCount++
        } else {
          console.log(`✅ 删除成功`)
          deletedCount++
        }
      } catch (error) {
        console.error(`❌ 删除异常: ${error.message}`)
        failedCount++
      }
    }
    
    console.log(`\n📊 删除统计:`)
    console.log(`✅ 成功删除: ${deletedCount} 条`)
    console.log(`❌ 删除失败: ${failedCount} 条`)
    
    // 验证清理结果
    console.log('\n🔍 验证清理结果...')
    const { data: remainingPosts, error: verifyError } = await supabase
      .from('community_posts')
      .select('id, title')
    
    if (verifyError) {
      console.error('❌ 验证失败:', verifyError)
    } else {
      if (!remainingPosts || remainingPosts.length === 0) {
        console.log('🎉 验证成功：所有帖子已清理完毕')
      } else {
        console.log(`⚠️ 仍有 ${remainingPosts.length} 条帖子未清理:`)
        remainingPosts.forEach((post, index) => {
          console.log(`  ${index + 1}. ID: ${post.id} - "${post.title}"`)
        })
        
        // 如果是RLS策略问题，提供SQL解决方案
        console.log('\n💡 如果仍然无法删除，可能需要手动执行以下SQL:')
        console.log(`-- 进入 Supabase SQL Editor 执行以下命令`)
        console.log(`TRUNCATE TABLE community_posts;`)
        console.log(`或者`)
        console.log(`DELETE FROM community_posts;`)
        console.log(`-- 然后重置序列`)
        console.log(`ALTER SEQUENCE community_posts_id_seq RESTART WITH 1;`)
      }
    }
    
    console.log('\n🎯 清理操作完成')
    
  } catch (error) {
    console.error('❌ 清理过程中发生错误:', error)
  }
}

cleanPostsSafely()