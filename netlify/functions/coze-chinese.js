const fetch = require('node-fetch');

// 处理中文字段格式的API Function
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

    console.log('🔍 中文字段API请求:', query);

    // 获取配置
    const apiToken = process.env.COZE_API_TOKEN || 'sat_uvUYKEkkKh2rL1IfHmO8IkVGwmdyZBP5D7PoxYuw1PvpMFhjMGy5GQyRiz2lBrlH';
    const defaultBotId = process.env.COZE_BOT_ID || '7573579561607331840';

    // 调用扣子API
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20秒超时

    const cozeApiUrl = `https://api.coze.cn/open_api/v2/chat`;
    const requestBody = {
      bot_id: defaultBotId,
      user: `user_${Date.now()}`,
      query: `请推荐关于"${query}"的学习资源。请用JSON格式返回，字段名用中文：{"最推荐": [{"资源标题": "标题", "来源平台": "B站/中国大学MOOC", "学习数据": "播放量、点赞等", "访问/观看": "BV号或URL", "推荐理由": "推荐原因"}], "其他推荐": [{"资源标题": "标题", "来源平台": "平台", "学习数据": "数据", "访问/观看": "链接", "推荐理由": "理由"}], "学习建议": "学习建议"}`,
      stream: false
    };

    console.log('📡 调用扣子API（中文字段格式）...');

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
      console.error('❌ API错误:', cozeResponse.status);
      // 返回中文字段格式的后备数据
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            "最推荐": [
              {
                "资源标题": `${query} - 推荐学习视频`,
                "来源平台": "B站",
                "学习数据": "播放量高，评分好",
                "访问/观看": `https://www.bilibili.com/search?keyword=${encodeURIComponent(query)}`,
                "推荐理由": "基于您的需求推荐的优质学习资源"
              }
            ],
            "其他推荐": [
              {
                "资源标题": `${query} - 进阶教程`,
                "来源平台": "中国大学MOOC",
                "学习数据": "系统课程，好评率高",
                "访问/观看": `https://www.icourse163.org/search.htm?search=${encodeURIComponent(query)}`,
                "推荐理由": "适合深入学习"
              }
            ],
            "学习建议": `学习${query}时，建议：1. 从基础开始；2. 多练习；3. 定期复习；4. 交流讨论。持续学习，循序渐进提升。`
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

    // 提取有用信息
    let result = {
      "最推荐": [
        {
          "资源标题": `${query} - 推荐学习资源`,
          "来源平台": "B站",
          "学习数据": "优质学习内容",
          "访问/观看": `https://www.bilibili.com/search?keyword=${encodeURIComponent(query)}`,
          "推荐理由": "基于您的学习需求智能推荐"
        }
      ],
      "其他推荐": [
        {
          "资源标题": `${query} - 基础教程`,
          "来源平台": "B站",
          "学习数据": "适合初学者",
          "访问/观看": `https://www.bilibili.com/search?keyword=${encodeURIComponent(query)}%20基础`,
          "推荐理由": "从零开始学习"
        },
        {
          "资源标题": `${query} - 进阶课程`,
          "来源平台": "中国大学MOOC",
          "学习数据": "系统化课程",
          "访问/观看": `https://www.icourse163.org/search.htm?search=${encodeURIComponent(query)}`,
          "推荐理由": "适合有一定基础的学习者"
        }
      ],
      "学习建议": `学习${query}时，建议：1. 从基础概念开始理解；2. 结合实际项目练习；3. 定期复习巩固知识；4. 寻找相关的学习社区交流讨论。持续学习，循序渐进地提升技能。`
    };

    if (data.messages && data.messages.length > 0) {
      const lastMessage = data.messages[data.messages.length - 1];
      const content = lastMessage.content || '';
      
      // 尝试解析中文字段的JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed['最推荐'] || parsed['其他推荐'] || parsed['学习建议']) {
            result = parsed;
          }
        } catch (e) {
          console.log('中文字段JSON解析失败，使用默认格式');
        }
      }
    }

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
    console.error('❌ 中文字段API错误:', error);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          "最推荐": [
            {
              "资源标题": "学习资源推荐",
              "来源平台": "B站",
              "学习数据": "推荐内容",
              "访问/观看": "https://www.bilibili.com",
              "推荐理由": "系统暂时不可用，请稍后重试"
            }
          ],
          "其他推荐": [],
          "学习建议": "网络连接暂时不稳定，请稍后重试或手动搜索相关学习资源。"
        },
        error: true,
        message: error.message,
        elapsed: Date.now() - startTime
      })
    };
  }
};