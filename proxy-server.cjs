const express = require('express')
const cors = require('cors')
const { CozeAPI } = require('@coze/api')

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// 扣子API代理 - 直接fetch但优化参数
app.post('/api/coze/chat', async (req, res) => {
  try {
    const { query, bot_id } = req.body
    console.log('🔍 代理请求:', query)
    
    const serviceToken = 'sat_uvUYKEkkKh2rL1IfHmO8IkVGwmdyZBP5D7PoxYuw1PvpMFhjMGy5GQyRiz2lBrlH'
    const defaultBotId = '7573579561607331840'
    
    console.log('🔐 使用服务访问令牌(SAT)，直接作为Bearer token，前缀:', serviceToken ? serviceToken.substring(0, 15) + '...' : 'undefined')
    
    // SAT 直接作为 Bearer token 使用，不需要 OAuth 流程
    const response = await fetch('https://api.coze.cn/v3/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bot_id: bot_id || defaultBotId,
        user_id: 'user_' + Date.now(),
        stream: false,
        additional_messages: [{
          content: `推荐${query}相关的优质学习资源，包括B站视频和MOOC课程`,
          content_type: "text",
          role: "user"
        }]
      })
    })
    
    const responseText = await response.text()
    console.log('📊 API响应状态:', response.status)
    console.log('📊 API响应内容:', responseText.substring(0, 200) + '...')
    
    if (response.ok) {
      const chatData = JSON.parse(responseText)
      console.log('✅ 创建聊天会话成功:', chatData.data.id)
      
      // 轮询获取AI回复，直到完成
      console.log('🔄 开始轮询AI回复状态...')
      let finalResult = null
      let pollCount = 0
      const maxPolls = 20 // 最多轮询20次 (40秒)
      
      while (pollCount < maxPolls) {
        pollCount++
        console.log(`🔄 第${pollCount}次轮询...`)
        
        await new Promise(resolve => setTimeout(resolve, 2000)) // 等待2秒
        
        // 查询聊天状态
        const statusResponse = await fetch(`https://api.coze.cn/v3/chat/retrieve?chat_id=${chatData.data.id}&conversation_id=${chatData.data.conversation_id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${serviceToken}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (statusResponse.ok) {
          const statusData = await statusResponse.text()
          const statusJson = JSON.parse(statusData)
          console.log(`📊 第${pollCount}次轮询结果:`, statusJson.data?.status)
          
          if (statusJson.data?.status === 'completed') {
            console.log('✅ AI回复完成!')
            // 获取消息列表
            const messagesResponse = await fetch(`https://api.coze.cn/v3/chat/message/list?chat_id=${chatData.data.id}&conversation_id=${chatData.data.conversation_id}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${serviceToken}`,
                'Content-Type': 'application/json'
              }
            })
            
            if (messagesResponse.ok) {
              const messagesData = await messagesResponse.text()
              console.log('✅ 获取到完整消息:', messagesData.substring(0, 200) + '...')
              finalResult = messagesData
            } else {
              console.log('❌ 获取消息失败，使用状态数据')
              finalResult = statusData
            }
            break
          } else if (statusJson.data?.status === 'failed') {
            console.log('❌ AI回复失败')
            finalResult = JSON.stringify({
              error: 'AI回复失败',
              status: 'failed',
              details: statusJson.data
            })
            break
          }
        } else {
          console.log(`❌ 第${pollCount}次轮询失败:`, statusResponse.status)
          await new Promise(resolve => setTimeout(resolve, 1000)) // 失败时额外等待
        }
      }
      
      if (finalResult) {
        console.log('✅ 最终获取到结果，返回给前端')
        res.json({ success: true, data: finalResult })
      } else {
        console.log('⏰ 轮询超时，返回超时错误')
        res.json({ success: false, error: 'AI回复超时，请稍后重试' })
      }
    } else {
      console.log('❌ API调用失败:', response.status)
      res.status(response.status).json({ success: false, error: responseText })
    }
    
  } catch (error) {
    console.error('💥 代理错误:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 代理服务器启动: http://localhost:${PORT}`)
})