# EduMatch Dockerfile - 容器模式部署，彻底解决超时问题
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制所有文件
COPY . .

# 安装所有依赖（包括开发依赖，因为构建需要）
RUN npm install --include=dev

# 构建前端
RUN npm run build

# 暴露端口（与服务器代码中的 PORT 环境变量对应）
EXPOSE 3014

# 启动命令 - 启动 Express 服务器
CMD ["npm", "start"]