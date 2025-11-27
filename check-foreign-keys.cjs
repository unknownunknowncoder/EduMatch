const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// 使用 anon key 进行查询
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkForeignKeys() {
  console.log('🔍 检查当前外键约束状态...');
  
  try {
    // 检查外键约束 - 使用PostgreSQL系统表
    const { data, error } = await supabase
      .from('information_schema.table_constraints')
      .select(`
        table_name,
        constraint_name,
        constraint_type
      `)
      .eq('constraint_type', 'FOREIGN KEY')
      .in('table_name', ['post_likes', 'post_favorites']);

    if (error) {
      console.error('❌ 查询外键约束失败:', error);
      return;
    }

    console.log('📋 当前外键约束状态:');
    console.log(data);

    // 检查用户表
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, username')
      .limit(3);

    if (userError) {
      console.error('❌ 查询用户表失败:', userError);
    } else {
      console.log('👤 用户表样例数据:');
      console.log(users);
    }

    // 检查点赞表
    const { data: likes, error: likesError } = await supabase
      .from('post_likes')
      .select('*')
      .limit(3);

    if (likesError) {
      console.error('❌ 查询点赞表失败:', likesError);
    } else {
      console.log('❤️ 点赞表样例数据:');
      console.log(likes);
    }

    // 检查收藏表
    const { data: favorites, error: favoritesError } = await supabase
      .from('post_favorites')
      .select('*')
      .limit(3);

    if (favoritesError) {
      console.error('❌ 查询收藏表失败:', favoritesError);
    } else {
      console.log('⭐ 收藏表样例数据:');
      console.log(favorites);
    }

  } catch (error) {
    console.error('❌ 检查过程中出现错误:', error);
  }
}

checkForeignKeys();