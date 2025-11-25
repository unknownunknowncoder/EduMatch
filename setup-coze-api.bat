@echo off
chcp 65001 > nul

echo 🚀 扣子API配置向导
echo ===================

REM 检查是否存在.env.local文件
if not exist .env.local (
    echo 📋 创建环境配置文件...
    copy .env.example .env.local
    echo ✅ 已创建 .env.local 文件
) else (
    echo ⚠️  .env.local 文件已存在
)

echo.
echo 📝 请按以下步骤配置扣子API：
echo.
echo 1. 访问扣子开发者平台：https://coze.cn/
echo 2. 创建或选择你的智能体应用
echo 3. 在应用设置中获取API Token
echo 4. 复制Bot ID
echo.
echo 5. 编辑 .env.local 文件：
echo    VITE_COZE_API_TOKEN=你的API_TOKEN
echo    VITE_COZE_BOT_ID=你的BOT_ID
echo.

REM 询问是否编辑配置文件
set /p edit_config="是否现在编辑配置文件？(y/n): "

if /i "%edit_config%"=="y" (
    start notepad .env.local
)

echo.
echo 🔄 配置完成后，重启开发服务：
echo    npm run dev
echo.
echo ✨ 配置完成！现在可以使用AI推荐功能了！

pause