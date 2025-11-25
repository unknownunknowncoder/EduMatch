// 检查特定Bot的详细信息
import fetch from 'node-fetch';

async function checkBotDetails() {
    const token = 'pat_v7ZUGQxfsN0oiwf3B2mn4WDZxM9r3wDlSR5oJ8NCI2VAUcb1IkaqpTwODmFtlpaz';
    const workspaceId = '7560504177639260175';
    const botId = '7573579561607331840';
    
    console.log('🔍 检查Bot详细信息...');
    console.log('工作空间ID:', workspaceId);
    console.log('Bot ID:', botId);
    
    // 尝试获取Bot详情
    try {
        const response = await fetch(`https://api.coze.cn/v1/bot/get_online_info?bot_id=${botId}&space_id=${workspaceId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('响应状态:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Bot详细信息:');
            console.log(JSON.stringify(data, null, 2));
        } else {
            const errorText = await response.text();
            console.log('❌ 获取Bot详情失败:', errorText);
        }
        
    } catch (error) {
        console.log('💥 异常:', error.message);
    }
    
    // 尝试不同的API版本
    console.log('\n🔄 尝试v3 API...');
    try {
        const v3Response = await fetch(`https://api.coze.cn/v3/bot/get?bot_id=${botId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('v3响应状态:', v3Response.status);
        
        if (v3Response.ok) {
            const v3Data = await v3Response.json();
            console.log('✅ v3 Bot信息:');
            console.log(JSON.stringify(v3Data, null, 2));
        } else {
            const v3Error = await v3Response.text();
            console.log('❌ v3获取失败:', v3Error);
        }
        
    } catch (v3Error) {
        console.log('💥 v3异常:', v3Error.message);
    }
    
    // 尝试直接调用聊天API测试
    console.log('\n💬 直接测试聊天API...');
    try {
        const chatResponse = await fetch('https://api.coze.cn/v1/chat', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bot_id: botId,
                user: 'test_user_' + Date.now(),
                query: '你好，请介绍一下你自己',
                stream: false
            })
        });
        
        console.log('聊天API响应状态:', chatResponse.status);
        
        if (chatResponse.ok) {
            const chatData = await chatResponse.json();
            console.log('✅ 聊天成功:');
            console.log(JSON.stringify(chatData, null, 2));
        } else {
            const chatError = await chatResponse.text();
            console.log('❌ 聊天失败:', chatError);
        }
        
    } catch (chatError) {
        console.log('💥 聊天异常:', chatError.message);
    }
}

checkBotDetails();