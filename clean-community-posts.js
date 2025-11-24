// 清理社区模拟数据脚本
// 删除不是注册用户发布的帖子和评论

import { createClient } from '@supabase/supabase-js'

// 配置 Supabase 连接
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

console.log('🧹 开始清理社区模拟数据...')

async function cleanCommunityData() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('🔍 检查当前数据库状态...')

    // 1. 获取所有注册用户
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, username, nickname')

    if (usersError) {
      console.error('❌ 获取用户列表失败:', usersError)
      return
    }

    console.log(`📊 当前注册用户数量: ${users?.length || 0}`)
    console.log('👥 注册用户列表:', users?.map(u => ({ id: u.id, username: u.username, nickname: u.nickname })))

    // 2. 获取所有帖子
    const { data: posts, error: postsError } = await supabase
      .from('community_posts')
      .select('id, title, user_id, author')

    if (postsError) {
      console.error('❌ 获取帖子列表失败:', postsError)
      return
    }

    console.log(`📄 当前帖子数量: ${posts?.length || 0}`)
    
    // 3. 识别模拟帖子（没有对应注册用户的帖子）
    const validUserIds = users?.map(u => u.id) || []
    const mockPosts = posts?.filter(post => !validUserIds.includes(post.user_id)) || []

    console.log(`🔍 识别出模拟帖子数量: ${mockPosts.length}`)
    
    if (mockPosts.length > 0) {
      console.log('📝 模拟帖子列表:')
      mockPosts.forEach(post => {
        console.log(`   - ${post.title} (作者: ${post.author}, 用户ID: ${post.user_id})`)
      })

      // 4. 删除模拟帖子
      console.log('🗑️ 开始删除模拟帖子...')
      
      // 先删除相关的评论
      const mockPostIds = mockPosts.map(p => p.id)
      const { error: deleteCommentsError } = await supabase
        .from('post_comments')
        .delete()
        .in('post_id', mockPostIds)

      if (deleteCommentsError) {
        console.error('❌ 删除帖子评论失败:', deleteCommentsError)
      } else {
        console.log('✅ 帖子评论删除完成')
      }

      // 删除模拟帖子
      const { error: deletePostsError } = await supabase
        .from('community_posts')
        .delete()
        .in('id', mockPostIds)

      if (deletePostsError) {
        console.error('❌ 删除模拟帖子失败:', deletePostsError)
        return
      }

      console.log('✅ 模拟帖子删除完成')
    } else {
      console.log('✅ 没有发现模拟帖子')
    }

    // 5. 检查并清理没有对应帖子的评论
    console.log('🔍 检查孤立评论...')
    
    const { data: comments, error: commentsError } = await supabase
      .from('post_comments')
      .select('id, post_id, content')

    if (commentsError) {
      console.error('❌ 获取评论列表失败:', commentsError)
    } else {
      console.log(`💬 当前评论数量: ${comments?.length || 0}`)
      
      // 获取所有有效帖子ID
      const { data: validPosts } = await supabase
        .from('community_posts')
        .select('id')
      
      const validPostIds = validPosts?.map(p => p.id) || []
      
      // 识别孤立评论（没有对应帖子的评论）
      const orphanedComments = comments?.filter(comment => !validPostIds.includes(comment.post_id)) || []
      
      console.log(`🔍 识别出孤立评论数量: ${orphanedComments.length}`)
      
      if (orphanedComments.length > 0) {
        console.log('🗑️ 开始删除孤立评论...')
        
        const orphanedCommentIds = orphanedComments.map(c => c.id)
        const { error: deleteOrphanedError } = await supabase
          .from('post_comments')
          .delete()
          .in('id', orphanedCommentIds)

        if (deleteOrphanedError) {
          console.error('❌ 删除孤立评论失败:', deleteOrphanedError)
        } else {
          console.log('✅ 孤立评论删除完成')
        }
      } else {
        console.log('✅ 没有发现孤立评论')
      }
    }

    // 6. 检查没有对应注册用户的评论
    console.log('🔍 检查没有对应注册用户的评论...')
    
    const { data: allComments, error: allCommentsError } = await supabase
      .from('post_comments')
      .select('id, user_id, content')

    if (allCommentsError) {
      console.error('❌ 获取评论列表失败:', allCommentsError)
    } else {
      const invalidUserComments = allComments?.filter(comment => !validUserIds.includes(comment.user_id)) || []
      
      console.log(`🔍 识别出无效用户评论数量: ${invalidUserComments.length}`)
      
      if (invalidUserComments.length > 0) {
        console.log('🗑️ 开始删除无效用户评论...')
        
        const invalidCommentIds = invalidUserComments.map(c => c.id)
        const { error: deleteInvalidError } = await supabase
          .from('post_comments')
          .delete()
          .in('id', invalidCommentIds)

        if (deleteInvalidError) {
          console.error('❌ 删除无效用户评论失败:', deleteInvalidError)
        } else {
          console.log('✅ 无效用户评论删除完成')
        }
      } else {
        console.log('✅ 没有发现无效用户评论')
      }
    }

    // 7. 验证清理结果
    console.log('\n✅ 清理完成，验证结果...')
    
    const { data: finalPosts } = await supabase
      .from('community_posts')
      .select('id, title, user_id, author')

    const { data: finalComments } = await supabase
      .from('post_comments')
      .select('id, post_id, user_id, content')

    console.log(`📊 最终帖子数量: ${finalPosts?.length || 0}`)
    console.log(`💬 最终评论数量: ${finalComments?.length || 0}`)

    // 检查是否还有模拟数据
    const remainingMockPosts = finalPosts?.filter(post => !validUserIds.includes(post.user_id)) || []
    const remainingInvalidComments = finalComments?.filter(comment => !validUserIds.includes(comment.user_id)) || []

    console.log(`🔍 剩余模拟帖子: ${remainingMockPosts.length}`)
    console.log(`🔍 剩余无效用户评论: ${remainingInvalidComments.length}`)

    if (remainingMockPosts.length === 0 && remainingInvalidComments.length === 0) {
      console.log('🎉 所有模拟数据清理完成！')
      console.log('✅ 只保留注册用户发布的帖子和评论')
    } else {
      console.log('⚠️ 仍有部分模拟数据需要手动清理')
    }

  } catch (error) {
    console.error('❌ 清理社区数据失败:', error)
  }
}

// 运行清理脚本
cleanCommunityData()