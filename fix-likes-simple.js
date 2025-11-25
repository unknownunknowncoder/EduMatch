import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE';

const client = createClient(supabaseUrl, supabaseKey);

async function fixLikes() {
  try {
    console.log('🔧 修复点赞功能...');

    // 1. 检查点赞表是否存在并尝试直接查询
    console.log('\n1. 检查点赞表...');
    try {
      const { data: likes, error } = await client
        .from('post_likes')
        .select('*')
        .limit(1);

      if (error && error.code === 'PGRST116') {
        console.log('❌ post_likes 表不存在，需要创建');
      } else if (error) {
        console.log('❌ 查询点赞表失败:', error.message);
      } else {
        console.log('✅ post_likes 表存在');
      }
    } catch (error) {
      console.log('❌ 检查点赞表出错:', error.message);
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
    posts.forEach((post, index) => {
      console.log(`   ${index + 1}. "${post.title}" - 点赞数: ${post.likes_count || 0}`);
    });

    // 3. 为第一个帖子创建点赞测试数据
    if (posts.length > 0) {
      console.log('\n3. 创建点赞测试数据...');
      const testPost = posts[0];
      const testUserId = 'b6c871eb-717c-4a40-859b-b639cf8ccd08';

      // 检查是否已经点赞
      const { data: existingLike } = await client
        .from('post_likes')
        .select('*')
        .eq('post_id', testPost.id)
        .eq('user_id', testUserId)
        .maybeSingle();

      if (existingLike) {
        console.log('✅ 用户已点赞该帖子');
        
        // 测试取消点赞
        const { error: deleteError } = await client
          .from('post_likes')
          .delete()
          .eq('post_id', testPost.id)
          .eq('user_id', testUserId);

        if (deleteError) {
          console.error('❌ 取消点赞失败:', deleteError.message);
        } else {
          console.log('✅ 取消点赞成功');
        }
      } else {
        console.log('🔄 添加点赞...');
        const { error: insertError } = await client
          .from('post_likes')
          .insert([{
            post_id: testPost.id,
            user_id: testUserId
          }]);

        if (insertError) {
          console.error('❌ 添加点赞失败:', insertError.message);
        } else {
          console.log('✅ 添加点赞成功');
        }
      }

      // 4. 验证点赞数据
      console.log('\n4. 验证点赞数据...');
      const { data: postLikes, error: likesError } = await client
        .from('post_likes')
        .select(`
          *,
          post:community_posts(title, author),
          user:users(username, nickname)
        `)
        .eq('post_id', testPost.id);

      if (likesError) {
        console.error('❌ 查询点赞数据失败:', likesError.message);
      } else {
        console.log(`✅ 找到 ${postLikes.length} 条点赞记录`);
        postLikes.forEach((like, index) => {
          console.log(`   ${index + 1}. 用户: ${like.user?.nickname || like.user?.username || '匿名用户'} - 帖子: "${like.post?.title || '未知'}"`);
        });
      }

      // 5. 更新点赞计数
      console.log('\n5. 更新点赞计数...');
      const { data: likeCount } = await client
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', testPost.id);

      const { error: updateError } = await client
        .from('community_posts')
        .update({ likes_count: likeCount?.count || 0 })
        .eq('id', testPost.id);

      if (updateError) {
        console.error('❌ 更新点赞计数失败:', updateError.message);
      } else {
        console.log(`✅ 点赞计数更新为: ${likeCount?.count || 0}`);
      }
    }

    console.log('\n🎉 点赞功能修复完成！');

  } catch (error) {
    console.error('❌ 修复过程中出现错误:', error);
  }
}

fixLikes();