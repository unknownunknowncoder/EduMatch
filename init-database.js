// 数据库初始化脚本
// 使用方法：node init-database.js

import { createClient } from '@supabase/supabase-js'

// 从 .env 文件读取配置
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 请确保 .env 文件中配置了 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

// 创建 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// SQL 脚本内容
const sqlScript = `
-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 学习资源表
CREATE TABLE IF NOT EXISTS resources (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 学习记录表
CREATE TABLE IF NOT EXISTS learning_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    progress DECIMAL(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, resource_id)
);

-- 收藏表
CREATE TABLE IF NOT EXISTS favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, resource_id)
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_difficulty ON resources(difficulty);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_created_by ON resources(created_by);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON resources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_learning_records_user_id ON learning_records(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_records_resource_id ON learning_records(resource_id);
CREATE INDEX IF NOT EXISTS idx_learning_records_created_at ON learning_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_resource_id ON favorites(resource_id);

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
`

async function initializeDatabase() {
  console.log('🚀 开始初始化数据库...')
  
  try {
    // 执行 SQL 脚本
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlScript })
    
    if (error) {
      console.error('❌ 数据库初始化失败:', error.message)
      console.log('\n💡 请手动执行以下步骤：')
      console.log('1. 登录 Supabase 控制台')
      console.log('2. 进入 SQL Editor')
      console.log('3. 复制并执行 supabase-schema.sql 文件中的内容')
      return false
    }
    
    console.log('✅ 数据库初始化成功！')
    
    // 验证表是否创建成功
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
    
    if (tablesError) {
      console.error('❌ 无法验证表结构:', tablesError.message)
      return false
    }
    
    console.log('\n📊 已创建的表：')
    tables?.forEach(table => {
      console.log(`   - ${table.table_name}`)
    })
    
    return true
    
  } catch (error) {
    console.error('❌ 初始化过程中发生错误:', error.message)
    return false
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase()
}

export { initializeDatabase }