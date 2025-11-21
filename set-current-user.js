// 设置当前用户的脚本
// 在浏览器控制台中执行此命令

console.log('🔧 设置当前用户信息...');

const currentUser = {
  id: 'b6c871eb-717c-4a40-859b-b639cf8ccd08',
  username: 'admin',
  email: 'admin@edumatch.com', // 前端兼容用
  nickname: '管理员',
  avatar_url: null
};

localStorage.setItem('currentUser', JSON.stringify(currentUser));

console.log('✅ 用户信息已设置:', currentUser);
console.log('🔄 现在请刷新学习计划页面...');

// 验证设置
const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
console.log('📋 存储的用户信息:', storedUser);