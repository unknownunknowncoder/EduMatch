# 基于 Node 20 Alpine 镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 1. 复制依赖文件
COPY package*.json ./

# 2. 安装所有依赖 (包括 devDependencies，因为 vite build 需要它们)
RUN npm install

# 3. 复制所有源代码
COPY . .

# 4. 执行构建 (生成 dist 文件夹)
# 这一步非常关键，没有它，你的后端找不到前端页面
RUN npm run build

# 5. 设置环境变量
ENV NODE_ENV=production
# 强制让代码知道端口是 3014
ENV PORT=3014

# 6. 暴露端口 (给 Zeabur 看的)
EXPOSE 3014

# 7. 启动命令
# 直接使用你在 package.json 里定义的 start 脚本
CMD ["npm", "run", "start"]