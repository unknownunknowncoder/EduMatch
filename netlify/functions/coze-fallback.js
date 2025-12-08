const fetch = require('node-fetch');

// 后备API Function - 确保总是返回有效数据
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

    console.log('🔍 后备API请求:', query);

    // 直接构建响应，不依赖外部API - 返回英文格式
    const result = {
      top_recommendation: {
        name: `${query} - 推荐学习资源`,
        platform: 'B站',
        difficulty: '入门',
        duration: '2小时',
        study_data: '优质学习内容',
        brief_description: `关于${query}的精选学习视频和课程`,
        reason: '基于热门学习资源推荐',
        url: `https://www.bilibili.com/search?keyword=${encodeURIComponent(query)}`
      },
      other_recommendations: [
        {
          name: `${query} - 基础入门教程`,
          platform: 'B站',
          difficulty: '入门',
          duration: '1.5小时',
          study_data: '基础知识讲解',
          brief_description: `适合零基础学习者的${query}教程`,
          url: `https://www.bilibili.com/search?keyword=${encodeURIComponent(query)}%20基础`
        },
        {
          name: `${query} - 进阶课程`,
          platform: '中国大学MOOC',
          difficulty: '进阶',
          duration: '4小时',
          study_data: '深入学习内容',
          brief_description: `适合有一定基础的学习者的${query}进阶课程`,
          url: `https://www.icourse163.org/search.htm?search=${encodeURIComponent(query)}`
        },
        {
          name: `${query} - 实战项目`,
          platform: 'B站',
          difficulty: '高级',
          duration: '3小时',
          study_data: '实战项目演练',
          brief_description: `通过实际项目学习${query}的高级应用`,
          url: `https://www.bilibili.com/search?keyword=${encodeURIComponent(query)}%20实战`
        }
      ],
      learning_advice: `学习${query}时，建议：1. 从基础概念开始理解；2. 结合实际项目练习；3. 定期复习巩固知识；4. 寻找相关的学习社区交流讨论。持续学习，循序渐进地提升技能。`
    };

    console.log('✅ 后备API响应构建完成');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: result,
        fallback: true,
        message: '使用内置推荐算法',
        elapsed: Date.now() - startTime
      })
    };

  } catch (error) {
    console.error('❌ 后备API错误:', error);
    
    // 即使出错也要返回数据
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          top_recommendation: {
            name: '学习资源推荐',
            platform: 'B站',
            difficulty: '入门',
            duration: '2小时',
            study_data: '推荐学习内容',
            brief_description: '优质的学习资源',
            reason: '系统推荐',
            url: 'https://www.bilibili.com'
          },
          other_recommendations: [],
          learning_advice: '建议探索更多学习资源，制定合理的学习计划。'
        },
        error: true,
        message: '系统出现错误，返回默认推荐',
        elapsed: Date.now() - startTime
      })
    };
  }
};