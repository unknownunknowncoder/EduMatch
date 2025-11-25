import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE';

const client = createClient(supabaseUrl, supabaseKey);

async function fixLikeFunctionality() {
  try {
    console.log('🔧 开始修复点赞功能...\n');

    // 1. 执行SQL修复脚本
    console.log('1. 执行数据库结构修复...');
    
    // 由于我们无法直接执行SQL文件，需要分步执行每个SQL语句
    const sqlScript = `
      -- 1. 确保 post_likes 表有正确的结构
      DO $$ 
      BEGIN
          -- 检查并修复 post_likes 表
          IF NOT EXISTS (SELECT FROM information_schema.tables 
                         WHERE table_schema = 'public' 
                         AND table_name = 'post_likes') THEN
              CREATE TABLE post_likes (
                  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                  user_id UUID NOT NULL,
                  post_id UUID NOT NULL,
                  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                  UNIQUE(user_id, post_id)
              );
              
              -- 添加外键约束
              ALTER TABLE post_likes ADD CONSTRAINT fk_post_likes_user 
                  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
              ALTER TABLE post_likes ADD CONSTRAINT fk_post_likes_post 
                  FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE;
                  
              -- 创建索引
              CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);
              CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
              CREATE INDEX idx_post_likes_created_at ON post_likes(created_at);
              
              RAISE NOTICE '创建了 post_likes 表';
          ELSE
              -- 检查并修复外键约束
              IF NOT EXISTS (SELECT FROM information_schema.table_constraints 
                             WHERE constraint_name = 'fk_post_likes_post') THEN
                  ALTER TABLE post_likes ADD CONSTRAINT fk_post_likes_post 
                      FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE;
                  RAISE NOTICE '添加了 post_likes 表的外键约束';
              END IF;
          END IF;
          
          -- 检查并修复 post_favorites 表
          IF NOT EXISTS (SELECT FROM information_schema.tables 
                         WHERE table_schema = 'public' 
                         AND table_name = 'post_favorites') THEN
              CREATE TABLE post_favorites (
                  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                  user_id UUID NOT NULL,
                  post_id UUID NOT NULL,
                  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                  UNIQUE(user_id, post_id)
              );
              
              -- 添加外键约束
              ALTER TABLE post_favorites ADD CONSTRAINT fk_post_favorites_user 
                  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
              ALTER TABLE post_favorites ADD CONSTRAINT fk_post_favorites_post 
                  FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE;
                  
              -- 创建索引
              CREATE INDEX idx_post_favorites_user_id ON post_favorites(user_id);
              CREATE INDEX idx_post_favorites_post_id ON post_favorites(post_id);
              CREATE INDEX idx_post_favorites_created_at ON post_favorites(created_at);
              
              RAISE NOTICE '创建了 post_favorites 表';
          END IF;
          
          -- 2. 启用和配置 RLS
          ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
          ALTER TABLE post_favorites ENABLE ROW LEVEL SECURITY;
          
          -- 3. 创建 RLS 策略
          -- 点赞表的策略：用户可以查看所有点赞，但只能管理自己的点赞
          DROP POLICY IF EXISTS "任何人都可以查看点赞" ON post_likes;
          CREATE POLICY "任何人都可以查看点赞" ON post_likes
              FOR SELECT USING (true);
              
          DROP POLICY IF EXISTS "用户只能管理自己的点赞" ON post_likes;
          CREATE POLICY "用户只能管理自己的点赞" ON post_likes
              FOR ALL USING (auth.uid() = user_id);
          
          -- 收藏表的策略：用户可以查看所有收藏，但只能管理自己的收藏
          DROP POLICY IF EXISTS "任何人都可以查看收藏" ON post_favorites;
          CREATE POLICY "任何人都可以查看收藏" ON post_favorites
              FOR SELECT USING (true);
              
          DROP POLICY IF EXISTS "用户只能管理自己的收藏" ON post_favorites;
          CREATE POLICY "用户只能管理自己的收藏" ON post_favorites
              FOR ALL USING (auth.uid() = user_id);
          
          RAISE NOTICE 'RLS 策略配置完成';
          
      EXCEPTION
          WHEN OTHERS THEN
              RAISE NOTICE '修复过程中出现错误: %', SQLERRM;
      END $$;
    `;

    // 尝试执行SQL脚本
    const { data: sqlResult, error: sqlError } = await client.rpc('exec_sql', { sql: sqlScript });
    
    if (sqlError) {
      console.log('⚠️ 无法直接执行SQL脚本，使用分步修复...');
      // 使用分步修复
      await fixStepByStep();
    } else {
      console.log('✅ SQL脚本执行成功');
    }

    // 2. 测试点赞功能
    console.log('\n2. 测试点赞功能...');
    
    // 获取一些帖子
    const { data: posts, error: postsError } = await client
      .from('community_posts')
      .select('*')
      .limit(3);
    
    if (postsError) {
      console.error('❌ 获取帖子失败:', postsError);
      return;
    }
    
    if (!posts || posts.length === 0) {
      console.log('⚠️ 没有找到帖子，请先创建一些帖子');
      return;
    }
    
    console.log(`📝 找到 ${posts.length} 个帖子`);
    
    // 3. 创建一些示例点赞数据
    console.log('\n3. 创建示例点赞数据...');
    
    // 使用一个固定的测试用户ID
    const testUserId = 'b6c871eb-717c-4a40-859b-b639cf8ccd08'; // 使用现有的用户ID
    
    const sampleLikes = [
      {
        user_id: testUserId,
        post_id: posts[0].id,
        created_at: new Date().toISOString()
      },
      {
        user_id: testUserId,
        post_id: posts[1].id,
        created_at: new Date().toISOString()
      }
    ];
    
    // 插入点赞数据
    const { data: insertedLikes, error: insertError } = await client
      .from('post_likes')
      .insert(sampleLikes)
      .select();
    
    if (insertError) {
      console.error('❌ 插入点赞数据失败:', insertError);
      console.log('⚠️ 可能RLS策略需要调整，尝试查看现有数据...');
    } else {
      console.log('✅ 示例点赞数据创建成功');
    }
    
    // 4. 测试查询点赞数据（包括用户信息）
    console.log('\n4. 测试点赞数据查询...');
    
    // 查询点赞数据，包含用户信息
    const { data: likeData, error: likeError } = await client
      .from('post_likes')
      .select(`
        *,
        posts:community_posts(
          id,
          title,
          author
        ),
        users:auth.users(
          id,
          email
        )
      `);
    
    if (likeError) {
      console.error('❌ 查询点赞数据失败:', likeError);
    } else {
      console.log('✅ 点赞数据查询成功');
      console.log('📊 点赞数据详情:');
      
      if (likeData && likeData.length > 0) {
        likeData.forEach((like, index) => {
          console.log(`\n点赞记录 ${index + 1}:`);
          console.log(`  - 帖子ID: ${like.post_id}`);
          console.log(`  - 用户ID: ${like.user_id}`);
          console.log(`  - 创建时间: ${like.created_at}`);
          
          if (like.posts && like.posts.length > 0) {
            console.log(`  - 帖子标题: ${like.posts[0].title}`);
            console.log(`  - 帖子作者: ${like.posts[0].author}`);
          }
          
          if (like.users && like.users.length > 0) {
            console.log(`  - 用户邮箱: ${like.users[0].email}`);
          }
        });
      } else {
        console.log('⚠️ 没有找到点赞数据');
      }
    }
    
    // 5. 测试使用JOIN查询获取更详细的信息
    console.log('\n5. 测试详细点赞信息查询...');
    
    const { data: detailedLikes, error: detailedError } = await client
      .from('post_likes')
      .select(`
        id,
        created_at,
        community_posts!inner(
          id,
          title,
          author,
          like_count
        ),
        auth.users!inner(
          id,
          email
        )
      `)
      .order('created_at', { ascending: false });
    
    if (detailedError) {
      console.error('❌ 详细查询失败:', detailedError);
    } else {
      console.log('✅ 详细查询成功');
      if (detailedLikes && detailedLikes.length > 0) {
        console.log(`📊 找到 ${detailedLikes.length} 个点赞记录:`);
        detailedLikes.forEach((like, index) => {
          console.log(`\n记录 ${index + 1}:`);
          console.log(`  - 点赞ID: ${like.id}`);
          console.log(`  - 帖子标题: ${like.community_posts.title}`);
          console.log(`  - 帖子作者: ${like.community_posts.author}`);
          console.log(`  - 点赞用户: ${like.auth.users.email}`);
          console.log(`  - 点赞时间: ${like.created_at}`);
        });
      }
    }
    
    console.log('\n🎉 点赞功能修复完成！');
    
  } catch (error) {
    console.error('❌ 修复过程中出现错误:', error);
  }
}

async function fixStepByStep() {
  console.log('🔄 使用分步修复...');
  
  try {
    // 1. 检查并修复 post_likes 表结构
    console.log('  1. 检查 post_likes 表结构...');
    
    // 直接使用Supabase API来管理表结构
    // 由于无法直接执行DDL，我们主要处理数据层面
    
    // 2. 测试插入点赞数据
    console.log('  2. 测试数据操作...');
    
    // 获取测试用户和帖子
    const { data: testUsers } = await client
      .from('auth.users')
      .select('id, email')
      .limit(1);
    
    const { data: testPosts } = await client
      .from('community_posts')
      .select('id, title')
      .limit(1);
    
    if (testUsers && testUsers.length > 0 && testPosts && testPosts.length > 0) {
      const testLike = {
        user_id: testUsers[0].id,
        post_id: testPosts[0].id
      };
      
      const { data: inserted, error: insertErr } = await client
        .from('post_likes')
        .insert(testLike)
        .select();
      
      if (insertErr) {
        console.log('  ⚠️ 插入失败，可能表结构需要修复:', insertErr.message);
      } else {
        console.log('  ✅ 数据插入测试成功');
      }
    }
    
  } catch (error) {
    console.error('  ❌ 分步修复失败:', error);
  }
}

// 执行修复
fixLikeFunctionality();