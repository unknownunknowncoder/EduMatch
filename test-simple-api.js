// 简单的扣子API测试
import fetch from 'node-fetch';

async function testSimpleAPI() {
    const token = 'sat_uvUYKEkkKh2rL1IfHmO8IkVGwmdyZBP5D7PoxYuw1PvpMFhjMGy5GQyRiz2lBrlH';
    const botId = '7573579561607331840';
    
    console.log('🧪 测试扣子API');
    console.log('Token:', token.substring(0, 20) + '...');
    console.log('Bot ID:', botId);
    
    // 尝试最简单的API调用
    const requestBody = {
        bot_id: botId,
        user_id: 'test_user_' + Date.now(),
        stream: false,
        additional_messages: [
            {
                content: '你好，请推荐一个Python编程学习资源',
                content_type: "text",
                role: "user"
            }
        ]
    };
    
    console.log('\n📡 请求体:', JSON.stringify(requestBody, null, 2));
    
    try {
        const response = await fetch('https://api.coze.cn/v3/chat', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log('\n📊 响应状态:', response.status);
        console.log('响应头:', response.headers.raw());
        
        const responseText = await response.text();
        console.log('\n📝 响应内容:', responseText);
        
        if (response.ok) {
            try {
                const data = JSON.parse(responseText);
                console.log('\n✅ 解析后的响应:', JSON.stringify(data, null, 2));
            } catch (parseError) {
                console.log('\n⚠️ 响应不是有效的JSON格式');
            }
        } else {
            console.log('\n❌ API调用失败');
        }
        
    } catch (error) {
        console.log('\n💥 网络错误:', error.message);
    }
}

testSimpleAPI();