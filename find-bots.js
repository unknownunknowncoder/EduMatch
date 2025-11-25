// 查找工作空间中的所有机器人
import fetch from 'node-fetch';

async function findBots() {
    const token = 'pat_v7ZUGQxfsN0oiwf3B2mn4WDZxM9r3wDlSR5oJ8NCI2VAUcb1IkaqpTwODmFtlpaz';
    const workspaceId = '7560504177639260175';
    
    console.log('🔍 查找所有可用的机器人...');
    
    // 尝试不同的API端点来获取机器人
    const endpoints = [
        'https://api.coze.cn/v1/space/published_bots',
        'https://api.coze.cn/v1/space/bot/list', 
        'https://api.coze.cn/v3/space/bot/list',
        'https://api.coze.cn/v1/bot/list',
        'https://api.coze.cn/v2/bot/list'
    ];
    
    for (const endpoint of endpoints) {
        console.log(`\n🧪 尝试端点: ${endpoint}`);
        
        try {
            const url = endpoint.includes('?') ? 
                `${endpoint}&space_id=${workspaceId}` : 
                `${endpoint}?space_id=${workspaceId}`;
                
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log(`状态: ${response.status}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ 成功!');
                console.log(JSON.stringify(data, null, 2));
                
                // 如果有机器人，列出它们
                if (data.data) {
                    const bots = data.data.bots || data.data || [];
                    if (bots.length > 0) {
                        console.log('\n🤖 找到的机器人:');
                        bots.forEach((bot, index) => {
                            console.log(`${index + 1}. ID: ${bot.bot_id || bot.id}`);
                            console.log(`   名称: ${bot.bot_name || bot.name}`);
                            console.log(`   描述: ${bot.bot_desc || bot.description}`);
                            console.log('');
                        });
                        return; // 找到机器人就退出
                    }
                }
            } else {
                const errorText = await response.text();
                console.log(`❌ 失败: ${errorText.substring(0, 100)}...`);
            }
            
        } catch (error) {
            console.log(`💥 异常:`, error.message);
        }
    }
    
    // 如果所有端点都失败，尝试创建一个简单的机器人
    console.log('\n🔧 尝试创建一个简单的测试机器人...');
    try {
        const createResponse = await fetch('https://api.coze.cn/v1/bot/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bot_name: '教育推荐助手',
                bot_desc: '专门推荐学习资源的教育助手',
                space_id: workspaceId,
                prompt: '你是一个专业的教育资源推荐助手，可以帮助用户找到合适的学习资源。'
            })
        });
        
        if (createResponse.ok) {
            const botData = await createResponse.json();
            console.log('✅ 机器人创建成功!');
            console.log('Bot ID:', botData.data.bot_id);
        } else {
            const errorText = await createResponse.text();
            console.log('❌ 创建失败:', errorText);
        }
        
    } catch (error) {
        console.log('💥 创建异常:', error.message);
    }
}

findBots();