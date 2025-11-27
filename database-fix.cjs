const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function fixDatabaseConstraints() {
  console.log('🔧 修复数据库约束问题...');
  
  // 这个SQL脚本需要在Supabase的SQL编辑器中手动执行
  const fixSQL = `
-- 修复post_likes表的外键约束问题

-- 1. 首先备份现有数据
CREATE TABLE IF NOT EXISTS post_likes_backup AS SELECT * FROM post_likes;

-- 2. 删除现有的外键约束
ALTER TABLE post_likes DROP CONSTRAINT IF EXISTS fk_post_likes_user CASCADE;
ALTER TABLE post_likes DROP CONSTRAINT IF EXISTS fk_post_likes_post CASCADE;

-- 3. 确保用户表和社区帖子表的数据类型一致
-- 用户ID应该是UUID类型，如果不是需要转换
-- 帖子ID也应该是UUID类型

-- 4. 重新添加正确的外键约束
ALTER TABLE post_likes 
ADD CONSTRAINT fk_post_likes_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE post_likes 
ADD CONSTRAINT fk_post_likes_post 
FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE;

-- 5. 验证约束是否正确添加
SELECT 
    tc.constraint_name,
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'post_likes';
  `;
  
  console.log('📝 请在Supabase SQL编辑器中执行以下SQL脚本:');
  console.log('=' .repeat(60));
  console.log(fixSQL);
  console.log('=' .repeat(60));
  console.log('');
  console.log('📍 访问路径: https://app.supabase.com/project/aonlahundnkxuyxfsmcy/sql');
  console.log('');
  
  // 同时检查当前的数据类型问题
  console.log('🔍 检查当前数据类型...');
  
  // 检查users表的ID类型
  const { data: usersSchema, error: usersError } = await supabase
    .from('users')
    .select('id')
    .limit(1);
  
  if (!usersError && usersSchema) {
    console.log('✅ users表可访问');
  }
  
  // 检查community_posts表的ID类型
  const { data: postsSchema, error: postsError } = await supabase
    .from('community_posts')
    .select('id')
    .limit(1);
  
  if (!postsError && postsSchema) {
    console.log('✅ community_posts表可访问');
  }
  
  // 检查post_likes表
  const { data: likesSchema, error: likesError } = await supabase
    .from('post_likes')
    .select('*')
    .limit(1);
    
  if (likesError) {
    console.log('❌ post_likes表访问失败:', likesError);
  } else {
    console.log('✅ post_likes表可访问');
  }
  
  console.log('');
  console.log('💡 临时解决方案:');
  console.log('1. 在Supabase控制台执行上面的SQL脚本');
  console.log('2. 如果还是有问题，可能需要重新创建post_likes表');
  console.log('3. 前端已经添加了错误处理，可以临时使用');
}

fixDatabaseConstraints().catch(console.error);