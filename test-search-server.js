import { createServer } from 'http'
import { readFileSync } from 'fs'
import { extname } from 'path'

const server = createServer((req, res) => {
  if (req.url === '/' || req.url === '/test-search.html') {
    const html = readFileSync('./test-search.html', 'utf8')
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(html)
  } else {
    res.writeHead(404)
    res.end('Not Found')
  }
})

server.listen(3030, () => {
  console.log('🚀 测试服务器运行在 http://localhost:3030')
  console.log('📝 打开 http://localhost:3030/test-search.html 测试搜索功能')
})