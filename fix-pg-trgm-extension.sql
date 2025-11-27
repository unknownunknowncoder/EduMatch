-- 修复 pg_trgm 扩展问题的脚本
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 首先检查是否已启用 pg_trgm 扩展
SELECT * FROM pg_extension WHERE extname = 'pg_trgm';

-- 2. 如果未启用，启用 pg_trgm 扩展
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 3. 验证扩展是否已正确启用
SELECT extname, extversion FROM pg_extension WHERE extname = 'pg_trgm';

-- 4. 检查 gin 操作符类是否可用
SELECT opcname, opcintype::regtype 
FROM pg_opclass 
WHERE opcmethod = (SELECT oid FROM pg_am WHERE amname = 'gin') 
AND opcname LIKE '%trgm%';

-- 5. 如果扩展已启用，重新创建 bio 字段的索引
-- 先删除可能存在的错误索引
DROP INDEX IF EXISTS idx_users_bio_trgm;

-- 重新创建正确的索引
CREATE INDEX IF NOT EXISTS idx_users_bio_trgm ON users USING gin (bio gin_trgm_ops);

-- 6. 验证索引是否创建成功
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE indexname = 'idx_users_bio_trgm';