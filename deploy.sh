#!/bin/bash

echo "🚀 开始部署 EduMatch 到 Netlify"

# 1. 构建项目
echo "📦 构建前端项目..."
npm run build

# 2. 检查构建结果
if [ ! -d "dist" ]; then
    echo "❌ 构建失败，dist 目录不存在"
    exit 1
fi

echo "✅ 构建完成"

# 3. 部署到 Netlify
echo "🌐 部署到 Netlify..."
npx netlify deploy --prod --dir=dist

echo "🎉 部署完成！"
echo ""
echo "📝 部署后需要在 Netlify 控制台中设置环境变量："
echo "   - COZE_API_TOKEN: 你的扣子 API Token"
echo "   - COZE_BOT_ID: 你的扣子机器人 ID"
echo ""
echo "🔧 Functions 将自动处理跨域问题，无需额外代理"