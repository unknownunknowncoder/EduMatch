# 注册失败问题解决指南

## 🔍 常见问题和解决方案

### 问题1: 数据库连接失败

**症状**：
- 显示"注册失败，请稍后重试"
- 控制台有连接错误

**解决方案**：
1. **检查环境配置**：
   ```bash
   # 确保 .env 文件包含正确的 Supabase 配置
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **验证网络连接**：
   - 确保可以访问 Supabase 项目
   - 检查防火墙设置

3. **重启开发服务器**：
   ```bash
   # 停止服务器 (Ctrl+C)
   npm run dev
   ```

### 问题2: 数据库表不存在

**症状**：
- 显示 PGRST204 错误
- 控制台显示关系不存在

**解决方案**：
1. **创建表结构**：
   - 访问 Supabase Dashboard
   - 打开 SQL Editor
   - 执行 `supabase-schema.sql` 文件内容

2. **验证表创建**：
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

### 问题3: RLS 权限问题

**症状**：
- 显示 PGRST301 错误
- 权限被拒绝

**解决方案**：
1. **检查 RLS 策略**：
   ```sql
   -- 查看 RLS 策略
   SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
   FROM pg_policies 
   WHERE tablename = 'users';
   ```

2. **修复权限**：
   ```sql
   -- 暂时禁用 RLS 进行测试
   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
   
   -- 或添加允许插入的策略
   DROP POLICY IF EXISTS "Users can insert" ON users;
   CREATE POLICY "Users can insert" ON users
     FOR INSERT WITH CHECK (true);
   ```

### 问题4: 唯一约束冲突

**症状**：
- 显示 23505 错误
- 用户名或邮箱已存在

**解决方案**：
1. **检查重复用户**：
   ```sql
   SELECT username, email FROM users WHERE username = 'testuser';
   ```

2. **清理测试数据**：
   ```sql
   DELETE FROM users WHERE username LIKE 'test%';
   ```

## 🛠️ 快速诊断步骤

### 步骤1: 运行诊断脚本
在浏览器控制台执行：
```javascript
window.diagnoseRegistration.runDiagnosis()
```

### 步骤2: 运行修复脚本
```javascript
window.fixRegistration.runQuickFix()
```

### 步骤3: 手动测试
1. **访问注册页面**：`http://localhost:3001/register`
2. **填写测试数据**：
   - 用户名：`test_${Date.now()}`
   - 昵称：`诊断用户`
   - 密码：`123456`
   - 确认密码：`123456`
3. **查看控制台**：检查详细错误信息

## 📊 错误代码参考

| 错误代码 | 含义 | 解决方案 |
|---------|------|---------|
| PGRST204 | 关系不存在 | 创建表结构 |
| PGRST301 | RLS 权限问题 | 修复权限策略 |
| PGRST116 | 未找到记录 | 检查查询条件 |
| 23505 | 唯一约束冲突 | 检查重复数据 |
| 42501 | 权限不足 | 检查用户权限 |
| 23514 | 外键约束冲突 | 检查关联数据 |

## 🔧 高级排查

### 1. 检查 Supabase 配置
```javascript
// 在控制台检查配置
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...')
```

### 2. 测试数据库连接
```javascript
// 直接测试 Supabase 连接
import { supabaseService } from '@/services/supabase'

try {
  const client = supabaseService.getClient()
  const { data, error } = await client
    .from('users')
    .select('count')
    .limit(1)
  
  if (error) {
    console.error('连接测试失败:', error)
  } else {
    console.log('✅ 数据库连接正常')
  }
} catch (error) {
  console.error('连接异常:', error)
}
```

### 3. 检查 RLS 策略
```sql
-- 在 Supabase SQL Editor 中执行
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'users';
```

## 🚀 完整修复流程

### 如果所有方法都失败：

1. **重置 Supabase 项目**：
   - 删除现有表
   - 重新执行 `supabase-schema.sql`
   - 重新配置 RLS 策略

2. **检查环境变量**：
   ```bash
   # 重新生成 Anon Key
   # 确保使用正确的项目 URL
   # 重启开发服务器
   ```

3. **使用新的测试账号**：
   - 避免使用已存在的用户名
   - 使用时间戳确保唯一性

4. **查看 Supabase 控制台**：
   - 检查项目的 Request Logs
   - 查看 Authentication 和 Database 部分的错误

## 📞 寻求帮助

如果问题持续存在：

1. **收集错误信息**：
   - 浏览器控制台错误
   - Supabase 控制台日志
   - 网络请求详情

2. **提供环境信息**：
   - 浏览器版本
   - Node.js 版本
   - Supabase 项目配置（隐敏感信息）

3. **检查代码版本**：
   - 确保所有文件已更新
   - 检查是否有语法错误

---

**按照此指南应该能解决大多数注册问题！** 🎉

如果仍然有问题，请提供具体的错误信息以便进一步诊断。