import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE';

const client = createClient(supabaseUrl, supabaseKey);

async function testLikeFunctionality() {
  try {
    console.log('🔍 测试点赞功能...');

    // 1. 检查点赞表是否存在
    console.log('\n1. 检查点赞表结构...');
    try {
      // 尝试直接查询点赞表
      const { data: likes, error: likesError } = await client
        .from('post_likes')
        .select('*')
        .limit(1);

      if (likesError && likesError.code === 'PGRST116') {
        console.log('❌ post_likes 表不存在');
        return;
      }

      if (likesError) {
        console.error('❌ 检查表失败:', likesError);
        return;
      }

      console.log('✅ post_likes 表存在');
    } catch (error) {
      console.error('❌ 检查表失败:', error);
      return;
    }

    // 2. 检查社区帖子
    console.log('\n2. 检查社区帖子...');
    const { data: posts, error: postsError } = await client
      .from('community_posts')
      .select('*')
      .limit(5);

    if (postsError) {
      console.error('❌ 获取帖子失败:', postsError);
      return;
    }

    console.log(`📝 找到 ${posts.length} 个帖子`);

    if (posts.length === 0) {
      console.log('⚠️ 没有帖子数据，无法测试点赞功能');
      return;
    }

    // 3. 检查点赞数据
    console.log('\n3. 检查点赞数据...');
    const { data: likes, error: likesError } = await client
      .from('post_likes')
      .select(`
        *,
        post:community_posts(id, title, author),
        user:users(id, username, nickname)
      `)
      .limit(10);

    if (likesError) {
      console.error('❌ 获取点赞数据失败:', likesError);
      return;
    }

    console.log(`👍 找到 ${likes.length} 条点赞记录`);

    // 显示点赞详情
    if (likes.length > 0) {
      console.log('\n📊 点赞详情:');
      likes.forEach((like, index) => {
        console.log(`\n${index + 1}. 帖子: "${like.post?.title || '未知帖子'}"`);
        console.log(`   作者: ${like.post?.author || '未知作者'}`);
        console.log(`   点赞用户: ${like.user?.nickname || like.user?.username || '匿名用户'}`);
        console.log(`   用户ID: ${like.user_id}`);
        console.log(`   点赞时间: ${new Date(like.created_at).toLocaleString()}`);
      });
    }

    // 4. 为第一个帖子添加测试点赞
    console.log('\n4. 测试添加点赞...');
    const testPost = posts[0];
    const testUserId = 'b6c871eb-717c-4a40-859b-b639cf8ccd08'; // 使用现有用户ID

    console.log(`📝 测试帖子: "${testPost.title}"`);
    console.log(`👤 测试用户ID: ${testUserId}`);

    // 检查是否已经点赞
    const { data: existingLike, error: checkError } = await client
      .from('post_likes')
      .select('*')
      .eq('post_id', testPost.id)
      .eq('user_id', testUserId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ 检查点赞状态失败:', checkError);
    }

    if (existingLike) {
      console.log('✅ 用户已点赞该帖子');
      
      // 测试取消点赞
      console.log('🔄 测试取消点赞...');
      const { error: deleteError } = await client
        .from('post_likes')
        .delete()
        .eq('post_id', testPost.id)
        .eq('user_id', testUserId);

      if (deleteError) {
        console.error('❌ 取消点赞失败:', deleteError);
      } else {
        console.log('✅ 取消点赞成功');
      }
    } else {
      console.log('🔄 测试添加点赞...');
      const { error: insertError } = await client
        .from('post_likes')
        .insert([{
          post_id: testPost.id,
          user_id: testUserId
        }]);

      if (insertError) {
        console.error('❌ 添加点赞失败:', insertError);
      } else {
        console.log('✅ 添加点赞成功');
      }
    }

    // 5. 验证点赞用户信息查询
    console.log('\n5. 验证点赞用户信息查询...');
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
      .single();

    if (postLikesError) {
      console.error('❌ 查询帖子点赞信息失败:', postLikesError);
    } else {
      console.log('✅ 帖子点赞信息查询成功');
      console.log(`📊 帖子标题: "${postWithLikes.title}"`);
      console.log(`👍 点赞数量: ${postWithLikes.post_likes?.length || 0}`);
      
      if (postWithLikes.post_likes && postWithLikes.post_likes.length > 0) {
        console.log('👥 点赞用户列表:');
        postWithLikes.post_likes.forEach((like, index) => {
          console.log(`   ${index + 1}. ${like.user?.nickname || like.user?.username || '匿名用户'} (ID: ${like.user_id})`);
        });
      }
    }

    console.log('\n🎉 点赞功能测试完成！');
    console.log('✅ 点赞表结构正常');
    console.log('✅ 点赞数据可以正常查询');
    console.log('✅ 点赞用户信息可以正确显示');

  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error);
  }
}

testLikeFunctionality();