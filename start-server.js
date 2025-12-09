#!/usr/bin/env node

/**
 * EduMatch 服务器启动脚本 (修复版)
 */

// 1. 放在最最最前面，确认文件被加载了
console.log('🚀 初始化: start-server.js 正在加载...');

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
const NODE_ENV = process.env.NODE_ENV || 'production' // 默认设为 production 更稳

const app = express()

// 2. 修正 CORS 配置：生产环境建议允许所有或指定域名，设为 false 容易出问题
app.use(cors({
  origin: '*', // 调试阶段建议全开，稳定后再限制域名
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 3. 健康检查 (保留这一个详细的即可)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: NODE_ENV,
    msg: 'Zeabur I am alive!'
  })
})

// 扣子API代理端点
app.post('/api/coze/chat', async (req, res) => {
  try {
    const { query, bot_id, user_id } = req.body
    
    console.log('🔍 收到请求:', { query: query?.substring(0, 20) + '...' })
    
    const apiToken = process.env.COZE_API_TOKEN || 'sat_uvUYKEkkKh2rL1IfHmO8IkVGwmdyZBP5D7PoxYuw1PvpMFhjMGy5GQyRiz2lBrlH'
    const defaultBotId = process.env.COZE_BOT_ID || '7573579561607331840'
    const cozeApiUrl = `https://api.coze.cn/open_api/v2/chat`
    
    const requestBody = {
      conversation_id: "",
      bot_id: bot_id || defaultBotId,
      user: user_id || 'user_' + Date.now(),
      query: `请推荐"${query}"相关的优质学习资源...`, // 省略部分长文本
      chat_history: [],
      stream: false
    }
    
    // 1分钟超时控制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000)
    
    const apiStartTime = Date.now()
    
    // 4. 修复变量 shadowing 问题：这里改名叫 fetchRes
    const fetchRes = await fetch(cozeApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    const apiElapsed = Date.now() - apiStartTime
    console.log(`📡 Coze响应耗时: ${(apiElapsed/1000).toFixed(1)}秒, 状态: ${fetchRes.status}`)
    
    if (fetchRes.ok) {
      const responseText = await fetchRes.text()
      
      let parsedData
      try {
        parsedData = JSON.parse(responseText)
      } catch (parseError) {
        console.log('📝 非JSON响应，返回原始内容')
        parsedData = { messages: [{ content: responseText, type: 'text' }] }
      }
      
      res.json({ success: true, data: parsedData })
    } else {
      const errorText = await fetchRes.text()
      console.error('❌ Coze API 报错:', errorText)
      res.status(fetchRes.status).json({ success: false, error: errorText })
    }
    
  } catch (error) {
    console.error('💥 服务器内部错误:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// 5. 静态文件托管 (确保 dist 存在时才托管，防止报错)
if (fs.existsSync(join(__dirname, 'dist'))) {
  console.log('📁 发现 dist 目录，启用静态文件托管');
  app.use(express.static(join(__dirname, 'dist')))
  app.use((req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'))
  })
} else {
  console.log('⚠️ 未找到 dist 目录，仅运行 API 模式');
  app.get('/', (req, res) => res.send('EduMatch API Server Running (No Frontend Build Found)'));
}

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ 服务启动成功!`)
  console.log(`📡 监听端口: ${PORT}`)
  console.log(`🔗 http://0.0.0.0:${PORT}`)
})