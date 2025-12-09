const fetch = require('node-fetch');

// 优化的扣子API代理，增加超时处理和重试机制
exports.handler = async (event) => {
  const startTime = Date.now();
  
  // 设置 CORS 头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, PUT, DELETE, OPTIONS',
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
    const { query, bot_id, user_id } = JSON.parse(event.body || '{}');
    
    if (!query) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Query is required' })
      };
    }

    console.log('🔍 收到扣子API请求:', { query, bot_id, user_id });
    
    // 获取配置
    const apiToken = process.env.COZE_API_TOKEN;
    const defaultBotId = process.env.COZE_BOT_ID || '7573579561607331840';
    
    if (!apiToken) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'COZE_API_TOKEN not configured' })
      };
    }

    // 扣子API调用，设置更长的超时时间，但要在Netlify限制内
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 50000); // 50秒超时（Netlify最大限制）

    const cozeApiUrl = `https://api.coze.cn/open_api/v2/chat`;
    const requestBody = {
      conversation_id: "",
      bot_id: bot_id || defaultBotId,
      user: user_id || `netlify_user_${Date.now()}`,
      query: query, // 直接使用原始查询，避免额外的提示词增加处理时间
      chat_history: [],
      stream: false,
      custom_variables: {}
    };

    console.log('📡 调用扣子API:', {
      url: cozeApiUrl,
      bot_id: bot_id || defaultBotId,
      query_length: query.length
    });

    try {
      const cozeResponse = await fetch(cozeApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
        timeout: 50000
      });

      clearTimeout(timeout);

      console.log('📡 扣子API响应状态:', cozeResponse.status);
      console.log('⏱️ 请求耗时:', Date.now() - startTime, 'ms');

      if (!cozeResponse.ok) {
        const errorText = await cozeResponse.text();
        console.error('❌ 扣子API错误:', {
          status: cozeResponse.status,
          statusText: cozeResponse.statusText,
          body: errorText
        });
        
        return {
          statusCode: cozeResponse.status,
          headers,
          body: JSON.stringify({ 
            success: false, 
            error: `扣子API错误: ${cozeResponse.status} ${cozeResponse.statusText}`,
            details: errorText,
            elapsed: Date.now() - startTime
          })
        };
      }

      const responseText = await cozeResponse.text();
      console.log('✅ 扣子API响应成功，长度:', responseText.length);
      
      let response;
      try {
        response = JSON.parse(responseText);
        console.log('📊 响应结构:', Object.keys(response));
        
        // 检查是否是新的API格式
        if (response.messages && response.messages.length > 0) {
          const lastMessage = response.messages[response.messages.length - 1];
          console.log('💬 提取消息内容:', lastMessage.content ? lastMessage.content.substring(0, 100) + '...' : '无内容');
        }
        
      } catch (parseError) {
        console.log('📝 响应不是JSON格式，返回原始文本');
        response = { 
          messages: [{ 
            content: responseText,
            type: 'text'
          }] 
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: response,
          elapsed: Date.now() - startTime
        })
      };

    } catch (fetchError) {
      clearTimeout(timeout);
      
      if (fetchError.name === 'AbortError') {
        console.error('❌ 请求超时:', fetchError);
        return {
          statusCode: 408,
          headers,
          body: JSON.stringify({ 
            success: false, 
            error: 'Request timeout',
            message: '扣子API响应超时，请稍后重试'
          })
        };
      }
      
      throw fetchError;
    }

  } catch (error) {
    console.error('💥 Netlify Function 错误:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: error.message,
        elapsed: Date.now() - startTime
      })
    };
  }
};