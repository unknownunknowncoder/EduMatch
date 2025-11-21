import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE';
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  console.log('修复学习计划显示问题...');
  
  // 1. 确保用户数据完整
  const { data: users, error: userError } = await supabase.from('users').select('*');
  if (userError) {
    console.error('查询用户失败:', userError.message);
    return;
  }
  
  if (users.length === 0) {
    console.log('❌ 没有找到用户，无法修复');
    return;
  }
  
  const mainUser = users[0];
  console.log('主用户信息:', {
    id: mainUser.id,
    email: mainUser.email,
    nickname: mainUser.nickname
  });
  
  // 2. 如果用户邮箱为空，更新它
  if (!mainUser.email) {
    console.log('🔧 修复用户邮箱...');
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        email: 'admin@edumatch.com',
        nickname: '管理员'
      })
      .eq('id', mainUser.id);
    
    if (updateError) {
      console.error('更新用户失败:', updateError.message);
    } else {
      console.log('✅ 用户信息已更新');
    }
  }
  
  // 3. 确保所有学习计划都有正确的用户ID
  const { data: plans, error: planError } = await supabase.from('study_plans').select('*');
  if (planError) {
    console.error('查询学习计划失败:', planError.message);
    return;
  }
  
  console.log(`找到 ${plans.length} 个学习计划`);
  
  let fixedCount = 0;
  for (const plan of plans) {
    if (plan.user_id !== mainUser.id) {
      console.log(`🔧 修复学习计划 "${plan.title}" 的用户ID...`);
      const { error: fixError } = await supabase
        .from('study_plans')
        .update({ user_id: mainUser.id })
        .eq('id', plan.id);
      
      if (fixError) {
        console.error(`修复失败:`, fixError.message);
      } else {
        fixedCount++;
      }
    }
  }
  
  if (fixedCount > 0) {
    console.log(`✅ 修复了 ${fixedCount} 个学习计划`);
  } else {
    console.log('✅ 所有学习计划的用户ID都正确');
  }
  
  // 4. 生成用于localStorage的完整用户信息
  console.log('\n📋 请在前端控制台执行以下命令来设置当前用户:');
  console.log(`localStorage.setItem('currentUser', JSON.stringify({
  id: '${mainUser.id}',
  email: 'admin@edumatch.com',
  nickname: '管理员'
}));`);
  
  console.log('\n✅ 修复完成！现在应该可以看到学习计划了。');
})();