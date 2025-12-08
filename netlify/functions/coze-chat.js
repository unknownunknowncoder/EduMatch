const fetch = require('node-fetch');

exports.handler = async (event) => {
  // 设置 CORS 头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // 处理预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { query } = JSON.parse(event.body);
    
    if (!query) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Query is required' })
      };
    }

    console.log('🔍 Netlify Function 收到请求:', query);

    // 调用扣子 API
    const cozeResponse = await fetch('https://api.coze.cn/open_api/v2/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COZE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bot_id: process.env.COZE_BOT_ID || '7573579561607331840',
        conversation_id: "",
        user: "netlify_user_" + Date.now(),
        query: `请推荐${query}相关的优质学习资源，包括B站视频和中国大学MOOC课程。请以JSON格式返回，包含最推荐、其他推荐和学习建议。`,
        chat_history: [],
        stream: false,
        custom_variables: {}
      })
    });

    if (!cozeResponse.ok) {
      console.error('❌ 扣子 API 错误:', cozeResponse.status, cozeResponse.statusText);
      const errorText = await cozeResponse.text();
      console.error('错误详情:', errorText);
      
      return {
        statusCode: cozeResponse.status,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: `扣子 API 错误: ${cozeResponse.status} ${cozeResponse.statusText}`,
          details: errorText
        })
      };
    }

    const data = await cozeResponse.json();
    console.log('✅ 扣子 API 响应成功');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: data
      })
    };

  } catch (error) {
    console.error('❌ Netlify Function 错误:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
    };
  }
};