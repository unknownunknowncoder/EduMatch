// 测试不同的认证方法
import fetch from 'node-fetch';

async function testAuthMethods() {
    const token = 'pat_v7ZUGQxfsN0oiwf3B2mn4WDZxM9r3wDlSR5oJ8NCI2VAUcb1IkaqpTwODmFtlpaz';
    const botId = '7573579561607331840';
    
    console.log('🔑 测试不同的认证方法...');
    
    // 方法1: 直接使用PAT token调用v2 API
    console.log('\n1️⃣ 测试PAT token + v2 API');
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
                user: 'test_user',
                query: '你好',
                chat_history: [],
                stream: false
            })
        });
        
        console.log('状态:', response.status);
        if (response.ok) {
            const data = await response.json();
            console.log('✅ 成功:', JSON.stringify(data, null, 2));
        } else {
            const error = await response.text();
            console.log('❌ 失败:', error);
        }
    } catch (error) {
        console.log('💥 异常:', error.message);
    }
    
    // 方法2: 尝试OAuth获取access token
    console.log('\n2️⃣ 测试OAuth认证');
    try {
        const oauthResponse = await fetch('https://api.coze.cn/api/authorizations/oauth2/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                client_id: token,
                grant_type: 'client_credentials'
            })
        });
        
        console.log('OAuth状态:', oauthResponse.status);
        if (oauthResponse.ok) {
            const tokenData = await oauthResponse.json();
            console.log('✅ OAuth成功:', tokenData);
            
            // 使用获取的access token测试
            if (tokenData.access_token) {
                console.log('\n🔑 使用OAuth token测试聊天...');
                const chatResponse = await fetch('https://api.coze.cn/open_api/v2/chat', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${tokenData.access_token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        conversation_id: "",
                        bot_id: botId,
                        user: 'test_user',
                        query: '你好',
                        chat_history: [],
                        stream: false
                    })
                });
                
                console.log('聊天状态:', chatResponse.status);
                if (chatResponse.ok) {
                    const chatData = await chatResponse.json();
                    console.log('✅ 聊天成功:', JSON.stringify(chatData, null, 2));
                } else {
                    const chatError = await chatResponse.text();
                    console.log('❌ 聊天失败:', chatError);
                }
            }
        } else {
            const oauthError = await oauthResponse.text();
            console.log('❌ OAuth失败:', oauthError);
        }
    } catch (error) {
        console.log('💥 OAuth异常:', error.message);
    }
    
    // 方法3: 尝试v1 API
    console.log('\n3️⃣ 测试v1 API');
    try {
        const v1Response = await fetch('https://api.coze.cn/v1/chat', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bot_id: botId,
                user: 'test_user',
                query: '你好',
                stream: false
            })
        });
        
        console.log('v1状态:', v1Response.status);
        if (v1Response.ok) {
            const v1Data = await v1Response.json();
            console.log('✅ v1成功:', JSON.stringify(v1Data, null, 2));
        } else {
            const v1Error = await v1Response.text();
            console.log('❌ v1失败:', v1Error);
        }
    } catch (error) {
        console.log('💥 v1异常:', error.message);
    }
}

testAuthMethods();