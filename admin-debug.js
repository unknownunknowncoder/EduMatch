// 管理员页面调试脚本
// 在浏览器控制台中运行此脚本来测试按钮功能

console.log('🔧 开始调试管理员页面的查看详情按钮...');

// 1. 检查按钮是否存在
const postDetailButtons = document.querySelectorAll('button[title="查看详情"]');
console.log(`找到 ${postDetailButtons.length} 个查看详情按钮`);

// 2. 为每个按钮添加调试事件监听器
postDetailButtons.forEach((button, index) => {
    console.log(`按钮 ${index + 1}:`, button);
    
    // 检查按钮的父元素和行数据
    const row = button.closest('tr');
    if (row) {
        console.log(`按钮 ${index + 1} 所在行:`, row);
        
        // 尝试获取数据
        const cells = row.querySelectorAll('td');
        console.log(`按钮 ${index + 1} 行数据:`, Array.from(cells).map(cell => cell.textContent));
    }
    
    // 添加点击监听器用于调试
    button.addEventListener('click', function(e) {
        console.log(`🔍 按钮 ${index + 1} 被点击!`);
        console.log('事件对象:', e);
        console.log('按钮元素:', this);
        
        // 检查是否有 onclick 属性
        if (this.onclick) {
            console.log('按钮有 onclick 处理器');
        } else {
            console.log('❌ 按钮 没有 onclick 处理器');
        }
    });
});

// 3. 测试手动创建的按钮
const testButton = document.createElement('button');
testButton.textContent = '测试详情按钮';
testButton.style.cssText = 'background: red; color: white; padding: 10px; margin: 10px;';
testButton.onclick = function() {
    console.log('🧪 测试按钮被点击!');
    alert('测试按钮点击成功!');
};

// 将测试按钮添加到页面中
document.body.appendChild(testButton);

// 4. 检查 Vue 实例
console.log('检查 Vue 实例...');
if (window.Vue) {
    console.log('✅ Vue 已加载');
} else {
    console.log('❌ Vue 未找到');
}

// 5. 手动调用查看详情方法
console.log('测试手动调用查看详情方法...');

// 模拟调用
function testViewPostDetail(postId) {
    console.log('🧪 测试查看帖子详情:', postId);
    
    // 检查 window.open 是否可用
    if (typeof window.open === 'function') {
        const url = `/post/${postId}`;
        console.log('🚀 即将打开:', url);
        // window.open(url, '_blank');
        console.log('✅ window.open 调用成功');
    } else {
        console.log('❌ window.open 不可用');
    }
}

// 暴露测试函数到全局
window.testViewPostDetail = testViewPostDetail;
window.debugAdminButtons = function() {
    console.log('🔍 重新扫描按钮...');
    const buttons = document.querySelectorAll('button[title="查看详情"]');
    console.log(`当前找到 ${buttons.length} 个查看详情按钮`);
    return buttons;
};

console.log('🎯 调试脚本加载完成!');
console.log('💡 可以运行 testViewPostDetail("test-id") 来测试');
console.log('💡 可以运行 debugAdminButtons() 来重新扫描按钮');