# Netlify 部署指南

## AI 助手部署说明

### 🚀 部署步骤

#### 1. 推送代码到 GitHub
```bash
git add .
git commit -m "添加 Netlify Functions 支持 AI 助手部署"
git push origin main
```

#### 2. 在 Netlify 配置环境变量
登录 Netlify 控制台：
1. 选择你的站点
2. 进入 `Site settings` → `Environment variables`
3. 添加以下环境变量：

```
COZE_API_TOKEN = pat_xxxxxxxxxxxx  # 你的扣子API令牌
COZE_BOT_ID = 73xxxxxxx73xxxxxxxxxx  # 你的机器人ID
```

#### 3. 触发重新部署
添加环境变量后，点击 `Trigger deploy` → `Deploy site`

### 🔧 本地开发 vs 生产环境

#### 本地开发（需要代理服务器）：
```bash
# 启动前端
npm run dev

# 启动代理服务器（另一个终端）
npm run server:dev
```

#### 生产环境（Netlify）：
- 无需代理服务器
- Netlify Functions 自动处理 API 调用
- CORS 问题自动解决

### 📁 项目结构
```
EduMatch/
├── netlify/
│   └── functions/
│       └── coze-chat.js    # Netlify Function
├── src/
│   └── services/
│       └── coze-api.ts     # API 调用逻辑
├── netlify.toml            # Netlify 配置
├── .env                    # 本地环境变量
└── .env.production         # 生产环境变量
```

### 🎯 工作原理

#### 开发环境：
```
前端 → 本地代理服务器 → 扣子 API
```

#### 生产环境：
```
前端 → Netlify Function → 扣子 API
```

### 🛠️ 故障排除

#### 1. AI 助手不工作
- 检查 Netlify 环境变量是否设置正确
- 查看 Netlify Functions 日志

#### 2. CORS 错误
- 确保使用的是生产环境 API 路径 `/api/coze-chat`
- 检查 Function 是否正确部署

#### 3. 环境变量未生效
- 重新触发部署
- 检查变量名称是否正确（不需要 VITE_ 前缀）

### 📋 必需的环境变量

| 变量名 | 本地开发 | 生产环境 | 说明 |
|--------|----------|----------|------|
| `VITE_COZE_API_TOKEN` | ✅ | ❌ | 本地开发 API 令牌 |
| `VITE_COZE_BOT_ID` | ✅ | ❌ | 本地开发机器人 ID |
| `VITE_COZE_PROXY_URL` | ✅ | ❌ | 本地代理服务器地址 |
| `COZE_API_TOKEN` | ❌ | ✅ | 生产环境 API 令牌 |
| `COZE_BOT_ID` | ❌ | ✅ | 生产环境机器人 ID |

### 🎉 部署完成

部署成功后，你的 AI 助手将在生产环境下正常工作，无需额外的代理服务器！