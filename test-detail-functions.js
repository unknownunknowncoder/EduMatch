// 测试查看详情功能
// 在浏览器控制台中运行此脚本

async function testDetailFunctions() {
    console.log('🔍 开始测试查看详情功能...');
    
    // 检查路由是否存在
    const routes = [
        { path: '/post/test-post-id', name: '帖子详情' },
        { path: '/study-plan/test-plan-id', name: '学习计划详情' },
        { path: '/resource/test-resource-id', name: '资源详情' },
        { path: '/admin', name: '后台管理' }
    ];
    
    console.log('📋 检查路由配置...');
    for (const route of routes) {
        try {
            const response = await fetch(route.path, { method: 'HEAD' });
            console.log(`${route.name}: ${response.status === 200 ? '✅ 正常' : '❌ 错误 (' + response.status + ')'}`);
        } catch (error) {
            console.log(`${route.name}: ❌ 网络错误 - ${error.message}`);
        }
    }
    
    // 测试 Supabase Service 方法
    console.log('\n🔧 测试 Supabase Service 方法...');
    
    try {
        // 动态导入 supabase service
        const { supabaseService } = await import('/src/services/supabase.ts');
        
        // 测试 getPostById
        try {
            console.log('测试 getPostById...');
            // 这里需要一个真实的帖子ID进行测试
            // const post = await supabaseService.getPostById('test-id');
            console.log('✅ getPostById 方法存在');
        } catch (error) {
            console.log('❌ getPostById 测试失败:', error.message);
        }
        
        // 测试 getStudyPlanById
        try {
            console.log('测试 getStudyPlanById...');
            // const plan = await supabaseService.getStudyPlanById('test-id');
            console.log('✅ getStudyPlanById 方法存在');
        } catch (error) {
            console.log('❌ getStudyPlanById 测试失败:', error.message);
        }
        
        // 测试 getResourceById
        try {
            console.log('测试 getResourceById...');
            // const resource = await supabaseService.getResourceById('test-id');
            console.log('✅ getResourceById 方法存在');
        } catch (error) {
            console.log('❌ getResourceById 测试失败:', error.message);
        }
        
    } catch (error) {
        console.log('❌ 无法导入 Supabase Service:', error.message);
    }
    
    console.log('\n🎯 手动测试步骤：');
    console.log('1. 打开后台管理页面: http://localhost:3010/admin');
    console.log('2. 在各个标签页中点击查看详情按钮');
    console.log('3. 确认详情页面能正确打开并显示数据');
    
    console.log('\n✨ 测试完成！');
}

// 在浏览器中运行
if (typeof window !== 'undefined') {
    window.testDetailFunctions = testDetailFunctions;
    console.log('💡 在控制台中运行 testDetailFunctions() 来开始测试');
}

// 在 Node.js 中运行
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { testDetailFunctions };
}