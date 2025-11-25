#!/bin/bash

# 扣子API配置脚本
echo "🚀 扣子API配置向导"
echo "==================="

# 检查是否存在.env.local文件
if [ ! -f .env.local ]; then
    echo "📋 创建环境配置文件..."
    cp .env.example .env.local
    echo "✅ 已创建 .env.local 文件"
else
    echo "⚠️  .env.local 文件已存在"
fi

echo ""
echo "📝 请按以下步骤配置扣子API："
echo ""
echo "1. 访问扣子开发者平台：https://coze.cn/"
echo "2. 创建或选择你的智能体应用"
echo "3. 在应用设置中获取API Token"
echo "4. 复制Bot ID"
echo ""
echo "5. 编辑 .env.local 文件："
echo "   VITE_COZE_API_TOKEN=你的API_TOKEN"
echo "   VITE_COZE_BOT_ID=你的BOT_ID"
echo ""

# 询问是否编辑配置文件
read -p "是否现在编辑配置文件？(y/n): " edit_config

if [ "$edit_config" = "y" ] || [ "$edit_config" = "Y" ]; then
    # 检测编辑器
    if command -v code &> /dev/null; then
        code .env.local
    elif command -v nano &> /dev/null; then
        nano .env.local
    elif command -m vim &> /dev/null; then
        vim .env.local
    else
        echo "请手动编辑 .env.local 文件"
    fi
fi

echo ""
echo "🔄 配置完成后，重启开发服务："
echo "   npm run dev"
echo ""
echo "✨ 配置完成！现在可以使用AI推荐功能了！"