# 🚀 快速设置数据库

## 当前状态
✅ Supabase 连接配置正确  
❌ 数据库表尚未创建

## 立即解决（2分钟）

### 方法 1：使用 Supabase 控制台（最简单）

1. **打开 Supabase 控制台**
   - 访问：https://aonlahundnkxuyxfsmcy.supabase.co
   - 使用您的账号登录

2. **执行 SQL 创建表**
   - 在左侧菜单点击 "SQL Editor"
   - 点击 "New query" 
   - 复制以下所有内容并粘贴：

```sql
-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建资源表
CREATE TABLE IF NOT EXISTS resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) CHECK (type IN ('video', 'article', 'book', 'course', 'tool', 'other')),
    category VARCHAR(100),
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    duration VARCHAR(50),
    provider VARCHAR(100),
    url VARCHAR(255),
    tags TEXT[],
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建学习记录表
CREATE TABLE IF NOT EXISTS learning_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    progress DECIMAL(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, resource_id)
);

-- 创建收藏表
CREATE TABLE IF NOT EXISTS favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, resource_id)
);

-- 插入示例数据
INSERT INTO users (username, email, password_hash) VALUES 
('admin', 'admin@edumatch.com', 'hashed_password'),
('teacher1', 'teacher1@edumatch.com', 'hashed_password'),
('student1', 'student1@edumatch.com', 'hashed_password')
ON CONFLICT (email) DO NOTHING;

INSERT INTO resources (title, description, type, category, difficulty, rating, duration, provider, url, tags, created_by) VALUES 
('Vue 3 基础教程', '从零开始学习 Vue 3 框架的基础知识', 'course', '前端开发', 'beginner', 4.8, '2小时', 'EduMatch平台', 
 'https://example.com/vue3-basics', ARRAY['前端', 'Vue3', 'JavaScript'], (SELECT id FROM users WHERE username = 'admin' LIMIT 1)),
('TypeScript 进阶', '深入学习 TypeScript 的高级特性和最佳实践', 'article', '前端开发', 'advanced', 4.9, '3小时', 'EduMatch平台',
 'https://example.com/typescript-advanced', ARRAY['前端', 'TypeScript', '高级'], (SELECT id FROM users WHERE username = 'admin' LIMIT 1)),
('React Hooks 详解', '全面掌握 React Hooks 的使用方法和原理', 'video', '前端开发', 'intermediate', 4.7, '1.5小时', 'EduMatch平台',
 'https://example.com/react-hooks', ARRAY['前端', 'React', 'Hooks'], (SELECT id FROM users WHERE username = 'teacher1' LIMIT 1))
ON CONFLICT DO NOTHING;
```

3. **执行 SQL**
   - 点击 "▶ Run" 按钮
   - 等待执行完成

### 方法 2：使用文件
如果上面的方法不行，可以直接使用项目中的文件：

1. 复制 `supabase-schema.sql` 文件中的所有内容
2. 粘贴到 Supabase SQL Editor 中
3. 点击 "Run"

## 验证设置

执行完成后，运行测试命令验证：

```bash
node test-db-connection.js
```

如果显示 "✅ 数据库连接正常"，说明设置成功！

## 开始使用

1. 启动项目：`npm run dev`
2. 访问：http://localhost:3000
3. 尝试创建资源，然后到个人中心查看"我的资源"

---

## 🆘 遇到问题？

1. **SQL 执行报错**：检查是否有语法错误，确保复制了完整内容
2. **权限问题**：确保您是 Supabase 项目的所有者或管理员
3. **连接失败**：检查 `.env` 文件中的 URL 和 Key 是否正确

需要帮助？请查看 `DATABASE_SETUP_MANUAL.md` 获取详细说明。