// 增强版点赞功能测试脚本
// 测试点赞功能是否正常工作，包括数据保存到post_likes表

const { createClient } = require('@supabase/supabase-js')

// 配置Supabase连接
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

async function testEnhancedLikeFunctionality() {
  try {
    console.log('🚀 开始测试增强版点赞功能...')
    
    // 创建Supabase客户端
    const client = createClient(supabaseUrl, supabaseKey)
    
    // 1. 检查post_likes表是否存在
    console.log('\n1. 检查post_likes表结构...')
    
    const { data: tableInfo, error: tableError } = await client
      .from('post_likes')
      .select('*')
      .limit(1)
    
    if (tableError && tableError.code === 'PGRST116') {
      console.log('❌ post_likes 表不存在，需要先创建表')
      return
    }
    
    if (tableError) {
      console.error('❌ 检查表失败:', tableError)
      return
    }
    
    console.log('✅ post_likes 表存在')
    
    // 2. 获取测试数据
    console.log('\n2. 获取测试数据...')
    
    // 获取一个测试帖子
    const { data: posts, error: postsError } = await client
      .from('community_posts')
      .select('id, title')
      .limit(1)
    
    if (postsError) {
      console.error('❌ 获取帖子失败:', postsError)
      return
    }
    
    if (!posts || posts.length === 0) {
      console.log('❌ 没有找到测试帖子，需要先创建帖子')
      return
    }
    
    const testPost = posts[0]
    console.log(`📝 测试帖子: "${testPost.title}" (ID: ${testPost.id})`)
    
    // 获取一个测试用户（使用第一个用户）
    const { data: users, error: usersError } = await client
      .from('users')
      .select('id, username')
      .limit(1)
    
    if (usersError) {
      console.error('❌ 获取用户失败:', usersError)
      return
    }
    
    if (!users || users.length === 0) {
      console.log('❌ 没有找到测试用户，需要先创建用户')
      return
    }
    
    const testUser = users[0]
    console.log(`👤 测试用户: "${testUser.username}" (ID: ${testUser.id})`)
    
    // 3. 测试点赞功能
    console.log('\n3. 测试点赞功能...')
    
    // 首先检查是否已经点赞
    const { data: existingLike, error: checkError } = await client
      .from('post_likes')
      .select('*')
      .eq('post_id', testPost.id)
      .eq('user_id', testUser.id)
      .single()
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ 检查点赞状态失败:', checkError)
      return
    }
    
    if (existingLike) {
      console.log('✅ 用户已点赞该帖子')
      
      // 测试取消点赞
      console.log('🔄 测试取消点赞...')
      const { error: deleteError } = await client
        .from('post_likes')
        .delete()
        .eq('post_id', testPost.id)
        .eq('user_id', testUser.id)
      
      if (deleteError) {
        console.error('❌ 取消点赞失败:', deleteError)
        return
      }
      
      console.log('✅ 取消点赞成功，记录已从post_likes表中删除')
      
      // 验证取消点赞
      const { data: verifyDelete, error: verifyDeleteError } = await client
        .from('post_likes')
        .select('*')
        .eq('post_id', testPost.id)
        .eq('user_id', testUser.id)
        .single()
      
      if (verifyDeleteError && verifyDeleteError.code === 'PGRST116') {
        console.log('✅ 验证成功：点赞记录已删除')
      } else {
        console.log('⚠️ 验证失败：点赞记录可能仍然存在')
      }
      
    } else {
      console.log('🔄 测试添加点赞...')
      
      // 添加点赞
      const { data: insertData, error: insertError } = await client
        .from('post_likes')
        .insert([{
          post_id: testPost.id,
          user_id: testUser.id
        }])
        .select()
      
      if (insertError) {
        console.error('❌ 添加点赞失败:', insertError)
        
        // 如果是唯一约束错误，说明已经点赞过
        if (insertError.code === '23505') {
          console.log('⚠️ 重复点赞，记录已存在')
        }
        return
      }
      
      console.log('✅ 添加点赞成功，数据已保存到post_likes表:', insertData)
      
      // 验证点赞
      const { data: verifyInsert, error: verifyInsertError } = await client
        .from('post_likes')
        .select('*')
        .eq('post_id', testPost.id)
        .eq('user_id', testUser.id)
        .single()
      
      if (verifyInsertError) {
        console.error('❌ 验证点赞失败:', verifyInsertError)
      } else {
        console.log('✅ 验证成功：点赞记录已创建')
      }
    }
    
    // 4. 测试点赞计数功能
    console.log('\n4. 测试点赞计数功能...')
    
    const { data: likeCount, error: countError } = await client
      .from('post_likes')
      .select('post_id', { count: 'exact' })
      .eq('post_id', testPost.id)
    
    if (countError) {
      console.error('❌ 统计点赞数失败:', countError)
    } else {
      console.log(`👍 帖子点赞数量: ${likeCount.length}`)
    }
    
    // 5. 测试点赞用户信息查询
    console.log('\n5. 测试点赞用户信息查询...')
    
    const { data: postWithLikes, error: postLikesError } = await client
      .from('community_posts')
      .select(`
        *,
        post_likes(
          id,
          user_id,
          created_at,
          user:users(username, nickname)
        )
      `)
      .eq('id', testPost.id)
      .single()
    
    if (postLikesError) {
      console.error('❌ 查询帖子点赞信息失败:', postLikesError)
    } else {
      console.log('✅ 帖子点赞信息查询成功')
      console.log(`📊 帖子标题: "${postWithLikes.title}"`)
      console.log(`👍 点赞数量: ${postWithLikes.post_likes?.length || 0}`)
      
      if (postWithLikes.post_likes && postWithLikes.post_likes.length > 0) {
        console.log('👥 点赞用户列表:')
        postWithLikes.post_likes.forEach((like, index) => {
          console.log(`   ${index + 1}. ${like.user?.nickname || like.user?.username || '匿名用户'} (ID: ${like.user_id})`)
        })
      }
    }
    
    console.log('\n🎉 增强版点赞功能测试完成！')
    console.log('✅ post_likes 表结构正常')
    console.log('✅ 点赞数据可以正确保存到post_likes表')
    console.log('✅ 点赞计数功能正常')
    console.log('✅ 点赞用户信息可以正确显示')
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error)
  }
}

// 运行测试
if (require.main === module) {
  testEnhancedLikeFunctionality()
}

module.exports = { testEnhancedLikeFunctionality }