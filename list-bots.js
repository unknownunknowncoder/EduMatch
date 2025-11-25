// 列出工作空间中的机器人
import fetch from 'node-fetch';

async function listBots() {
    const token = 'pat_v7ZUGQxfsN0oiwf3B2mn4WDZxM9r3wDlSR5oJ8NCI2VAUcb1IkaqpTwODmFtlpaz';
    const workspaceId = '7560504177639260175';
    
    console.log('🤖 列出工作空间机器人...');
    console.log('工作空间ID:', workspaceId);
    
    try {
        const response = await fetch(`https://api.coze.cn/v3/space/bot/list?space_id=${workspaceId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('响应状态:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ 机器人列表:');
            console.log(JSON.stringify(data, null, 2));
            
            if (data.data && data.data.bots) {
                console.log('\n🎯 可用的机器人:');
                data.data.bots.forEach((bot, index) => {
                    console.log(`${index + 1}. ID: ${bot.bot_id}, 名称: ${bot.bot_name}, 描述: ${bot.bot_desc}`);
                });
            }
        } else {
            const errorText = await response.text();
            console.log('❌ 获取机器人列表失败:', errorText);
        }
        
    } catch (error) {
        console.log('💥 异常:', error.message);
    }
}

listBots();