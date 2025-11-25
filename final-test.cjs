// 最终测试扣子API - CommonJS格式
const { default: fetch } = require('node-fetch');

async function finalTest() {
    const token = 'pat_v7ZUGQxfsN0oiwf3B2mn4WDZxM9r3wDlSR5oJ8NCI2VAUcb1IkaqpTwODmFtlpaz';
    const botId = '7573579561607331840';
    
    console.log('🎯 最终测试扣子API...');
    console.log('Token:', token.substring(0, 20) + '...');
    console.log('Bot ID:', botId);
    
    try {
        const response = await fetch('https://api.coze.cn/open_api/v2/chat', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                conversation_id: "",
                bot_id: botId,
                user: "test_user_" + Date.now(),
                query: "请推荐Python编程相关的学习资源，包括B站视频和中国大学MOOC课程。请以JSON格式返回结果。",
                chat_history: [],
                stream: false
            })
        });
        
        console.log('\n📡 API响应状态:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('\n✅ 扣子API调用成功！');
            console.log('\n📊 响应数据:');
            console.log(JSON.stringify(data, null, 2));
            
            // 解析消息内容
            if (data.messages && data.messages.length > 0) {
                const lastMessage = data.messages[data.messages.length - 1];
                console.log('\n💬 扣子回复:');
                console.log(lastMessage.content);
            }
        } else {
            const errorText = await response.text();
            console.log('\n❌ 扣子API调用失败:');
            console.log('状态码:', response.status);
            console.log('错误信息:', errorText);
        }
        
    } catch (error) {
        console.log('\n💥 请求异常:', error.message);
    }
}

finalTest();