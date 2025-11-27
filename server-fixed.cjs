const express = require('express')
const cors = require('cors')
const https = require('https')
const http = require('http')

const app = express()
const PORT = 3001

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// 简单的 HTTP 请求函数
function makeRequest(url, options, data) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http
    const req = client.request(url, options, (res) => {
      let body = ''
      res.on('data', (chunk) => {
        body += chunk
      })
      res.on('end', () => {
        try {
          const result = {
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            statusText: res.statusMessage,
            text: body
          }
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
    })

    req.on('error', reject)
    if (data) {
      req.write(data)
    }
    req.end()
  })
}

// 扣子API代理端点
app.post('/api/coze/chat', async (req, res) => {
  try {
    console.log('📍 开始处理请求...')
    const { query, bot_id, user_id } = req.body
    
    console.log('🔍 收到扣子API请求:', { query, bot_id, user_id })
    
    // 从环境变量获取token
    const apiToken = process.env.COZE_API_TOKEN || 'cztei_hSy4b4uf36RCKawy2b8fTIhnXtW76plRFJbdwbgfNVzuRlZYGBAzs74gg32dhvsUq'
    const defaultBotId = process.env.COZE_BOT_ID || '7573579561607331840'
    
    // 构建请求体
    const requestBody = JSON.stringify({
      bot_id: bot_id || defaultBotId,
      user_id: user_id || 'user_' + Date.now(),
      additional_messages: [
        {
          content: `你是一个专业的教育资源推荐助手。请推荐${query}相关的优质学习资源。要求：
1. 推荐B站视频资源和中国大学MOOC课程，比例约为6:4
2. 每个资源包含：名称、平台、难度、时长、学习数据
3. 按照以下格式输出：
🎯 最推荐：[课程名称]
📚 其他推荐：
- [课程1] - [平台] - [难度]
- [课程2] - [平台] - [难度]
💡 学习建议：[个性化建议]
4. 确保推荐的资源真实可用，播放量和学习人数合理`,
          content_type: "text",
          role: "user",
          type: "question"
        }
      ],
      stream: false
    })
    
    const cozeApiUrl = 'https://api.coze.cn/v1/chat'
    
    console.log('📡 调用扣子API:', {
      url: cozeApiUrl,
      bot_id: bot_id || defaultBotId
    })
    
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
      }
    }
    
    const response = await makeRequest(cozeApiUrl, options, requestBody)
    
    console.log('📡 扣子API响应状态:', response.status)
    
    if (response.ok) {
      console.log('✅ 扣子API响应成功，长度:', response.text.length)
      
      // 尝试解析响应
      let parsedResponse
      try {
        parsedResponse = JSON.parse(response.text)
      } catch (parseError) {
        console.log('📝 响应不是JSON格式，返回原始文本')
        parsedResponse = { messages: [{ content: response.text }] }
      }
      
      res.json({
        success: true,
        data: parsedResponse
      })
    } else {
      const errorText = response.text
      console.log('❌ 扣子API错误:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      
      res.status(response.status).json({
        success: false,
        error: errorText,
        status: response.status
      })
    }
    
  } catch (error) {
    console.error('💥 代理服务器错误:', error)
    console.error('💥 错误堆栈:', error.stack)
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    })
  }
})

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`🚀 扣子API代理服务器启动成功！`)
  console.log(`📍 地址: http://localhost:${PORT}`)
  console.log(`🔗 API代理: http://localhost:${PORT}/api/coze/chat`)
  console.log(`❤️  健康检查: http://localhost:${PORT}/health`)
})