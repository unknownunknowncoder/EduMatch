#!/usr/bin/env node

/**
 * EduMatch 服务器启动脚本
 * 支持开发和生产环境
 */

import express from 'express'
import cors from 'cors'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { config } from 'dotenv'

// 加载环境变量
config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PORT = process.env.PORT || 3014
const NODE_ENV = process.env.NODE_ENV || 'development'

const app = express()

// 基础中间件
app.use(cors({
  origin: NODE_ENV === 'production' ? false : true,
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 健康检查端点（Zeabur 需要这个）
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: NODE_ENV
  })
})

// 扣子API代理端点
app.post('/api/coze/chat', async (req, res) => {
  try {
    const { query, bot_id, user_id } = req.body
    
    console.log('🔍 收到扣子API请求:', { query, bot_id, user_id })
    
    // 获取配置
    const apiToken = process.env.COZE_API_TOKEN || 'sat_uvUYKEkkKh2rL1IfHmO8IkVGwmdyZBP5D7PoxYuw1PvpMFhjMGy5GQyRiz2lBrlH'
    const defaultBotId = process.env.COZE_BOT_ID || '7573579561607331840'
    
    // 调用扣子API
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
      bot_id: bot_id || defaultBotId
    })
    
    const response = await fetch(cozeApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    
    console.log('📡 扣子API响应状态:', response.status)
    
    if (response.ok) {
      const responseText = await response.text()
      console.log('✅ 扣子API响应成功，长度:', responseText.length)
      
      let response
      try {
        response = JSON.parse(responseText)
        console.log('📊 响应结构:', Object.keys(response))
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
      const errorText = await response.text()
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
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    version: '1.0.0'
  })
})

// 静态文件服务（生产环境）
if (NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')))
  
  app.use((req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'))
  })
}

// 错误处理
app.use((err, req, res, next) => {
  console.error('❌ 服务器错误:', err)
  res.status(500).json({
    success: false,
    error: NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  })
})

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 EduMatch服务器启动成功！`)
  console.log(`📡 监听端口: ${PORT}`)
  console.log(`🌐 访问地址: http://0.0.0.0:${PORT}`)
  console.log(`📁 工作目录: ${__dirname}`)
  console.log(`📄 静态文件检查: ${fs.existsSync(join(__dirname, 'dist', 'index.html'))}`)
  console.log(`📍 环境: ${NODE_ENV}`)
  console.log(`🌐 地址: http://localhost:${PORT}`)
  console.log(`🔗 API代理: http://localhost:${PORT}/api/coze/chat`)
  console.log(`❤️  健康检查: http://localhost:${PORT}/health`)
})
  console.log(`\n💡 按 Ctrl+C 停止服务器\n`)