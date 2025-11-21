import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE';
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  console.log('检查用户和学习计划关联...');
  
  // 检查所有用户
  const { data: users, error: userError } = await supabase.from('users').select('*');
  if (userError) {
    console.error('用户查询失败:', userError.message);
    return;
  }
  
  console.log(`找到 ${users.length} 个用户:`);
  
  // 检查每个用户的学习计划
  for (const user of users) {
    const { data: plans, error: planError } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', user.id);
    
    if (planError) {
      console.error(`用户 ${user.email} 的计划查询失败:`, planError.message);
    } else {
      console.log(`${user.email} (${user.nickname || '无昵称'}) 有 ${plans.length} 个学习计划:`);
      plans.forEach((plan, i) => {
        console.log(`  ${i+1}. ${plan.title} (${plan.status})`);
      });
    }
  }
})();