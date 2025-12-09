const fetch = require('node-fetch');

// Background Function版本 - 支持最长15分钟超时
module.exports = function(event, context, callback) {
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
    return callback(null, {
      statusCode: 200,
      headers,
      body: ''
    });
  }

  if (event.httpMethod !== 'POST') {
    return callback(null, {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    });
  }

  try {
    const { query, bot_id, user_id } = JSON.parse(event.body || '{}');
    
    if (!query) {
      return callback(null, {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Query is required' })
      });
    }

    console.log('🚀 Background扣子API请求 (15分钟超时):', { 
      query: query.substring(0, 50) + '...', 
      bot_id, 
      user_id,
      function_type: 'background_function'
    });
    
    // 获取配置
    const apiToken = process.env.COZE_API_TOKEN;
    const defaultBotId = process.env.COZE_BOT_ID || '7573579561607331840';
    
    if (!apiToken) {
      return callback(null, {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'COZE_API_TOKEN not configured' })
      });
    }

    // 扣子API调用 - Background Function 支持15分钟
    const cozeApiUrl = `https://api.coze.cn/open_api/v2/chat`;
    const requestBody = {
      bot_id: bot_id || defaultBotId,
      user: user_id || `bg_user_${Date.now()}`,
      query: query,
      stream: false
    };

    console.log('📡 调用扣子API (Background模式，15分钟超时):', {
      url: cozeApiUrl,
      bot_id: bot_id || defaultBotId,
      query_length: query.length
    });

    // 发送扣子API请求
    fetch(cozeApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'EduMatch-Background-Function/1.0'
      },
      body: JSON.stringify(requestBody),
      timeout: 840000 // 14分钟超时
    })
    .then(cozeResponse => {
      const elapsed = Date.now() - startTime;
      console.log('📡 扣子API响应状态:', cozeResponse.status);
      console.log('⏱️ 总请求耗时:', elapsed, 'ms');

      if (!cozeResponse.ok) {
        return cozeResponse.text().then(errorText => {
          console.error('❌ 扣子API错误:', {
            status: cozeResponse.status,
            statusText: cozeResponse.statusText,
            body: errorText.substring(0, 500)
          });
          
          callback(null, {
            statusCode: cozeResponse.status,
            headers,
            body: JSON.stringify({ 
              success: false, 
              error: `扣子API错误: ${cozeResponse.status}`,
              details: errorText.substring(0, 200),
              elapsed: elapsed
            })
          });
        });
      }

      return cozeResponse.text().then(responseText => {
        console.log('✅ 扣子API响应成功，长度:', responseText.length);
        
        let response;
        try {
          response = JSON.parse(responseText);
          console.log('📊 响应结构:', Object.keys(response));
        } catch (parseError) {
          console.log('📝 响应不是JSON格式，返回原始文本');
          response = { 
            messages: [{ 
              content: responseText,
              type: 'text'
            }] 
          };
        }

        callback(null, {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: response,
            elapsed: elapsed,
            function_type: 'background'
          })
        });
      });
    })
    .catch(fetchError => {
      const elapsed = Date.now() - startTime;
      console.error('💥 Background Netlify Function 错误:', fetchError);
      
      callback(null, {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: fetchError.message,
          elapsed: elapsed
        })
      });
    });

  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error('💥 Background Netlify Function 错误:', error);
    
    callback(null, {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: error.message,
        elapsed: elapsed
      })
    });
  }
};