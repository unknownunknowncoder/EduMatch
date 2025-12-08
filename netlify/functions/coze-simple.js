const fetch = require('node-fetch');

// 简化版扣子API代理 - 直接调用，快速响应
exports.handler = async (event) => {
  const startTime = Date.now();
  
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
    const { query } = JSON.parse(event.body || '{}');
    
    if (!query) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Query is required' })
      };
    }

    console.log('🔍 简化版API请求:', query);
    
    // 获取配置
    const apiToken = process.env.COZE_API_TOKEN || 'sat_uvUYKEkkKh2rL1IfHmO8IkVGwmdyZBP5D7PoxYuw1PvpMFhjMGy5GQyRiz2lBrlH';
    const defaultBotId = process.env.COZE_BOT_ID || '7573579561607331840';

    // 构建简化的扣子API请求
    const cozeApiUrl = `https://api.coze.cn/open_api/v2/chat`;
    const requestBody = {
      bot_id: defaultBotId,
      user: `user_${Date.now()}`,
      query: `推荐关于"${query}"的学习资源，包括B站视频和中国大学MOOC课程。请用简洁的JSON格式返回：{"top":{"title":"推荐标题","desc":"描述","platform":"平台","difficulty":"难度","url":"链接"},"others":[{"title":"标题","desc":"描述","platform":"平台","url":"链接"}],"advice":"学习建议"}`,
      stream: false
    };

    console.log('📡 调用扣子API...');

    // 设置15秒超时
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const cozeResponse = await fetch(cozeApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeout);

    console.log('📡 响应状态:', cozeResponse.status);
    console.log('⏱️  耗时:', Date.now() - startTime, 'ms');

    if (!cozeResponse.ok) {
      const errorText = await cozeResponse.text();
      console.error('❌ API错误:', cozeResponse.status, errorText);
      
      // 返回模拟数据作为后备
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            top_recommendation: {
              name: `${query}学习资源`,
              platform: 'B站',
              difficulty: '入门',
              duration: '2小时',
              study_data: '基础学习资源',
              brief_description: `关于${query}的基础学习视频`,
              url: `https://www.bilibili.com/search?keyword=${encodeURIComponent(query)}`
            },
            other_recommendations: [
              {
                name: `${query}进阶教程`,
                platform: '中国大学MOOC',
                difficulty: '进阶',
                duration: '4小时',
                study_data: '进阶学习资源',
                brief_description: `关于${query}的进阶课程`,
                url: `https://www.icourse163.org/search.htm?search=${encodeURIComponent(query)}`
              }
            ],
            learning_advice: `建议从基础开始学习${query}，循序渐进地掌握相关知识。`
          },
          fallback: true,
          elapsed: Date.now() - startTime
        })
      };
    }

    const responseText = await cozeResponse.text();
    let data;

    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('解析响应失败:', parseError);
      data = { raw_response: responseText };
    }

    // 尝试提取有用信息
    let result = {
      top_recommendation: {
        name: `${query}推荐资源`,
        platform: 'B站',
        difficulty: '入门',
        duration: '2小时',
        study_data: '推荐学习资源',
        brief_description: `关于${query}的学习资源`,
        url: `https://www.bilibili.com/search?keyword=${encodeURIComponent(query)}`
      },
      other_recommendations: [],
      learning_advice: '建议制定学习计划，持续学习提升技能。'
    };

    if (data.messages && data.messages.length > 0) {
      const lastMessage = data.messages[data.messages.length - 1];
      const content = lastMessage.content || '';
      
      // 尝试解析JSON内容
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.top) {
            result.top_recommendation = {
              ...result.top_recommendation,
              ...parsed.top
            };
          }
          if (parsed.others && Array.isArray(parsed.others)) {
            result.other_recommendations = parsed.others.map(item => ({
              name: item.title || '未知标题',
              platform: item.platform || '其他',
              difficulty: item.difficulty || '入门',
              duration: item.duration || '未知时长',
              study_data: '学习资源',
              brief_description: item.desc || '描述',
              url: item.url || '#'
            }));
          }
          if (parsed.advice) {
            result.learning_advice = parsed.advice;
          }
        } catch (e) {
          console.log('JSON解析失败，使用默认格式');
        }
      }
    }

    console.log('✅ 构建最终响应:', {
      top: result.top_recommendation.name,
      others_count: result.other_recommendations.length,
      advice_length: result.learning_advice.length
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: result,
        elapsed: Date.now() - startTime
      })
    };

  } catch (error) {
    console.error('❌ 简化版API错误:', error);
    
    // 返回错误但包含备用数据
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          top_recommendation: {
            name: '暂时无法获取推荐',
            platform: 'B站',
            difficulty: '入门',
            duration: '2小时',
            study_data: '服务暂时不可用',
            brief_description: '请稍后重试或手动搜索相关资源',
            url: 'https://www.bilibili.com'
          },
          other_recommendations: [],
          learning_advice: '网络连接暂时不稳定，请稍后重试。'
        },
        error: true,
        message: error.message,
        elapsed: Date.now() - startTime
      })
    };
  }
};