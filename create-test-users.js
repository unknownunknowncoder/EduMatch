import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE';

const client = createClient(supabaseUrl, supabaseKey);

async function createTestUsers() {
  try {
    console.log('👤 创建测试用户数据...\\n');

    // 1. 检查profiles表是否存在
    console.log('1. 检查profiles表...');
    const { data: profiles, error: profilesError } = await client
      .from('profiles')
      .select('id, username')
      .limit(1);

    if (profilesError && profilesError.message.includes('Could not find the table')) {
      console.log('❌ profiles表不存在，需要先创建表');
      return;
    }

    // 2. 创建测试用户
    console.log('2. 创建测试用户...');
    
    // 首先检查是否已经有用户
    const { data: existingUsers } = await client
      .from('profiles')
      .select('username')
      .limit(5);

    if (existingUsers && existingUsers.length > 0) {
      console.log('✅ 已有用户数据:');
      existingUsers.forEach(user => {
        console.log(`   - ${user.username}`);
      });
    } else {
      console.log('🔄 创建测试用户数据...');
      
      // 创建测试用户数据
      const testUsers = [
        {
          id: 'b6c871eb-717c-4a40-859b-b639cf8ccd08',
          username: 'testuser1',
          email: 'test1@example.com',
          nickname: '测试用户1',
          created_at: new Date().toISOString()
        },
        {
          id: 'c7d982fc-828d-5b51-96ac-c74adf9ddb19',
          username: 'testuser2', 
          email: 'test2@example.com',
          nickname: '测试用户2',
          created_at: new Date().toISOString()
        }
      ];

      const { data: insertedUsers, error: insertError } = await client
        .from('profiles')
        .insert(testUsers)
        .select();

      if (insertError) {
        console.log('❌ 创建用户失败:', insertError.message);
        
        // 尝试直接使用auth.users创建用户
        console.log('🔄 尝试使用直接的用户ID进行点赞测试...');
        await testLikesWithHardcodedUsers();
        return;
      }

      console.log('✅ 测试用户创建成功:');
      insertedUsers.forEach(user => {
        console.log(`   - ${user.username} (${user.nickname})`);
      });
    }

    // 3. 测试点赞功能
    console.log('\\n3. 测试点赞功能...');
    await testLikes();

  } catch (error) {
    console.error('❌ 创建用户过程中出现错误:', error);
  }
}

async function testLikesWithHardcodedUsers() {
  try {
    // 使用硬编码的用户ID进行测试
    const testUserId = 'b6c871eb-717c-4a40-859b-b639cf8ccd08';
    
    // 获取帖子数据
    const { data: posts } = await client
      .from('community_posts')
      .select('id, title')
      .limit(1);

    if (!posts || posts.length === 0) {
      console.log('❌ 没有帖子数据');
      return;
    }

    const testPost = posts[0];
    
    // 测试插入点赞
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
      return;
    }

    console.log('✅ 点赞插入成功:', likeData);

  } catch (error) {
    console.error('❌ 测试点赞失败:', error);
  }
}

async function testLikes() {
  try {
    // 获取用户和帖子
    const { data: users } = await client
      .from('profiles')
      .select('id, username')
      .limit(1);

    const { data: posts } = await client
      .from('community_posts')
      .select('id, title')
      .limit(1);

    if (!users || users.length === 0 || !posts || posts.length === 0) {
      console.log('❌ 缺少用户或帖子数据');
      return;
    }

    const testUser = users[0];
    const testPost = posts[0];

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

    console.log('✅ 点赞插入成功');

    // 查询点赞数据
    const { data: likes } = await client
      .from('post_likes')
      .select(`
        *,
        profiles:user_id (username, nickname),
        community_posts:post_id (title, author)
      `);

    console.log('\\n📊 点赞数据统计:');
    console.log(`✅ 点赞记录总数: ${likes?.length || 0}`);
    
    if (likes && likes.length > 0) {
      likes.forEach(like => {
        console.log(`   - 帖子: ${like.community_posts?.title}, 点赞用户: ${like.profiles?.username || like.profiles?.nickname || like.user_id}`);
      });
    }

    console.log('\\n🎉 点赞功能测试完成！');

  } catch (error) {
    console.error('❌ 测试点赞失败:', error);
  }
}

createTestUsers();