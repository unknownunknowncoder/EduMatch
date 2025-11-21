-- 清理社区测试帖子的SQL脚本
-- 请在 Supabase SQL Editor 中执行

-- 方式1：完全清空表（推荐）
TRUNCATE TABLE community_posts;

-- 方式2：如果TRUNCATE不工作，使用DELETE
-- DELETE FROM community_posts;

-- 重置序列（如果有的话）
-- ALTER SEQUENCE community_posts_id_seq RESTART WITH 1;

-- 验证清理结果
SELECT COUNT(*) as remaining_posts FROM community_posts;

-- 显示剩余帖子（如果有的话）
SELECT * FROM community_posts;

-- 如果需要重新创建表结构，可以使用以下命令
-- DROP TABLE IF EXISTS community_posts CASCADE;
-- 然后重新运行创建表的脚本

-- 临时禁用RLS策略以允许删除
ALTER TABLE community_posts DISABLE ROW LEVEL SECURITY;

-- 删除所有数据
DELETE FROM community_posts;

-- 重新启用RLS策略
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- 最终验证
SELECT COUNT(*) as final_post_count FROM community_posts;