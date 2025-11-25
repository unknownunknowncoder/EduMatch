// 测试扣子API
async function testCozeAPI() {
    try {
        console.log('开始测试扣子API...');
        
        const response = await fetch('http://localhost:3014/api/coze/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: 'Python编程',
                bot_id: '7573579561607331840',
                user_id: 'test_user_' + Date.now()
            })
        });
        
        console.log('响应状态:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('API调用成功:');
            console.log('完整响应:', JSON.stringify(result, null, 2));
            
            if (result.success && result.data) {
                console.log('扣子返回的数据:', result.data);
            }
        } else {
            const errorText = await response.text();
            console.log('API调用失败:');
            console.log('状态:', response.status);
            console.log('错误信息:', errorText);
        }
    } catch (error) {
        console.log('请求异常:', error.message);
    }
}

// 运行测试
testCozeAPI();