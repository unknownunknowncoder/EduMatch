#!/bin/sh

# 等待一下确保所有文件就绪
sleep 2

# 检查必要文件是否存在
if [ ! -f "start-server.js" ]; then
    echo "错误: start-server.js 不存在"
    exit 1
fi

if [ ! -d "dist" ]; then
    echo "错误: dist 目录不存在"
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    echo "错误: dist/index.html 不存在"
    exit 1
fi

echo "✅ 启动前检查通过"
echo "📁 当前目录: $(pwd)"
echo "📄 文件列表: $(ls -la)"

# 启动应用
exec node start-server.js