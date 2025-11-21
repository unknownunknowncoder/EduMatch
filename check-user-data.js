import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE';
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  console.log('检查用户数据...');
  
  // 检查用户表的完整数据
  const { data: users, error: userError } = await supabase.from('users').select('*');
  if (userError) {
    console.error('用户查询失败:', userError.message);
    return;
  }
  
  console.log('用户详情:');
  users.forEach((user, index) => {
    console.log(`用户 ${index + 1}:`);
    console.log(`  ID: ${user.id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Nickname: ${user.nickname}`);
    console.log(`  Created: ${user.created_at}`);
    console.log(`  ---`);
  });
  
  // 获取学习计划表的所有数据
  const { data: plans, error: planError } = await supabase.from('study_plans').select('*').limit(3);
  if (planError) {
    console.error('学习计划查询失败:', planError.message);
    return;
  }
  
  console.log('\n学习计划样例:');
  plans.forEach((plan, index) => {
    console.log(`计划 ${index + 1}:`);
    console.log(`  ID: ${plan.id}`);
    console.log(`  User ID: ${plan.user_id}`);
    console.log(`  Title: ${plan.title}`);
    console.log(`  Status: ${plan.status}`);
    console.log(`  ---`);
  });
})();