import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE';

const client = createClient(supabaseUrl, supabaseKey);

async function checkLikesStructure() {
  try {
    console.log('🔍 检查点赞表结构...');

    // 1. 检查点赞表是否存在
    const { data: tables, error: tablesError } = await client
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'post_likes');

    if (tablesError) {
      console.error('❌ 检查表失败:', tablesError);
      return;
    }

    if (tables.length === 0) {
      console.log('❌ post_likes 表不存在');
      return;
    }

    console.log('✅ post_likes 表存在');

    // 2. 检查表结构
    const { data: columns, error: columnsError } = await client
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', 'post_likes');

    if (columnsError) {
      console.error('❌ 检查表结构失败:', columnsError);
      return;
    }

    console.log('\n📊 post_likes 表结构:');
    columns.forEach(col => {
      console.log(`   ${col.column_name} (${col.data_type}) - ${col.is_nullable === 'YES' ? '可空' : '非空'}`);
    });

    // 3. 检查外键关系
    const { data: constraints, error: constraintsError } = await client
      .from('information_schema.table_constraints')
      .select('constraint_name, constraint_type')
      .eq('table_schema', 'public')
      .eq('table_name', 'post_likes');

    if (constraintsError) {
      console.error('❌ 检查约束失败:', constraintsError);
      return;
    }

    console.log('\n🔗 表约束:');
    constraints.forEach(constraint => {
      console.log(`   ${constraint.constraint_name}: ${constraint.constraint_type}`);
    });

    // 4. 检查现有数据
    const { data: likes, error: likesError } = await client
      .from('post_likes')
      .select('*')
      .limit(5);

    if (likesError) {
      console.error('❌ 获取点赞数据失败:', likesError);
      return;
    }

    console.log(`\n📝 现有点赞数据: ${likes.length} 条`);
    likes.forEach((like, index) => {
      console.log(`   ${index + 1}. post_id: ${like.post_id}, user_id: ${like.user_id}`);
    });

    // 5. 检查社区帖子表是否有点赞数字段
    const { data: postColumns, error: postColumnsError } = await client
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'community_posts');

    if (postColumnsError) {
      console.error('❌ 检查社区帖子表结构失败:', postColumnsError);
      return;
    }

    const hasLikesCount = postColumns.some(col => col.column_name === 'likes_count');
    console.log(`\n💡 社区帖子表是否有likes_count字段: ${hasLikesCount ? '✅ 有' : '❌ 无'}`);

  } catch (error) {
    console.error('❌ 操作失败:', error);
  }
}

checkLikesStructure();