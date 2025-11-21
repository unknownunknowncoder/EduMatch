// 在浏览器控制台中执行这个脚本来设置测试用户登录状态
console.log('Setting test user login...');

// 设置测试用户
localStorage.setItem('currentUser', JSON.stringify({
    id: 'b6c871eb-717c-4a40-859b-b639cf8ccd08', 
    username: 'admin',
    nickname: 'admin'
}));

console.log('Test user set! Please refresh the page.');
console.log('Current user:', JSON.parse(localStorage.getItem('currentUser')));

// 检查学习计划列表
console.log('Current study plans:', document.querySelector('[class*="space-y-4"]'));