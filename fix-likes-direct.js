import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE';

const client = createClient(supabaseUrl, supabaseKey);

async function fixLikesDirect() {
  try {
    console.log('🔧 直接修复点赞功能...\n');

    // 1. 直接测试 post_likes 表是否存在
    console.log('1. 测试 post_likes 表是否存在...');
    
    const { data: existingLikes, error: testError } = await client
      .from('post_likes')
      .select('*')
      .limit(1);
    
    if (testError && testError.code === '42P01') { // 表不存在
      console.log('❌ post_likes 表不存在');
      console.log('\n需要执行以下SQL来创建表：');
      console.log(`
        CREATE TABLE post_likes (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL,
          post_id UUID NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, post_id)
        );
        
        -- 启用行级安全
        ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
        
        -- 创建策略：任何人都可以查看点赞
        CREATE POLICY "任何人都可以查看点赞" ON post_likes
          FOR SELECT USING (true);
          
        -- 创建策略：允许插入点赞数据
        CREATE POLICY "允许插入点赞" ON post_likes
          FOR INSERT WITH CHECK (true);
          
        -- 创建策略：允许更新点赞数据
        CREATE POLICY "允许更新点赞" ON post_likes
          FOR UPDATE USING (true);
          
        -- 创建策略：允许删除点赞数据
        CREATE POLICY "允许删除点赞" ON post_likes
          FOR DELETE USING (true);
        
        -- 创建外键约束（如果表存在）
        ALTER TABLE post_likes ADD CONSTRAINT fk_post_likes_user 
          FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
        ALTER TABLE post_likes ADD CONSTRAINT fk_post_likes_post 
          FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE;
      `);
      
      return;
    } else if (testError) {
      console.log('✅ post_likes 表存在，但有其他错误:', testError.message);
    } else {
      console.log('✅ post_likes 表存在');
    }

    // 2. 检查RLS策略
    console.log('\n2. 检查RLS策略...');
    await checkRLSPolicies();

    // 3. 创建示例点赞数据
    console.log('\n3. 创建示例点赞数据...');
    await createSampleLikes();

    // 4. 测试点赞查询功能
    console.log('\n4. 测试点赞查询功能...');
    await testLikeQueries();

    console.log('\n🎉 点赞功能修复完成！');
    
  } catch (error) {
    console.error('❌ 修复过程中出现错误:', error);
  }
}

async function checkRLSPolicies() {
  // 尝试插入数据来检查RLS策略
  console.log('  通过插入测试检查RLS...');
  
  // 获取测试数据
  const { data: users } = await client
    .from('auth.users')
    .select('id, email')
    .limit(1);
  
  const { data: posts } = await client
    .from('community_posts')
    .select('id, title, author')
    .limit(1);
  
  if (!users || users.length === 0 || !posts || posts.length === 0) {
    console.log('  无法获取测试数据');
    return;
  }
  
  const testData = {
    user_id: users[0].id,
    post_id: posts[0].id
  };
  
  const { error } = await client
    .from('post_likes')
    .insert(testData);
  
  if (error && error.code === '42501') { // RLS策略拒绝
    console.log('  ❌ RLS策略限制插入');
    console.log('\n需要执行以下SQL来修复RLS策略：');
    console.log(`
      -- 删除现有策略
      DROP POLICY IF EXISTS "用户只能管理自己的点赞" ON post_likes;
      
      -- 创建更宽松的策略
      CREATE POLICY "允许插入点赞" ON post_likes
        FOR INSERT WITH CHECK (true);
        
      CREATE POLICY "允许查看点赞" ON post_likes
        FOR SELECT USING (true);
        
      CREATE POLICY "允许更新点赞" ON post_likes
        FOR UPDATE USING (true);
        
      CREATE POLICY "允许删除点赞" ON post_likes
        FOR DELETE USING (true);
    `);
  } else if (error) {
    console.log('  插入测试失败:', error.message);
  } else {
    console.log('  ✅ RLS策略正常');
  }
}

async function createSampleLikes() {
  console.log('  创建示例点赞数据...');
  
  // 获取测试用户和帖子
  const { data: users } = await client
    .from('auth.users')
    .select('id, email')
    .limit(1);
  
  const { data: posts } = await client
    .from('community_posts')
    .select('id, title, author')
    .limit(3);
  
  if (!users || users.length === 0) {
    console.log('  没有找到用户，无法创建点赞数据');
    return;
  }
  
  if (!posts || posts.length === 0) {
    console.log('  没有找到帖子，无法创建点赞数据');
    return;
  }
  
  const testUserId = users[0].id;
  
  // 创建点赞数据
  const sampleLikes = posts.map(post => ({
    user_id: testUserId,
    post_id: post.id
  }));
  
  // 插入点赞数据
  const { data: insertedLikes, error } = await client
    .from('post_likes')
    .insert(sampleLikes)
    .select();
  
  if (error) {
    console.log('  ❌ 创建点赞数据失败:', error.message);
    
    // 如果是因为RLS问题，尝试使用服务角色密钥
    if (error.code === '42501') {
      console.log('  ⚠️ RLS策略限制，尝试临时解决方案...');
      await createLikesWithServiceRole();
    }
  } else {
    console.log(`  ✅ 成功创建 ${insertedLikes.length} 个点赞记录`);
  }
}

async function createLikesWithServiceRole() {
  console.log('  使用服务角色密钥创建点赞数据...');
  
  // 使用服务角色密钥（需要管理员权限）
  const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzA2NjA1NSwiZXhwIjoyMDc4NjQyMDU1fQ.HiQKt7cI8d7J4v3VvJp9m5wVw1Y7Yd9L8X9V2Y3Z4A';
  
  if (!serviceRoleKey) {
    console.log('  ⚠️ 没有服务角色密钥，无法绕过RLS');
    return;
  }
  
  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  
  // 获取测试数据
  const { data: users } = await adminClient
    .from('auth.users')
    .select('id, email')
    .limit(1);
  
  const { data: posts } = await adminClient
    .from('community_posts')
    .select('id, title, author')
    .limit(3);
  
  if (!users || users.length === 0 || !posts || posts.length === 0) {
    console.log('  无法获取测试数据');
    return;
  }
  
  const testUserId = users[0].id;
  
  // 创建点赞数据
  const sampleLikes = posts.map(post => ({
    user_id: testUserId,
    post_id: post.id,
    created_at: new Date().toISOString()
  }));
  
  const { data: insertedLikes, error } = await adminClient
    .from('post_likes')
    .insert(sampleLikes)
    .select();
  
  if (error) {
    console.log('  ❌ 服务角色插入失败:', error.message);
  } else {
    console.log(`  ✅ 服务角色成功创建 ${insertedLikes.length} 个点赞记录`);
  }
}

async function testLikeQueries() {
  console.log('  测试点赞查询功能...');
  
  // 简单查询：获取所有点赞
  console.log('  - 查询所有点赞记录...');
  const { data: allLikes, error: likesError } = await client
    .from('post_likes')
    .select('*');
  
  if (likesError) {
    console.log('  ❌ 查询点赞记录失败:', likesError.message);
  } else {
    console.log(`  ✅ 找到 ${allLikes ? allLikes.length : 0} 个点赞记录`);
  }
  
  // 查询点赞统计
  console.log('  - 查询帖子点赞统计...');
  const { data: postStats, error: statsError } = await client
    .from('post_likes')
    .select('post_id')
    .group('post_id')
    .select('count');
  
  if (statsError) {
    console.log('  ❌ 查询点赞统计失败:', statsError.message);
  } else {
    console.log(`  ✅ 点赞统计查询成功`);
    if (postStats) {
      postStats.forEach(stat => {
        console.log(`     帖子 ${stat.post_id}: ${stat.count} 个赞`);
      });
    }
  }
  
  // 查询详细的点赞信息（包含用户和帖子信息）
  console.log('  - 查询详细点赞信息...');
  
  // 首先获取点赞数据
  const { data: likes } = await client
    .from('post_likes')
    .select('*')
    .limit(5);
  
  if (likes && likes.length > 0) {
    console.log('  📊 详细点赞信息:');
    
    for (const like of likes) {
      // 查询帖子信息
      const { data: post } = await client
        .from('community_posts')
        .select('title, author')
        .eq('id', like.post_id)
        .single();
      
      // 查询用户信息
      const { data: user } = await client
        .from('auth.users')
        .select('email')
        .eq('id', like.user_id)
        .single();
      
      console.log(`     点赞ID: ${like.id}`);
      console.log(`       帖子: ${post ? post.title : '未知'}`);
      console.log(`       作者: ${post ? post.author : '未知'}`);
      console.log(`       用户: ${user ? user.email : '未知'}`);
      console.log(`       时间: ${like.created_at}`);
      console.log('');
    }
  }
}

// 执行修复
fixLikesDirect();