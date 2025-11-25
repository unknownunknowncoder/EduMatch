const http = require('http');
const https = require('https');
const { URL } = require('url');

const server = http.createServer((req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.method === 'POST' && req.url === '/api/coze/chat') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      try {
        const { query, bot_id } = JSON.parse(body);
        console.log('🔍 收到请求:', query);
        
        // 调用扣子API
        const postData = JSON.stringify({
          bot_id: bot_id || '7573579561607331840',
          user_id: 'user_' + Date.now(),
          content: `推荐${query}相关的优质学习资源，包括B站视频和MOOC课程`,
          stream: false
        });
        
        const options = {
          hostname: 'api.coze.cn',
          port: 443,
          path: '/v3/chat',
          method: 'POST',
          headers: {
            'Authorization': 'Bearer cztei_hSy4b4uf36RCKawy2b8fTIhnXtW76plRFJbdwbgfNVzuRlZYGBAzs74gg32dhvsUq',
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };
        
        const cozeReq = https.request(options, (cozeRes) => {
          let data = '';
          cozeRes.on('data', chunk => {
            data += chunk;
          });
          
          cozeRes.on('end', () => {
            console.log('✅ 扣子API响应状态:', cozeRes.statusCode);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: cozeRes.statusCode === 200,
              data: data,
              status: cozeRes.statusCode
            }));
          });
        });
        
        cozeReq.on('error', (error) => {
          console.error('❌ 扣子API请求失败:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: error.message
          }));
        });
        
        cozeReq.write(postData);
        cozeReq.end();
        
      } catch (error) {
        console.error('💥 代理服务器错误:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: error.message
        }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 简单代理服务器启动: http://localhost:${PORT}`);
});