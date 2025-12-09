const fetch = require('node-fetch');

// 快速响应版本的扣子API代理
exports.handler = async (event, context) => {
  // 设置函数不等待事件循环清空
  context.callbackWaitsForEmptyEventLoop = false;
  
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

      console.log('🚀 超快速扣子API请求 (22秒超时):', { 
      query: query.substring(0, 30) + '...', 
      bot_id, 
      user_id,
      function_timeout: '22s'
    });
    
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

    // 超级简化扣子API调用 - 确保25秒内完成
    const cozeApiUrl = `https://api.coze.cn/open_api/v2/chat`;
    
    // 极简查询，只保留核心关键词
    const simpleQuery = query
      .replace(/请帮我|我想|请问|帮我推荐|有什么|如何|怎么/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 50); // 进一步缩短到50字符
    
    const requestBody = {
      bot_id: bot_id || defaultBotId,
      user: user_id || `netlify_user_${Date.now()}`,
      query: simpleQuery,
      stream: false
      // 最小化请求体
    };

    console.log('📡 调用扣子API (快速模式):', {
      url: cozeApiUrl,
      bot_id: bot_id || defaultBotId,
      query_length: query.length
    });

    try {
      // 极速超时设置，确保在Netlify限制前完成
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 22000); // 22秒，留8秒缓冲

      const cozeResponse = await fetch(cozeApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'EduMatch-Netlify-Function/1.0'
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
        // 移除 node-fetch 的 timeout 参数，只使用 AbortController
      });

      clearTimeout(timeout);

      const elapsed = Date.now() - startTime;
      console.log('📡 扣子API响应状态:', cozeResponse.status);
      console.log('⏱️ 总请求耗时:', elapsed, 'ms');

      if (!cozeResponse.ok) {
        const errorText = await cozeResponse.text();
        console.error('❌ 扣子API错误:', {
          status: cozeResponse.status,
          statusText: cozeResponse.statusText,
          body: errorText.substring(0, 500)
        });
        
        return {
          statusCode: cozeResponse.status,
          headers,
          body: JSON.stringify({ 
            success: false, 
            error: `扣子API错误: ${cozeResponse.status}`,
            details: errorText.substring(0, 200),
            elapsed: elapsed
          })
        };
      }

      const responseText = await cozeResponse.text();
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

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: response,
          elapsed: elapsed
        })
      };

    } catch (fetchError) {
      const elapsed = Date.now() - startTime;
      
      if (fetchError.name === 'AbortError') {
        console.log('⚡ API超时，返回快速fallback响应');
        // 快速fallback响应 - 基于查询的关键词匹配
        const fallbackResponse = generateFallbackResponse(query);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: fallbackResponse,
            elapsed: elapsed,
            fallback: true
          })
        };
      }
      
      throw fetchError;
    }

    // 生成快速fallback响应的函数
    function generateFallbackResponse(originalQuery) {
      const query = originalQuery.toLowerCase();
      
      let responses = {
        python: {
          messages: [{
            content: JSON.stringify({
              "最推荐": [{
                "资源标题": "Python入门教程 - 廖雪峰的官方网站",
                "来源平台": "官网",
                "推荐理由": "免费权威的中文Python教程",
                "访问/观看": "https://www.liaoxuefeng.com/wiki/1016959663602400",
                "学习数据": "适合零基础学习者"
              }],
              "其他推荐": [{
                "资源标题": "Python编程：从入门到实践",
                "来源平台": "B站",
                "推荐理由": "实战项目导向的Python课程",
                "学习数据": "包含大量练习题"
              }],
              "学习建议": "建议从基础语法开始，多做练习项目。Python适合编程初学者，应用广泛。"
            }),
            type: 'text'
          }]
        },
        english: {
          messages: [{
            content: JSON.stringify({
              "最推荐": [{
                "资源标题": "BBC Learning English",
                "来源平台": "官网",
                "推荐理由": "免费权威的英语学习资源",
                "访问/观看": "https://www.bbc.co.uk/learningenglish",
                "学习数据": "涵盖听说读写全方位"
              }],
              "其他推荐": [{
                "资源标题": "英语六级真题解析",
                "来源平台": "B站",
                "推荐理由": "系统性的六级备考资料",
                "学习数据": "历年真题+详细解析"
              }],
              "学习建议": "坚持每天学习，多听多说多练。英语学习需要长期积累。"
            }),
            type: 'text'
          }]
        }
      };
      
      // 根据关键词返回对应的响应
      if (query.includes('python') || query.includes('编程')) {
        return responses.python;
      } else if (query.includes('英语') || query.includes('english')) {
        return responses.english;
      } else {
        // 默认响应
        return {
          messages: [{
            content: JSON.stringify({
              "最推荐": [{
                "资源标题": "B站学习资源",
                "来源平台": "B站",
                "推荐理由": "丰富的免费学习视频",
                "访问/观看": "https://www.bilibili.com",
                "学习数据": "涵盖各类学科"
              }],
              "其他推荐": [],
              "学习建议": "根据兴趣选择适合的学习资源，坚持学习才能取得好效果。"
            }),
            type: 'text'
          }]
        };
      }
    }

  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error('💥 快速 Netlify Function 错误:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: error.message,
        elapsed: elapsed
      })
    };
  }
};