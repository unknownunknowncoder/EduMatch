# 🚀 EduMatch 部署指南

## 项目概述
EduMatch 是一个AI驱动的学习平台，包含前端Vue应用和后端API代理。

## 🌐 部署选项

### 方案一：Netlify部署（推荐 ⭐）

#### 优势
- ✅ 免费托管
- ✅ 自动CI/CD
- ✅ 内置Functions支持
- ✅ 自动HTTPS
- ✅ 全球CDN

#### 步骤1：准备Git仓库
```bash
git add .
git commit -m "准备部署"
git push origin main
```

#### 步骤2：连接Netlify
1. 访问 [netlify.com](https://netlify.com)
2. 用GitHub账号登录
3. 点击"New site from Git"
4. 选择你的仓库
5. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`

#### 步骤3：设置环境变量
在Netlify控制台中设置：
```
COZE_API_TOKEN = pat_xxxxxxxxxxxx  # 你的扣子API令牌
COZE_BOT_ID = 7573579561607331840  # 你的机器人ID
```

#### 步骤4：部署完成
Netlify会自动部署，完成后你的网站将在线上运行。

### 方案二：自建服务器部署

#### 服务器要求
- Node.js 18+
- PM2进程管理器
- Nginx反向代理（可选）

#### 部署步骤

1. **上传代码到服务器**
```bash
git clone https://github.com/your-username/EduMatch.git
cd EduMatch
npm install
```

2. **构建前端**
```bash
npm run build
```

3. **配置PM2**
```bash
npm install -g pm2
pm2 start server.js --name edumatch-api
pm2 save
pm2 startup
```

4. **Nginx配置**（可选）
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # 前端静态文件
    location / {
        root /path/to/EduMatch/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # API代理
    location /api/ {
        proxy_pass http://localhost:3014;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 方案三：Vercel部署

1. 连接GitHub仓库到Vercel
2. 设置环境变量
3. 自动部署

## 🔧 环境变量配置

### 本地开发 (.env.local)
```env
VITE_COZE_API_TOKEN=pat_xxxxxxxxxxxx
VITE_COZE_BOT_ID=7573579561607331840
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 生产环境
- Netlify: 在控制台设置环境变量
- 自建服务器: 创建.env文件

## 📊 部署清单

### 部署前检查
- [ ] 代码已推送到Git
- [ ] package.json包含所有依赖
- [ ] 环境变量已配置
- [ ] 构建测试通过

### 部署后验证
- [ ] 网站可以访问
- [ ] 用户注册登录正常
- [ ] AI助手功能正常
- [ ] 响应式设计正常

## 🛠️ 故障排除

### 常见问题

#### 1. 构建失败
```bash
# 清理缓存重新安装
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 2. AI助手不工作
- 检查扣子API token是否正确
- 验证bot ID是否有效
- 查看浏览器控制台错误

#### 3. 数据库连接问题
- 检查Supabase配置
- 验证RLS策略是否正确
- 确认网络访问权限

#### 4. CORS错误
Netlify Functions已处理CORS，如仍有问题：
```javascript
// 在API调用中添加
headers: {
  'Access-Control-Allow-Origin': '*'
}
```

## 📈 性能优化

### 构建优化
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router'],
          'ui': ['lucide-vue-next', 'tailwind-merge']
        }
      }
    }
  }
})
```

### 缓存策略
- 静态资源：1年缓存
- HTML文件：无缓存
- API响应：5分钟缓存

## 🔐 安全配置

### 必须设置的安全头
```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

## 📞 支持

如果遇到问题：
1. 检查浏览器控制台错误
2. 查看服务器日志
3. 验证环境变量配置
4. 检查网络连接

---

## 🎉 推荐部署方案

**推荐使用Netlify部署**，原因：
- 零成本部署
- 自动CI/CD
- 内置安全防护
- 全球CDN加速
- 简单易用

部署完成后，你的EduMatch应用就可以在线上为用户提供AI驱动的学习服务了！