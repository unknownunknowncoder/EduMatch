import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE';

const client = createClient(supabaseUrl, supabaseKey);

async function setupDatabaseTables() {
  try {
    console.log('🛠️ 设置数据库表结构...\\n');

    // 1. 检查并创建profiles表
    console.log('1. 检查并创建profiles表...');
    
    const createProfilesSQL = `
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        nickname VARCHAR(100),
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- 创建索引
      CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
      CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
      
      -- 启用行级安全（宽松策略用于测试）
      ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
      
      -- 创建策略
      DROP POLICY IF EXISTS "任何人都可以查看用户" ON profiles;
      CREATE POLICY "任何人都可以查看用户" ON profiles
        FOR SELECT USING (true);
      
      DROP POLICY IF EXISTS "任何人都可以插入用户" ON profiles;
      CREATE POLICY "任何人都可以插入用户" ON profiles
        FOR INSERT WITH CHECK (true);
      
      DROP POLICY IF EXISTS "任何人都可以更新用户" ON profiles;
      CREATE POLICY "任何人都可以更新用户" ON profiles
        FOR UPDATE USING (true);
    `;

    const { error: profilesError } = await client.rpc('exec_sql', { sql: createProfilesSQL });
    
    if (profilesError) {
      console.log('❌ 创建profiles表失败:', profilesError.message);
      // 尝试直接执行SQL
      console.log('🔄 尝试直接执行SQL...');
      await executeSQLDirectly(createProfilesSQL);
    } else {
      console.log('✅ profiles表创建成功');
    }

    // 2. 检查post_likes表并创建外键关系
    console.log('\\n2. 检查post_likes表结构...');
    
    const checkLikesTableSQL = `
      -- 检查表是否存在，如果不存在则创建
      CREATE TABLE IF NOT EXISTS post_likes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        post_id UUID NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, post_id)
      );
      
      -- 创建外键约束
      ALTER TABLE post_likes ADD CONSTRAINT IF NOT EXISTS fk_post_likes_user 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
      ALTER TABLE post_likes ADD CONSTRAINT IF NOT EXISTS fk_post_likes_post 
        FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE;
      
      -- 创建索引
      CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
      CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
      
      -- 启用行级安全（宽松策略）
      ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
      
      -- 删除现有策略
      DROP POLICY IF EXISTS "任何人都可以查看点赞" ON post_likes;
      DROP POLICY IF EXISTS "任何人都可以插入点赞" ON post_likes;
      DROP POLICY IF EXISTS "任何人都可以删除点赞" ON post_likes;
      
      -- 创建新策略
      CREATE POLICY "任何人都可以查看点赞" ON post_likes
        FOR SELECT USING (true);
      
      CREATE POLICY "任何人都可以插入点赞" ON post_likes
        FOR INSERT WITH CHECK (true);
      
      CREATE POLICY "任何人都可以删除点赞" ON post_likes
        FOR DELETE USING (true);
    `;

    const { error: likesError } = await client.rpc('exec_sql', { sql: checkLikesTableSQL });
    
    if (likesError) {
      console.log('❌ 检查post_likes表失败:', likesError.message);
      await executeSQLDirectly(checkLikesTableSQL);
    } else {
      console.log('✅ post_likes表结构已更新');
    }

    // 3. 创建测试数据
    console.log('\\n3. 创建测试数据...');
    await createTestData();

    console.log('\\n🎉 数据库表结构设置完成！');

  } catch (error) {
    console.error('❌ 设置过程中出现错误:', error);
  }
}

async function executeSQLDirectly(sql) {
  try {
    // 尝试使用SQL编辑器执行
    console.log('  尝试直接执行SQL...');
    // 这里需要手动在Supabase控制台执行SQL
    console.log('⚠️ 请在Supabase控制台的SQL编辑器中执行以下SQL语句:');
    console.log('\\n' + sql + '\\n');
  } catch (error) {
    console.log('❌ 无法执行SQL:', error.message);
  }
}

async function createTestData() {
  try {
    // 创建测试用户
    console.log('  创建测试用户...');
    
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

    for (const user of testUsers) {
      const { error: insertError } = await client
        .from('profiles')
        .upsert(user, { onConflict: 'id' });
      
      if (insertError) {
        console.log(`  创建用户 ${user.username} 失败:`, insertError.message);
      } else {
        console.log(`  ✅ 用户 ${user.username} 创建成功`);
      }
    }

    // 测试点赞功能
    console.log('\\n  测试点赞功能...');
    await testLikes();

  } catch (error) {
    console.error('❌ 创建测试数据失败:', error);
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
      console.log('  ❌ 缺少用户或帖子数据');
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
      console.log('  ❌ 插入点赞失败:', insertError.message);
      return;
    }

    console.log('  ✅ 点赞插入成功');

    // 查询点赞数据
    const { data: likes } = await client
      .from('post_likes')
      .select(`
        *,
        profiles:user_id (username, nickname),
        community_posts:post_id (title, author)
      `);

    console.log('\\n  📊 点赞数据统计:');
    console.log(`  ✅ 点赞记录总数: ${likes?.length || 0}`);
    
    if (likes && likes.length > 0) {
      likes.forEach(like => {
        console.log(`    - 帖子: ${like.community_posts?.title}, 点赞用户: ${like.profiles?.username || like.profiles?.nickname || like.user_id}`);
      });
    }

  } catch (error) {
    console.error('❌ 测试点赞失败:', error);
  }
}

setupDatabaseTables();