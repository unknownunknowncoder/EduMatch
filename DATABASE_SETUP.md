# 数据库配置指南

## 📋 概述

本项目支持多种数据库类型：
- MySQL
- PostgreSQL
- MongoDB
- Firebase Firestore
- Supabase

## 🚀 快速开始

### 1. 安装依赖包

根据您选择的数据库类型，安装相应的包：

#### MySQL
```bash
npm install mysql2 @types/mysql2
```

#### PostgreSQL
```bash
npm install pg @types/pg
```

#### MongoDB
```bash
npm install mongodb
```

#### Firebase
```bash
npm install firebase
```

#### Supabase
```bash
npm install @supabase/supabase-js
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填入您的配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# MySQL/PostgreSQL 配置
VITE_DB_HOST=localhost
VITE_DB_PORT=3306
VITE_DB_NAME=edumatch_dev
VITE_DB_USERNAME=root
VITE_DB_PASSWORD=your_password

# Firebase 配置
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Supabase 配置
VITE_SUPABASE_URL=https://your_project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 修改数据库类型

编辑 `src/config/database.ts` 中的配置：

```typescript
// 开发环境配置
export const devConfig: DatabaseConfig = {
  type: 'mysql', // 修改为您使用的数据库类型
  host: 'localhost',
  port: 3306,
  database: 'edumatch_dev',
  username: 'root',
  password: ''
}
```

## 📊 数据库结构示例

### SQL 数据库（MySQL/PostgreSQL）

```sql
-- 用户表
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 学习资源表
CREATE TABLE resources (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  difficulty ENUM('beginner', 'intermediate', 'advanced'),
  rating DECIMAL(2,1) DEFAULT 0,
  duration VARCHAR(50),
  provider VARCHAR(100),
  url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 学习记录表
CREATE TABLE learning_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  resource_id INT NOT NULL,
  progress DECIMAL(5,2) DEFAULT 0,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (resource_id) REFERENCES resources(id)
);

-- 收藏表
CREATE TABLE favorites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  resource_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (resource_id) REFERENCES resources(id),
  UNIQUE KEY unique_favorite (user_id, resource_id)
);
```

### MongoDB 集合结构

```javascript
// users 集合
{
  _id: ObjectId,
  username: String,
  email: String,
  passwordHash: String,
  avatarUrl: String,
  createdAt: Date,
  updatedAt: Date
}

// resources 集合
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  difficulty: String,
  rating: Number,
  duration: String,
  provider: String,
  url: String,
  createdAt: Date
}
```

## 🔧 使用方法

### 在组件中使用

```vue
<script setup lang="ts">
import { useDatabaseStore } from '@/stores/database'

const dbStore = useDatabaseStore()

// 获取数据
const getResources = async () => {
  try {
    const resources = await dbStore.getResources()
    console.log('资源列表:', resources)
  } catch (error) {
    console.error('获取资源失败:', error)
  }
}

// 执行自定义查询
const customQuery = async () => {
  try {
    const result = await dbStore.executeQuery(
      'SELECT * FROM resources WHERE rating > ?',
      [4.0]
    )
    console.log('高评分资源:', result)
  } catch (error) {
    console.error('查询失败:', error)
  }
}
</script>
```

### 直接使用数据库服务

```typescript
import { dbService } from '@/services/database'

// 直接执行查询
const result = await dbService.query(
  'SELECT COUNT(*) FROM users WHERE created_at > ?',
  ['2024-01-01']
)

// 获取数据库客户端
const client = dbService.getClient()
```

## 🔍 监控状态

项目会在开发环境右上角显示数据库连接状态：
- 🟢 绿色：已连接
- 🟡 黄色：连接中
- ⚪ 灰色：未连接
- 🔴 红色：连接错误

## 🛠️ 故障排除

### 常见问题

1. **连接失败**
   - 检查数据库服务是否启动
   - 验证环境变量配置
   - 确认网络连接

2. **TypeScript 错误**
   - 安装正确的类型定义包
   - 检查数据库包是否正确导入

3. **环境变量未生效**
   - 确保变量名以 `VITE_` 开头
   - 重启开发服务器

### 调试模式

在浏览器控制台中查看详细的数据库连接信息：

```javascript
// 查看连接状态
console.log(connection)

// 查看配置信息
console.log(dbConfig)
```

## 📚 更多资源

- [MySQL 文档](https://dev.mysql.com/doc/)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [MongoDB 文档](https://docs.mongodb.com/)
- [Firebase 文档](https://firebase.google.com/docs)
- [Supabase 文档](https://supabase.com/docs)