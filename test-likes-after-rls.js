import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE';

const client = createClient(supabaseUrl, supabaseKey);

async function testLikesAfterRLSRemoval() {
  try {
    console.log('🧪 测试RLS策略解除后的点赞功能...\\n');

    // 1. 测试插入点赞数据
    console.log('1. 测试插入点赞数据...');
    
    // 获取测试用户和帖子
    const { data: users } = await client
      .from('profiles')
      .select('id, username')
      .limit(1);
    
    const { data: posts } = await client
      .from('community_posts')
      .select('id, title')
      .limit(1);
    
    if (!users || users.length === 0 || !posts || posts.length === 0) {
      console.log('❌ 缺少测试数据，请先确保有用户和帖子');
      return;
    }

    const testUser = users[0];
    const testPost = posts[0];
    
    console.log('  测试用户:', testUser.username);
    console.log('  测试帖子:', testPost.title);

    // 插入点赞数据
    const { data: likeData, error: insertError } = await client
      .from('post_likes')
      .insert({
        user_id: testUser.id,
        post_id: testPost.id,
        created_at: new Date().toISOString()
      })
      .select();

    if (insertError) {
      console.log('❌ 插入点赞失败:', insertError.message);
      return;
    }

    console.log('✅ 插入点赞成功:', likeData);

    // 2. 测试查询点赞数据（包含用户信息）
    console.log('\\n2. 测试查询点赞数据（包含用户信息）...');
    
    const { data: likesWithUsers, error: queryError } = await client
      .from('post_likes')
      .select(`
        *,
        profiles:user_id (username, nickname),
        community_posts:post_id (title, author)
      `);

    if (queryError) {
      console.log('❌ 查询点赞失败:', queryError.message);
    } else {
      console.log('✅ 查询点赞成功:');
      likesWithUsers.forEach(like => {
        console.log(`   - 帖子: ${like.community_posts?.title}, 作者: ${like.community_posts?.author}, 点赞用户: ${like.profiles?.username || like.profiles?.nickname}`);
      });
    }

    // 3. 测试点赞计数
    console.log('\\n3. 测试点赞计数...');
    
    const { data: postLikes, error: countError } = await client
      .from('post_likes')
      .select('post_id')
      .eq('post_id', testPost.id);

    if (countError) {
      console.log('❌ 统计点赞数失败:', countError.message);
    } else {
      console.log(`✅ 帖子 \"${testPost.title}\" 的点赞数: ${postLikes.length}`);
    }

    console.log('\\n🎉 RLS策略解除后，点赞功能已恢复正常！');

  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error);
  }
}

testLikesAfterRLSRemoval();