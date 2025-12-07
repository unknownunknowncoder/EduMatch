const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const { method, body, headers } = event;
  
  // 设置 CORS 头
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // 处理 OPTIONS 请求（CORS 预检）
  if (method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    // 从环境变量获取配置
    const COZE_API_TOKEN = process.env.COZE_API_TOKEN;
    const COZE_BOT_ID = process.env.COZE_BOT_ID;
    const COZE_API_URL = 'https://api.coze.cn/open_api/v2/chat';

    if (!COZE_API_TOKEN || !COZE_BOT_ID) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing API configuration' })
      };
    }

    // 解析请求体
    let requestBody;
    if (body) {
      requestBody = typeof body === 'string' ? JSON.parse(body) : body;
    }

    // 构建扣子 API 请求
    const cozeRequestBody = {
      conversation_id: requestBody?.conversation_id || '',
      bot_id: COZE_BOT_ID,
      user: requestBody?.user || 'user_' + Math.random().toString(36).substr(2, 9),
      query: requestBody?.query || '',
      stream: requestBody?.stream || false,
      custom_variables: requestBody?.custom_variables || {}
    };

    const response = await fetch(COZE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COZE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cozeRequestBody)
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Coze API Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};