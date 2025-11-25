// 验证扣子token
import fetch from 'node-fetch';

async function verifyToken() {
    const token = 'pat_v7ZUGQxfsN0oiwf3B2mn4WDZxM9r3wDlSR5oJ8NCI2VAUcb1IkaqpTwODmFtlpaz';
    
    console.log('🔑 验证Token:', token.substring(0, 20) + '...');
    
    // 测试不同的API端点
    const endpoints = [
        {
            name: '工作空间列表',
            url: 'https://api.coze.cn/v1/workspaces',
            method: 'GET'
        },
        {
            name: '用户信息',
            url: 'https://api.coze.cn/v1/user',
            method: 'GET'
        },
        {
            name: 'OAuth Token验证',
            url: 'https://api.coze.cn/api/authorizations/oauth2/verify_token',
            method: 'POST',
            body: JSON.stringify({
                access_token: token
            })
        }
    ];
    
    for (const endpoint of endpoints) {
        try {
            console.log(`\n🧪 测试: ${endpoint.name}`);
            console.log(`URL: ${endpoint.url}`);
            
            const options = {
                method: endpoint.method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };
            
            if (endpoint.body) {
                options.body = endpoint.body;
            }
            
            const response = await fetch(endpoint.url, options);
            const status = response.status;
            
            console.log(`✅ 状态: ${status}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ 成功:', JSON.stringify(data, null, 2));
            } else {
                const errorText = await response.text();
                console.log('❌ 失败:', errorText);
            }
            
        } catch (error) {
            console.log(`💥 异常:`, error.message);
        }
    }
}

verifyToken();