# 删除功能修复指南

## 问题描述
控制台报错显示删除操作失败，错误信息为：
```
Failed to load resource: net::ERR_CONNECTION_CLOSED
❌ 删除帖子失败: {message: 'TypeError: Failed to fetch'}
```

## 解决方案

### 步骤 1: 执行数据库权限修复脚本

1. 打开 Supabase 控制台
2. 进入 SQL Editor
3. 复制并执行 `fix-delete-permissions.sql` 文件中的内容

```sql
-- 修复删除功能的 RLS 策略
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 确保 community_posts 表有正确的删除策略
DROP POLICY IF EXISTS "Enable delete for all users" ON community_posts;
CREATE POLICY "Enable delete for all users" ON community_posts
    FOR DELETE USING (true);

-- 2. 确保 resources 表的删除策略
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view resources" ON resources;
DROP POLICY IF EXISTS "Authenticated users can insert resources" ON resources;
DROP POLICY IF EXISTS "Users can update their own resources" ON resources;
DROP POLICY IF EXISTS "Users can delete their own resources" ON resources;

-- 3. 为 resources 表创建宽松的策略（开发环境）
CREATE POLICY "Enable read access for all users" ON resources
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON resources
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON resources
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON resources
    FOR DELETE USING (true);

-- 4. 刷新 schema 缓存
NOTIFY pgrst, 'reload schema';
```

### 步骤 2: 检查环境变量配置

确保项目中 `.env` 文件包含正确的 Supabase 配置：

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 步骤 3: 测试删除权限

在浏览器控制台中运行以下脚本测试删除权限：

```javascript
// 复制 test-delete-permissions.js 的内容到控制台执行
```

### 步骤 4: 如果仍有问题

#### 4.1 检查网络连接
- 确保网络连接正常
- 检查是否有防火墙或代理阻止 Supabase 请求
- 尝试在浏览器中直接访问 Supabase URL

#### 4.2 禁用 RLS（临时解决方案）
如果上述方法仍不工作，可以临时禁用 RLS：

```sql
-- 临时禁用 RLS（仅用于开发环境）
ALTER TABLE community_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE resources DISABLE ROW LEVEL SECURITY;
```

#### 4.3 检查 API Key 权限
确保使用的 API Key 具有删除权限：
1. 登录 Supabase 控制台
2. 进入 Settings > API
3. 确认 anon key 和 service role key 的权限设置

### 步骤 5: 验证修复

1. 重新启动开发服务器
2. 登录应用
3. 进入"我的帖子"或"我的资源"页面
4. 尝试删除一个测试项目

## 常见问题

### Q: 仍然显示网络错误
A: 可能是网络连接问题，尝试：
- 刷新页面重试
- 检查网络连接
- 使用其他网络环境测试

### Q: 显示权限不足
A: 确认 RLS 策略已正确设置，或者临时禁用 RLS

### Q: 删除成功但页面没有更新
A: 这是前端更新问题，刷新页面即可

## 注意事项

- 生产环境应该使用更严格的 RLS 策略
- 建议在生产环境中实现用户只能删除自己的内容
- 定期检查数据库策略的一致性