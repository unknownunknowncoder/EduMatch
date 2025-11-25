const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')

const app = express()
const PORT = 3001

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// 扣子API代理端点
app.post('/api/coze/chat', async (req, res) => {
  try {
    const { query, bot_id, user_id } = req.body
    
    console.log('🔍 收到扣子API请求:', { query, bot_id, user_id })
    
    // 从环境变量获取token
    const apiToken = process.env.COZE_API_TOKEN || 'cztei_hSy4b4uf36RCKawy2b8fTIhnXtW76plRFJbdwbgfNVzuRlZYGBAzs74gg32dhvsUq'
    const defaultBotId = process.env.COZE_BOT_ID || '7573579561607331840'
    
    // 尝试OAuth获取access_token
    let accessToken = apiToken
    
    try {
      console.log('🔑 尝试获取OAuth access_token...')
      const oauthResponse = await fetch('https://api.coze.cn/api/authorizations/oauth2/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: apiToken,
          grant_type: 'client_credentials'
        })
      })
      
      if (oauthResponse.ok) {
        const tokenData = await oauthResponse.json()
        accessToken = tokenData.access_token
        console.log('✅ OAuth成功，token:', accessToken.substring(0, 20) + '...')
      } else {
        console.log('❌ OAuth失败，使用原token')
        const errorText = await oauthResponse.text()
        console.log('OAuth错误:', errorText)
      }
    } catch (oauthError) {
      console.log('❌ OAuth异常:', oauthError.message)
    }
    
    // 调用扣子API
    const cozeApiUrl = 'https://api.coze.cn/v1/chat'
    const requestBody = {
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
    }
    
    console.log('📡 调用扣子API:', {
      url: cozeApiUrl,
      token: accessToken.substring(0, 20) + '...',
      bot_id: bot_id || defaultBotId
    })
    
    const cozeResponse = await fetch(cozeApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    
    console.log('📡 扣子API响应状态:', cozeResponse.status)
    
    if (cozeResponse.ok) {
      const responseText = await cozeResponse.text()
      console.log('✅ 扣子API响应成功，长度:', responseText.length)
      
      // 尝试解析响应
      let response
      try {
        response = JSON.parse(responseText)
      } catch (parseError) {
        console.log('📝 响应不是JSON格式，返回原始文本')
        response = { messages: [{ content: responseText }] }
      }
      
      res.json({
        success: true,
        data: response
      })
    } else {
      const errorText = await cozeResponse.text()
      console.log('❌ 扣子API错误:', {
        status: cozeResponse.status,
        statusText: cozeResponse.statusText,
        body: errorText
      })
      
      res.status(cozeResponse.status).json({
        success: false,
        error: errorText,
        status: cozeResponse.status
      })
    }
    
  } catch (error) {
    console.error('💥 代理服务器错误:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 扣子API代理端点
app.post('/api/coze/chat', async (req, res) => {

app.listen(PORT, () => {
  console.log(`🚀 扣子API代理服务器启动成功！`)
  console.log(`📍 地址: http://localhost:${PORT}`)
  console.log(`🔗 API代理: http://localhost:${PORT}/api/coze/chat`)
  console.log(`❤️  健康检查: http://localhost:${PORT}/health`)
})