import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE';

const client = createClient(supabaseUrl, supabaseKey);

async function checkCommunityPosts() {
  try {
    console.log('🔍 检查 community_posts 表...');
    
    // 检查帖子数据
    const { data: posts, error: postsError } = await client
      .from('community_posts')
      .select('*')
      .limit(10);
    
    if (postsError) {
      console.error('❌ 获取帖子失败:', postsError);
      return;
    }
    
    console.log('📝 当前帖子数量:', posts.length);
    
    if (posts.length > 0) {
      console.log('📊 帖子列表:');
      posts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title} - ${post.author}`);
      });
    } else {
      console.log('🔄 创建示例数据...');
      const samplePosts = [
        {
          title: 'Vue 3 Composition API 学习心得',
          content: '最近学习了 Vue 3 的 Composition API，感觉比 Options API 更加灵活和强大。特别是 setup() 函数和 ref、reactive 这些响应式 API，让代码组织更加清晰。',
          category: '前端开发',
          tags: ['Vue3', 'Composition API', '前端'],
          author: 'Vue学习者',
          likes_count: 5,
          views_count: 120,
          comments_count: 2,
          user_id: 'b6c871eb-717c-4a40-859b-b639cf8ccd08'
        },
        {
          title: 'JavaScript 异步编程进阶',
          content: '从回调函数到 Promise，再到 async/await，JavaScript 的异步编程一直在进化。今天深入学习了事件循环机制，对微任务和宏任务有了更深的理解。',
          category: '前端开发',
          tags: ['JavaScript', '异步编程', 'Promise'],
          author: 'JS进阶者',
          likes_count: 8,
          views_count: 200,
          comments_count: 3,
          user_id: 'b6c871eb-717c-4a40-859b-b639cf8ccd08'
        },
        {
          title: 'Tailwind CSS 实战经验分享',
          content: '使用 Tailwind CSS 已经有一段时间了，从最初的抗拒到现在的不离不弃。它的 utility-first 理念确实提高了开发效率，特别是在组件化开发中。',
          category: '前端开发',
          tags: ['CSS', 'Tailwind', '样式框架'],
          author: 'CSS爱好者',
          likes_count: 3,
          views_count: 85,
          comments_count: 1,
          user_id: 'b6c871eb-717c-4a40-859b-b639cf8ccd08'
        }
      ];
      
      const { data: insertedData, error: insertError } = await client
        .from('community_posts')
        .insert(samplePosts)
        .select();
      
      if (insertError) {
        console.error('❌ 创建示例数据失败:', insertError);
      } else {
        console.log('✅ 示例数据创建成功!');
        console.log('📝 创建了', insertedData.length, '条帖子');
      }
    }
    
  } catch (error) {
    console.error('❌ 操作失败:', error);
  }
}

checkCommunityPosts();