// 修复注册问题的数据库策略更新脚本
// 在 Supabase SQL Editor 中执行以下 SQL 语句

const fixRegistrationPolicies = `
-- 修复用户注册的 RLS 策略
-- 删除现有的用户表策略（因为它们阻止了新用户注册）
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

-- 创建新的策略，允许：
-- 1. 所有人（包括未认证用户）可以插入新用户（注册功能）
-- 2. 认证用户可以查看和更新自己的资料

CREATE POLICY "Allow public user registration" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text OR auth.uid() IS NULL);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- 可选：为了更好的安全性，可以限制注册时的必填字段
CREATE POLICY "Allow public user registration with required fields" ON users
    FOR INSERT WITH CHECK (
        username IS NOT NULL AND 
        email IS NOT NULL AND 
        password_hash IS NOT NULL
    );
`

console.log('请在 Supabase SQL Editor 中执行以下 SQL 来修复注册问题：')
console.log(fixRegistrationPolicies)

// 测试注册功能
async function testRegistration() {
  console.log('\n正在测试注册功能...')
  
  // 模拟注册数据
  const testUser = {
    username: 'testuser_' + Date.now(),
    email: \`test_\${Date.now()}@example.com\`,
    nickname: '测试用户',
    password_hash: 'test_hash_123'
  }
  
  console.log('测试用户数据:', testUser)
  
  try {
    // 这里应该调用实际的注册逻辑
    console.log('请手动测试注册功能，使用以下数据:')
    console.log('- 用户名:', testUser.username)
    console.log('- 密码: password123')
    console.log('- 确认密码: password123')
    console.log('- 昵称:', testUser.nickname)
  } catch (error) {
    console.error('测试失败:', error)
  }
}

// 生成详细的修复指南
const fixGuide = `
## 修复注册问题的步骤

### 问题原因
Supabase 数据库中的用户表启用了 RLS（Row Level Security），但缺少允许新用户注册的策略。

### 解决方案

1. **登录 Supabase Dashboard**
   - 访问 https://supabase.com/dashboard
   - 登录并选择你的项目

2. **打开 SQL Editor**
   - 在左侧导航栏中找到 "SQL Editor"
   - 点击 "New query" 创建新查询

3. **执行修复 SQL**
   - 复制下面的 SQL 语句并粘贴到编辑器中：
   \`\`\`sql
   -- 删除现有的用户表策略
   DROP POLICY IF EXISTS "Users can view their own profile" ON users;
   DROP POLICY IF EXISTS "Users can update their own profile" ON users;
   
   -- 创建新的注册策略
   CREATE POLICY "Allow public user registration" ON users
       FOR INSERT WITH CHECK (true);
   
   -- 重新创建查看和更新策略
   CREATE POLICY "Users can view their own profile" ON users
       FOR SELECT USING (auth.uid()::text = id::text OR auth.uid() IS NULL);
   
   CREATE POLICY "Users can update their own profile" ON users
       FOR UPDATE USING (auth.uid()::text = id::text);
   \`\`\`
   - 点击 "RUN" 执行

4. **验证修复**
   - 执行完毕后，尝试注册新用户
   - 注册应该能够成功

### 验证 SQL
如果需要验证策略是否正确应用，可以运行：
\`\`\`sql
-- 查看用户表的所有策略
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users';
\`\`\`

### 如果仍然有问题
1. 检查 Supabase 连接配置
2. 确认数据库表结构是否正确
3. 查看浏览器控制台的详细错误信息
4. 确认网络连接正常
`

console.log(fixGuide)

export { fixRegistrationPolicies, testRegistration, fixGuide }