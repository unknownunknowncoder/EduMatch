const express = require('express');
const cors = require('cors');

// 确保 fetch 可用（Node.js v18+ 内置，否则使用 node-fetch）
let fetch;
if (typeof globalThis.fetch !== 'undefined') {
  fetch = globalThis.fetch;
} else {
  // Fallback to node-fetch if global fetch is not available
  const nodeFetch = require('node-fetch');
  fetch = nodeFetch.default || nodeFetch;
}

const app = express();
const PORT = 3014;

// 中间件
app.use(cors());
app.use(express.json());

// 加载环境变量
require('dotenv').config();

// 扣子API配置
const COZE_API_URL = 'https://api.coze.cn/open_api/v2/chat';
const COZE_API_TOKEN = process.env.VITE_COZE_API_TOKEN || process.env.COZE_API_TOKEN || 'sat_uvUYKEkkKh2rL1IfHmO8IkVGwmdyZBP5D7PoxYuw1PvpMFhjMGy5GQyRiz2lBrlH';
const COZE_BOT_ID = process.env.VITE_COZE_BOT_ID || process.env.COZE_BOT_ID || '7573579561607331840';

console.log('🔧 代理服务器配置检查:');
console.log('   API Token:', COZE_API_TOKEN ? '已配置' : '未配置');
console.log('   Bot ID:', COZE_BOT_ID ? '已配置' : '未配置');

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 聊天端点 - 直接转发到扣子API
app.post('/chat', async (req, res) => {
  try {
    console.log('🔧 收到前端请求:', req.body);
    
    const { conversation_id, messages, user } = req.body;

    // 构建扣子API请求
    const lastMessage = messages && messages.length > 0 ? messages[messages.length - 1] : {};
    const cozeRequest = {
      conversation_id: conversation_id || '',
      bot_id: COZE_BOT_ID,
      user: user || 'default_user',
      stream: false,
      messages: [
        {
          content_type: 'text',
          content: {
            text: lastMessage.content || '',
            image_url: null,
            file_url: null
          }
        }
      ]
    };

    console.log('🔗 发送到扣子API:', JSON.stringify(cozeRequest, null, 2));

    // 发送请求到扣子API
    const response = await fetch(COZE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COZE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(cozeRequest)
    });

    if (!response.ok) {
      throw new Error(`扣子API请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📩 扣子API响应:', data);

    // 检查响应格式
    if (data.messages && data.messages.length > 0) {
      const lastMessage = data.messages[data.messages.length - 1];
      if (lastMessage.type === 'answer' && lastMessage.content) {
        // 直接返回扣子的回复内容，不做任何修改
        res.json({
          success: true,
          data: {
            content: lastMessage.content,
            type: 'ai_response'
          }
        });
        return;
      }
    }

    // 如果没有找到消息，返回原始响应
    console.log('⚠️ 未找到有效的回复内容，返回原始响应');
    res.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('❌ 代理服务器错误:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 搜索资源端点
app.post('/search-resources', async (req, res) => {
  try {
    console.log('🔧 收到资源搜索请求:', req.body);
    
    const { query } = req.body;
    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({
        success: false,
        error: '查询内容不能为空'
      });
    }

    // 直接使用用户查询作为输入
    const userQuery = query.trim();

    // 构建扣子API请求 - 使用query字段（v2 API标准格式）
    const cozeRequest = {
      conversation_id: '',
      bot_id: COZE_BOT_ID,
      user: `resource_user_${Date.now()}`,
      query: `请根据"${userQuery}"推荐B站与中国大学MOOC的优质学习资源，严格按照以下格式返回：🎯 最推荐、📚 其他推荐、💡 学习建议，并务必包含平台来源、难度、学习时长与学习数据。`,
      chat_history: [],
      stream: false
    };

    console.log('🔗 发送到扣子API:', JSON.stringify(cozeRequest, null, 2));

    // 发送请求到扣子API
    const response = await fetch(COZE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COZE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(cozeRequest)
    });

    // 获取响应文本以便调试
    const responseText = await response.text();
    console.log('📩 扣子API响应状态:', response.status);
    console.log('📩 扣子API响应内容:', responseText.substring(0, 500));

    if (!response.ok) {
      // 尝试解析错误响应
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { raw: responseText };
      }
      console.error('❌ 扣子API错误详情:', errorData);
      throw new Error(`扣子API请求失败: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ 解析扣子API响应失败:', parseError);
      throw new Error(`扣子API响应格式错误: ${responseText.substring(0, 200)}`);
    }
    console.log('📩 扣子API解析后的数据:', JSON.stringify(data, null, 2).substring(0, 1000));

    // 检查响应格式
    if (data.messages && data.messages.length > 0) {
      const lastMessage = data.messages[data.messages.length - 1];
      if (lastMessage.type === 'answer' && lastMessage.content) {
        // 直接返回扣子的回复内容
        res.json({
          success: true,
          data: {
            content: lastMessage.content,
            type: 'ai_response'
          }
        });
        return;
      }
    }

    // 如果没有找到消息，返回原始响应
    console.log('⚠️ 未找到有效的回复内容，返回原始响应');
    res.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('❌ 代理服务器错误:', error.message);
    console.error('❌ 错误堆栈:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 扣子API代理服务器已启动`);
  console.log(`📍 地址: http://localhost:${PORT}`);
  console.log(`🔗 API端点: http://localhost:${PORT}/chat`);
  console.log(`🔍 搜索端点: http://localhost:${PORT}/search-resources`);
});