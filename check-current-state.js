import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE';

const client = createClient(supabaseUrl, supabaseKey);

async function checkCurrentState() {
  try {
    console.log('🔍 检查数据库当前状态...\\n');

    // 1. 检查用户数据
    console.log('1. 检查用户数据...');
    const { data: users, error: usersError } = await client
      .from('profiles')
      .select('id, username, email')
      .limit(5);

    if (usersError) {
      console.log('❌ 查询用户失败:', usersError.message);
    } else {
      console.log('✅ 用户数量:', users.length);
      users.forEach(user => {
        console.log(`   - ${user.username} (${user.email})`);
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
    } else {
      console.log('✅ 帖子数量:', posts.length);
      posts.forEach(post => {
        console.log(`   - ${post.title} (作者: ${post.author})`);
      });
    }

    // 3. 检查点赞表
    console.log('\\n3. 检查点赞表...');
    const { data: likes, error: likesError } = await client
      .from('post_likes')
      .select('*')
      .limit(5);

    if (likesError) {
      console.log('❌ 查询点赞失败:', likesError.message);
    } else {
      console.log('✅ 点赞记录数量:', likes.length);
      likes.forEach(like => {
        console.log(`   - 用户ID: ${like.user_id}, 帖子ID: ${like.post_id}`);
      });
    }

    // 4. 测试RLS策略是否已解除
    console.log('\\n4. 测试RLS策略...');
    
    if (users.length > 0 && posts.length > 0) {
      const testUser = users[0];
      const testPost = posts[0];
      
      console.log('  测试插入点赞数据...');
      const { data: testLike, error: testError } = await client
        .from('post_likes')
        .insert({
          user_id: testUser.id,
          post_id: testPost.id,
          created_at: new Date().toISOString()
        })
        .select();

      if (testError) {
        console.log('❌ RLS策略可能仍然存在:', testError.message);
      } else {
        console.log('✅ RLS策略已解除，可以正常插入点赞数据');
      }
    }

  } catch (error) {
    console.error('❌ 检查过程中出现错误:', error);
  }
}

checkCurrentState();