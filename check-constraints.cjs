const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkConstraints() {
  console.log('🔍 检查外键约束...');
  
  // 使用RPC调用检查约束
  try {
    const { data, error } = await supabase.rpc('get_table_constraints', {
      table_name: 'post_likes'
    });
    
    if (error) {
      console.log('❌ 检查约束失败:', error);
    } else {
      console.log('✅ 约束信息:', data);
    }
  } catch (e) {
    console.log('📝 使用SQL直接检查...');
    
    // 检查post_likes表结构
    const { data: tableInfo, error: tableError } = await supabase
      .from('post_likes')
      .select('*')
      .limit(0);
      
    if (tableError) {
      console.log('❌ 表结构查询错误:', tableError);
    }
  }
  
  // 尝试修复：先删除可能存在的点赞记录，再重新插入
  console.log('\n🔧 尝试修复点赞问题...');
  const userId = 'ca60d08a-cf0d-43f4-ba22-850ae656f64d';
  const postId = 'ab88c41d-4c94-44e2-8aea-c5aadc16efcb';
  
  // 1. 删除已存在的点赞记录
  const { data: deleted, error: deleteError } = await supabase
    .from('post_likes')
    .delete()
    .eq('user_id', userId)
    .eq('post_id', postId);
    
  if (deleteError) {
    console.log('❌ 删除失败:', deleteError);
  } else {
    console.log('✅ 删除结果:', deleted);
  }
  
  // 2. 重新插入
  const { data: inserted, error: insertError } = await supabase
    .from('post_likes')
    .insert({
      user_id: userId,
      post_id: postId
    })
    .select();
    
  if (insertError) {
    console.log('❌ 重新插入失败:', insertError);
  } else {
    console.log('✅ 重新插入成功:', inserted);
  }
}

checkConstraints().catch(console.error);