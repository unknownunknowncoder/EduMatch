/**
 * 测试新的Bot ID配置
 */

import fetch from 'node-fetch';

async function testNewBotId() {
    console.log('🧪 测试新的Bot ID配置');
    
    const newBotId = '7573579561607331840';
    const token = 'sat_uvUYKEkkKh2rL1IfHmO8IkVGwmdyZBP5D7PoxYuw1PvpMFhjMGy5GQyRiz2lBrlH';
    
    console.log('🤖 新Bot ID:', newBotId);
    console.log('🔑 Token:', token.substring(0, 20) + '...');
    
    const requestBody = {
        conversation_id: "",
        bot_id: newBotId,
        user: 'test_user_' + Date.now(),
        query: '你好，请推荐一个前端开发学习资源',
        chat_history: [],
        stream: false
    };
    
    try {
        const response = await fetch('https://api.coze.cn/open_api/v2/chat', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log('\n📊 响应状态:', response.status);
        
        if (response.ok) {
            const responseText = await response.text();
            console.log('✅ API调用成功');
            console.log('📝 响应长度:', responseText.length);
            
            try {
                const data = JSON.parse(responseText);
                console.log('🎯 响应结构:', Object.keys(data));
                
                if (data.messages && data.messages.length > 0) {
                    const lastMessage = data.messages[data.messages.length - 1];
                    console.log('💬 AI回复预览:', lastMessage.content ? lastMessage.content.substring(0, 100) + '...' : '无内容');
                }
            } catch (parseError) {
                console.log('⚠️ 响应不是JSON格式');
                console.log('📝 原始响应:', responseText.substring(0, 200) + '...');
            }
        } else {
            const errorText = await response.text();
            console.log('❌ API调用失败:', response.status);
            console.log('📝 错误信息:', errorText);
        }
        
    } catch (error) {
        console.log('💥 网络错误:', error.message);
    }
}

testNewBotId();