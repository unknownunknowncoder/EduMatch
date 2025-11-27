const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 3002

// 中间件
app.use(cors())
app.use(express.json())

// 简单的测试端点
app.post('/api/coze/chat', (req, res) => {
  try {
    console.log('收到请求:', req.body)
    
    // 返回模拟的成功响应，用于测试
    res.json({
      success: true,
      data: {
        messages: [
          {
            content: `🎯 最推荐：JavaScript高级编程\n📚 其他推荐：\n- JavaScript权威指南 - 书籍 - 高级\n- ES6标准入门 - 书籍 - 进阶\n💡 学习建议：从基础开始，循序渐进学习`
          }
        ]
      }
    })
  } catch (error) {
    console.error('错误:', error)
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

app.listen(PORT, () => {
  console.log(`🚀 简单测试服务器启动成功！`)
  console.log(`📍 地址: http://localhost:${PORT}`)
  console.log(`🔗 API代理: http://localhost:${PORT}/api/coze/chat`)
  console.log(`❤️  健康检查: http://localhost:${PORT}/health`)
})