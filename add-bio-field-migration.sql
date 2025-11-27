-- 为用户表添加个性签名（bio）字段的数据库迁移脚本
-- 适用于 Supabase PostgreSQL 数据库

-- 启用 pg_trgm 扩展（如果尚未启用）
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 为 users 表添加 bio 字段
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT NULL;

-- 为 bio 字段添加注释
COMMENT ON COLUMN users.bio IS '用户个性签名，最多140个字符';

-- 创建索引以优化搜索（可选）
CREATE INDEX IF NOT EXISTS idx_users_bio_trgm ON users USING gin (bio gin_trgm_ops);

-- 更新现有用户数据的示例（可选）
-- UPDATE users SET bio = '这个人很懒，还没有写个人签名~' WHERE bio IS NULL;