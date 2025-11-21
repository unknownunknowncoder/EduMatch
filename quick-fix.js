// 快速修复学习计划显示问题
console.log('🔧 开始修复学习计划显示问题...');

// 1. 设置用户信息
const currentUser = {
  id: 'b6c871eb-717c-4a40-859b-b639cf8ccd08',
  username: 'admin',
  email: 'admin@edumatch.com',
  nickname: '管理员'
};

localStorage.setItem('currentUser', JSON.stringify(currentUser));
console.log('✅ 用户信息已设置:', currentUser);

// 2. 测试 Supabase 连接
import('https://cdn.skypack.dev/@supabase/supabase-js').then(({ createClient }) => {
  const supabase = createClient(
    'https://aonlahundnkxuyxfsmcy.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE'
  );

  // 3. 测试查询学习计划
  supabase
    .from('study_plans')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending: false })
    .then(({ data, error }) => {
      if (error) {
        console.error('❌ 查询失败:', error);
      } else {
        console.log('✅ 查询成功！找到', data.length, '个学习计划:');
        data.forEach((plan, index) => {
          console.log(`${index + 1}. ${plan.title} (${plan.status})`);
        });
        
        console.log('\n🎯 现在刷新学习计划页面应该可以看到所有计划了！');
        console.log('📋 访问: http://localhost:3006/study-plan');
      }
    });
}).catch(err => {
  console.error('❌ 导入 Supabase 失败:', err);
  console.log('\n💡 请手动执行以下命令:');
  console.log('localStorage.setItem("currentUser", JSON.stringify({');
  console.log('  id: "b6c871eb-717c-4a40-859b-b639cf8ccd08",');
  console.log('  username: "admin",');
  console.log('  email: "admin@edumatch.com",');
  console.log('  nickname: "管理员"');
  console.log('}));');
});

console.log('\n📝 执行完成！如果看不到效果，请:');  
console.log('1. 确保开发服务器在 http://localhost:3006 运行');
console.log('2. 访问学习计划页面: http://localhost:3006/study-plan');
console.log('3. 如果还是没有，刷新页面并重试');