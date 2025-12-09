# EduMatch Dockerfile - 容器模式部署，彻底解决超时问题
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 先复制 package 文件，利用 Docker 缓存层
COPY package*.json ./

# 安装依赖（包括开发依赖）
RUN npm install --include=dev && echo "依赖安装完成"

# 然后复制其他文件
COPY . .

# 安装所有依赖（包括开发依赖，因为构建需要）
RUN npm install --include=dev && echo "依赖安装完成"

# 构建前端
RUN npm run build && echo "前端构建完成"

# 验证构建结果
RUN ls -la dist/ || echo "dist目录不存在"
RUN test -f dist/index.html && echo "index.html存在" || echo "index.html不存在"

# 暴露端口（与服务器代码中的 PORT 环境变量对应）
EXPOSE 3014

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3014

# 复制启动脚本
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3014

# 暴露端口
EXPOSE 3014

# 使用启动脚本
ENTRYPOINT ["docker-entrypoint.sh"]