// 测试代理服务器的脚本
const http = require('http')

function testProxyServer() {
  const data = JSON.stringify({
    query: "JavaScript学习"
  })

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/coze/chat',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  }

  const req = http.request(options, (res) => {
    console.log(`状态码: ${res.statusCode}`)
    console.log(`响应头:`, res.headers)
    
    let body = ''
    res.on('data', (chunk) => {
      body += chunk
    })
    
    res.on('end', () => {
      console.log('响应体:', body)
    })
  })

  req.on('error', (e) => {
    console.error(`请求出错: ${e.message}`)
  })

  req.write(data)
  req.end()
}

testProxyServer()