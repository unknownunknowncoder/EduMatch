# 使用 Node 20 Alpine
FROM node:20-alpine

WORKDIR /app

# 1. 复制依赖清单
COPY package*.json ./

# --- 核心修复开始 ---
# 强制告诉 npm：不管现在的环境变量是啥，必须给我安装 devDependencies (包含 vite)
# 否则下一步 npm run build 找不到 vite 命令
RUN npm install --include=dev
# --- 核心修复结束 ---

# 2. 复制源码
COPY . .

# 3. 执行构建 (这时候就有 vite 命令了)
RUN npm run build

# 4. 构建完成后，再把环境变量设为 production
# 这样运行时的性能是最好的，但不会影响构建时的 vite
ENV NODE_ENV=production
ENV PORT=3014

# 5. 暴露端口
EXPOSE 3014

# 6. 启动服务
CMD ["npm", "run", "start"]