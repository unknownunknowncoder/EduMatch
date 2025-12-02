import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

const app = express()
const PORT = 3014

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// 扣子API代理端点
app.post('/api/coze/chat', async (req, res) => {
  try {
    const { query, bot_id, user_id } = req.body
    
    console.log('🔍 收到扣子API请求:', { query, bot_id, user_id })
    
    // 从环境变量获取token - 使用正确的API token
    const apiToken = 'sat_uvUYKEkkKh2rL1IfHmO8IkVGwmdyZBP5D7PoxYuw1PvpMFhjMGy5GQyRiz2lBrlH'
    console.log('🔑 使用硬编码的PAT token:', apiToken.substring(0, 20) + '...')
    const defaultBotId = process.env.COZE_BOT_ID || '7573579561607331840'
    
    // 直接使用API token作为access token
    // 扣子API的token格式通常是pat_xxxx格式，可以直接作为Bearer token使用
    let accessToken = apiToken
    
    console.log('🔑 使用API token作为access token:', accessToken.substring(0, 20) + '...')
    
    // 调用扣子API - 使用正确的API端点
    const workspaceId = '7560504177639260175'
    const cozeApiUrl = `https://api.coze.cn/open_api/v2/chat`
    const requestBody = {
      conversation_id: "",
      bot_id: bot_id || defaultBotId,
      user: user_id || 'user_' + Date.now(),
      query: `请推荐${query}相关的优质学习资源，包括B站视频和中国大学MOOC课程。请以JSON格式返回，包含最推荐、其他推荐和学习建议。`,
      chat_history: [],
      stream: false
    }
    
    console.log('📡 调用扣子API:', {
      url: cozeApiUrl,
      token: accessToken.substring(0, 20) + '...',
      bot_id: bot_id || defaultBotId
    })
    
    console.log('🔑 使用token调用扣子API...')
    console.log('Token前缀:', accessToken.substring(0, 20))
    
    const cozeResponse = await fetch(cozeApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    
    console.log('📡 扣子API响应状态:', cozeResponse.status)
    
    if (cozeResponse.ok) {
      const responseText = await cozeResponse.text()
      console.log('✅ 扣子API响应成功，长度:', responseText.length)
      console.log('📝 响应内容预览:', responseText.substring(0, 200) + '...')
      
      // 尝试解析响应
      let response
      try {
        response = JSON.parse(responseText)
        console.log('📊 响应结构:', Object.keys(response))
        
        // 检查是否是新的API格式
        if (response.messages && response.messages.length > 0) {
          // 新API格式，提取最后一条消息
          const lastMessage = response.messages[response.messages.length - 1]
          console.log('💬 提取消息内容:', lastMessage.content ? lastMessage.content.substring(0, 100) + '...' : '无内容')
        }
        
      } catch (parseError) {
        console.log('📝 响应不是JSON格式，返回原始文本')
        response = { 
          messages: [{ 
            content: responseText,
            type: 'text'
          }] 
        }
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

// 静态文件服务（前端）
app.use((req, res, next) => {
  // 只对API路径和健康检查路径放行
  if (req.path.startsWith('/api/') || req.path === '/health') {
    return next()
  }
  // 其他所有路径返回index.html（用于前端路由）
  res.sendFile(__dirname + '/dist/index.html')
})

app.listen(PORT, () => {
  console.log(`🚀 扣子API代理服务器启动成功！`)
  console.log(`📍 地址: http://localhost:${PORT}`)
  console.log(`🔗 API代理: http://localhost:${PORT}/api/coze/chat`)
  console.log(`❤️  健康检查: http://localhost:${PORT}/health`)
})