-- 为用户表添加昵称字段的迁移脚本
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 为用户表添加昵称字段
ALTER TABLE users ADD COLUMN IF NOT EXISTS nickname VARCHAR(100);

-- 2. 更新现有用户的昵称为默认值（如果为空的话）
UPDATE users SET nickname = username WHERE nickname IS NULL OR nickname = '';

-- 3. 为昵称字段创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);

-- 4. 更新 RLS 策略以包含昵称字段
-- 由于昵称字段不涉及安全策略，现有的 RLS 策略不需要修改

-- 5. 可选：为昵称字段添加约束确保其唯一性（如果需要的话）
-- 注意：这可能会导致数据插入失败，如果两个用户想要相同的昵称
-- ALTER TABLE users ADD CONSTRAINT unique_nickname UNIQUE (nickname);

-- 6. 测试插入语句
INSERT INTO users (username, email, password_hash, nickname) VALUES 
('test_user', 'test@example.com', 'hashed_password', '测试用户')
ON CONFLICT (email) DO NOTHING;

-- 验证表结构
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;