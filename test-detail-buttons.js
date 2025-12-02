// 测试查看详情按钮功能
console.log('开始测试查看详情按钮功能...');

// 测试函数
function testDetailButtons() {
    // 1. 检查 AdminDatabase 页面是否存在查看详情按钮
    console.log('1. 检查查看详情按钮...');
    
    // 等待页面加载完成
    setTimeout(() => {
        const detailButtons = document.querySelectorAll('[title="查看详情"]');
        console.log(`找到 ${detailButtons.length} 个查看详情按钮`);
        
        if (detailButtons.length > 0) {
            detailButtons.forEach((button, index) => {
                console.log(`按钮 ${index + 1}:`, button);
                // 检查是否有点击事件监听器
                const hasClickListener = button.onclick !== null;
                console.log(`按钮 ${index + 1} 有点击事件: ${hasClickListener}`);
                
                // 模拟点击（但不实际跳转，只测试事件是否触发）
                button.addEventListener('click', (e) => {
                    console.log(`按钮 ${index + 1} 被点击`);
                    e.preventDefault();
                    e.stopPropagation();
                });
            });
            
            console.log('✅ 查看详情按钮检查完成');
        } else {
            console.log('❌ 未找到查看详情按钮');
        }
        
        // 2. 检查数据加载情况
        console.log('2. 检查数据加载情况...');
        const tables = document.querySelectorAll('tbody tr');
        console.log(`表格中有 ${tables.length} 行数据`);
        
        if (tables.length > 0) {
            console.log('✅ 数据加载正常');
        } else {
            console.log('❌ 数据可能未加载');
        }
        
    }, 2000); // 等待2秒让页面完全加载
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    testDetailButtons();
}

// 导出测试函数供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { testDetailButtons };
}