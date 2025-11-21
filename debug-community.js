import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE';

const client = createClient(supabaseUrl, supabaseKey);

async function testCommunityPosts() {
  try {
    console.log('🔍 测试 community_posts 表连接...');
    
    // 测试基本查询
    const { data: posts, error: postsError } = await client
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (postsError) {
      console.error('❌ 查询失败:', postsError);
      console.error('错误详情:', JSON.stringify(postsError, null, 2));
      return;
    }
    
    console.log('✅ 查询成功!');
    console.log('📊 帖子数量:', posts?.length || 0);
    
    if (posts && posts.length > 0) {
      console.log('📝 帖子详情:');
      posts.forEach((post, index) => {
        console.log(`\n${index + 1}. 标题: ${post.title}`);
        console.log(`   作者: ${post.author}`);
        console.log(`   分类: ${post.category}`);
        console.log(`   内容: ${post.content?.substring(0, 50)}...`);
        console.log(`   标签: ${JSON.stringify(post.tags)}`);
        console.log(`   点赞数: ${post.likes_count}`);
        console.log(`   创建时间: ${post.created_at}`);
        console.log(`   用户ID: ${post.user_id}`);
      });
    }
    
    // 测试标签查询
    console.log('\n🏷️ 测试标签查询...');
    const { data: tagsData, error: tagsError } = await client
      .from('community_posts')
      .select('tags');
    
    if (tagsError) {
      console.error('❌ 标签查询失败:', tagsError);
    } else {
      const allTags = [];
      tagsData?.forEach(post => {
        if (post.tags && Array.isArray(post.tags)) {
          allTags.push(...post.tags);
        }
      });
      const uniqueTags = [...new Set(allTags)];
      console.log('📋 所有标签:', uniqueTags);
    }
    
  } catch (error) {
    console.error('❌ 操作失败:', error);
    console.error('错误详情:', error.stack);
  }
}

testCommunityPosts();