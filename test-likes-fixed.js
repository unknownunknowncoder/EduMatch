import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE';

const client = createClient(supabaseUrl, supabaseKey);

async function testLikesFixed() {
  try {
    console.log('🧪 测试点赞功能...\\n');

    // 1. 检查用户数据（从 auth.users 表）
    console.log('1. 检查用户数据...');
    const { data: users, error: usersError } = await client
      .from('auth.users')
      .select('id, email')
      .limit(5);

    if (usersError) {
      console.log('❌ 查询用户失败:', usersError.message);
      // 尝试从 profiles 表获取用户
      const { data: profiles } = await client
        .from('profiles')
        .select('id, username, email')
        .limit(5);
      
      if (profiles && profiles.length > 0) {
        console.log('✅ 从 profiles 表找到用户:');
        profiles.forEach(profile => {
          console.log(`   - ${profile.username} (${profile.email})`);
        });
      } else {
        console.log('⚠️ 没有找到用户数据，需要先创建测试用户');
      }
    } else {
      console.log('✅ 用户数量:', users.length);
      users.forEach(user => {
        console.log(`   - ${user.email}`);
      });
    }

    // 2. 检查社区帖子
    console.log('\\n2. 检查社区帖子...');
    const { data: posts, error: postsError } = await client
      .from('community_posts')
      .select('id, title, author')
      .limit(5);

    if (postsError) {
      console.log('❌ 查询帖子失败:', postsError.message);
      return;
    }

    console.log('✅ 帖子数量:', posts.length);
    posts.forEach(post => {
      console.log(`   - ${post.title} (作者: ${post.author})`);
    });

    if (posts.length === 0) {
      console.log('❌ 没有帖子数据，无法测试点赞功能');
      return;
    }

    // 3. 创建测试用户（如果需要）
    console.log('\\n3. 创建测试用户...');
    
    // 使用现有用户或创建新用户
    let testUserId = null;
    
    // 尝试从 auth.users 获取用户
    const { data: authUsers } = await client
      .from('auth.users')
      .select('id')
      .limit(1);
    
    if (authUsers && authUsers.length > 0) {
      testUserId = authUsers[0].id;
      console.log('✅ 使用现有用户:', testUserId);
    } else {
      // 尝试从 profiles 表获取用户
      const { data: profiles } = await client
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (profiles && profiles.length > 0) {
        testUserId = profiles[0].id;
        console.log('✅ 使用 profiles 表用户:', testUserId);
      } else {
        console.log('❌ 没有找到可用的用户数据');
        return;
      }
    }

    const testPost = posts[0];
    
    // 4. 测试插入点赞数据
    console.log('\\n4. 测试插入点赞数据...');
    
    const { data: likeData, error: insertError } = await client
      .from('post_likes')
      .insert({
        user_id: testUserId,
        post_id: testPost.id,
        created_at: new Date().toISOString()
      })
      .select();

    if (insertError) {
      console.log('❌ 插入点赞失败:', insertError.message);
      
      // 检查是否是RLS问题
      if (insertError.message.includes('row-level security')) {
        console.log('⚠️ 可能是RLS策略问题，需要进一步检查');
      }
      
      return;
    }

    console.log('✅ 插入点赞成功:', likeData);

    // 5. 测试查询点赞数据
    console.log('\\n5. 测试查询点赞数据...');
    
    const { data: likes, error: likesError } = await client
      .from('post_likes')
      .select(`
        *,
        community_posts:post_id (title, author)
      `);

    if (likesError) {
      console.log('❌ 查询点赞失败:', likesError.message);
    } else {
      console.log('✅ 点赞记录数量:', likes.length);
      likes.forEach(like => {
        console.log(`   - 帖子: ${like.community_posts?.title}, 用户ID: ${like.user_id}`);
      });
    }

    // 6. 测试点赞计数
    console.log('\\n6. 测试点赞计数...');
    
    const { data: postLikes, error: countError } = await client
      .from('post_likes')
      .select('post_id')
      .eq('post_id', testPost.id);

    if (countError) {
      console.log('❌ 统计点赞数失败:', countError.message);
    } else {
      console.log(`✅ 帖子 \"${testPost.title}\" 的点赞数: ${postLikes.length}`);
    }

    console.log('\\n🎉 点赞功能测试完成！');

  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error);
  }
}

testLikesFixed();