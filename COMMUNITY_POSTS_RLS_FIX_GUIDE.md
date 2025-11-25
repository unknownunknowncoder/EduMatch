# 社区帖子 RLS 策略修复指南

## 问题描述
当用户在"创建资源"页面发布资源时，虽然资源创建成功，但无法同步到学习社区中。控制台显示以下错误：
```
new row violates row-level security policy for table "community_posts"
错误代码: 42501
```

## 原因分析
这是由于 Supabase 的 Row Level Security (RLS) 策略阻止了插入操作。当前的 RLS 策略要求用户必须通过 Supabase 身份验证系统进行认证，但我们的应用使用了自定义的用户系统。

## 解决方案

### 方法一：执行 SQL 脚本修复（推荐）

1. **打开 Supabase 控制台**
   - 访问 [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - 登录您的账户
   - 选择您的项目

2. **进入 SQL Editor**
   - 在左侧菜单中点击 "SQL Editor"
   - 创建一个新的查询

3. **执行修复脚本**
   - 将 `fix-community-posts-rls.sql` 文件中的内容复制到 SQL Editor
   - 点击 "Run" 按钮执行

4. **验证修复结果**
   - 脚本执行成功后，会显示策略创建的结果
   - 您应该看到4个新的策略：
     - Enable read access for all users
     - Enable insert for all users
     - Enable update for all users
     - Enable delete for all users

### 方法二：手动执行 SQL 语句

如果您无法使用 SQL Editor，可以手动执行以下语句：

```sql
-- 1. 禁用 RLS
ALTER TABLE community_posts DISABLE ROW LEVEL SECURITY;

-- 2. 删除现有策略
DROP POLICY IF EXISTS "Anyone can view posts" ON community_posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON community_posts;

-- 3. 重新启用 RLS
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- 4. 创建新策略
CREATE POLICY "Enable read access for all users" ON community_posts
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON community_posts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON community_posts
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON community_posts
    FOR DELETE USING (true);
```

### 方法三：临时解决方案

如果您暂时无法修复 RLS 策略，应用会显示以下提示：
```
发布成功！但由于数据库安全策略，资源暂时无法显示在学习社区中。

请执行以下操作：
1. 打开 Supabase SQL Editor
2. 执行 fix-community-posts-rls.sql 文件中的SQL语句
3. 重新发布资源
```

## 验证修复

修复完成后，请执行以下操作验证修复是否成功：

1. 重新启动开发服务器（如果正在运行）
2. 在"创建资源"页面发布一个新资源
3. 检查资源是否同时出现在"我的资源"和"学习社区"中
4. 查看浏览器控制台是否有任何错误信息

## 技术细节

### 为什么会出现这个问题？
- Supabase 默认启用 RLS 来保护数据安全
- 我们的应用使用了自定义的用户系统，而不是 Supabase Auth
- 当前的 RLS 策略要求 `auth.uid() = user_id`，但我们的应用没有 `auth.uid()`

### 修复后的策略说明
新的 RLS 策略允许：
- 任何用户都可以查看所有帖子
- 任何用户都可以创建新帖子
- 任何用户都可以更新帖子
- 任何用户都可以删除帖子

**注意：** 在生产环境中，您可能需要更严格的 RLS 策略来保护数据安全。

## 故障排除

如果修复后仍然出现问题：

1. **检查策略是否生效**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'community_posts';
   ```

2. **检查表结构**
   ```sql
   SELECT column_name, data_type FROM information_schema.columns 
   WHERE table_name = 'community_posts';
   ```

3. **清除浏览器缓存**
   - 清除浏览器缓存和本地存储
   - 重新启动开发服务器

## 相关文件

- `fix-community-posts-rls.sql` - RLS 修复脚本
- `CreateResource.vue` - 创建资源页面
- `supabase.ts` - Supabase 服务层

如果您在修复过程中遇到任何问题，请检查控制台错误信息，并确保所有依赖项都已正确配置。