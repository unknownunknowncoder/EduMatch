# 扣子API配置修复指南

## 问题分析

当前扣子智能体无法正常工作的原因是API token格式不正确。系统返回错误代码4101，表示"token不正确"。

## 当前配置状态

- **当前token格式**: `cztei_xxxxx`
- **错误代码**: 4101 (The token you entered is incorrect)
- **API端点测试**: 通讯正常，认证失败

## 解决方案

### 方案1: 获取正确的API Token

1. **访问扣子开发者后台**
   - 打开 [https://coze.cn](https://coze.cn)
   - 登录你的账号

2. **创建或获取API Token**
   - 进入"开发者设置"或"API管理"
   - 创建新的访问令牌（通常以 `pat_` 开头）
   - 复制完整的token

3. **更新配置文件**
   ```bash
   # 编辑 .env.local 文件
   VITE_COZE_API_TOKEN=pat_你的正确token
   ```

### 方案2: 使用OAuth认证方式

如果API token不可用，可以使用OAuth 2.0：

1. **获取Client ID和Client Secret**
   - 在扣子开发者后台注册应用
   - 获取client_id和client_secret

2. **更新认证代码**
   ```javascript
   // 在server.js中添加OAuth认证
   const oauthResponse = await fetch('https://api.coze.cn/api/authorizations/oauth2/access_token', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       client_id: 'your_client_id',
       client_secret: 'your_client_secret',
       grant_type: 'client_credentials'
     })
   });
   ```

## 当前工作状态

✅ **已修复的部分**:
- API代理服务器正常运行 (http://localhost:3014)
- 前端与后端通讯正常
- 错误处理和日志记录完善
- 本地推荐逻辑作为fallback正常工作

✅ **测试方法**:
```bash
# 测试API端点
cd "d:/education resource/EduMatch"
node test-api.js

# 测试健康检查
curl http://localhost:3014/health
```

## 临时解决方案

在获取正确的API token之前，系统会自动使用本地推荐逻辑：
- 支持"六级英语"、"线性代数"、"Python编程"、"考研数学"等关键词
- 返回结构化的推荐结果
- 提供学习建议

## 验证步骤

1. **获取正确token后**:
   ```bash
   # 更新token
   # 重启服务器
   node server.js
   
   # 测试API
   node test-api.js
   ```

2. **成功标志**:
   - API响应中不包含4101错误
   - 返回真实的AI推荐内容
   - 前端显示扣子智能体推荐结果

## 技术细节

- **当前API版本**: v1/v2/v3 均已测试
- **认证方式**: Bearer Token
- **错误处理**: 完善的错误降级机制
- **前后端分离**: 代理服务器架构

## 联系支持

如果问题仍然存在，请检查：
1. Token是否过期
2. API权限配置是否正确
3. 扣子账号是否有API调用权限

参考文档: https://coze.cn/docs/developer_guides/authentication