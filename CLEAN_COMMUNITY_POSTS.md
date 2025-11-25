# 清理社区测试帖子指南

## 问题描述
社区页面中的测试帖子需要清理，但由于Supabase的RLS策略，JavaScript删除操作可能无法完全生效。

## 解决方案

### 🎯 推荐方案：使用Supabase SQL Editor

1. **登录Supabase Dashboard**
   - 打开 https://supabase.com/dashboard
   - 登录您的账户
   - 选择项目 "aonlahundnkxuyxfsmcy"

2. **进入SQL Editor**
   - 在左侧菜单中找到 "SQL Editor"
   - 点击 "New query"

3. **执行清理命令**
   复制以下SQL命令并执行：

   ```sql
   -- 临时禁用RLS策略以允许删除
   ALTER TABLE community_posts DISABLE ROW LEVEL SECURITY;

   -- 删除所有数据
   DELETE FROM community_posts;

   -- 重新启用RLS策略
   ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
   ```

4. **验证清理结果**
   ```sql
   -- 检查剩余帖子数量
   SELECT COUNT(*) as remaining_posts FROM community_posts;
   
   -- 显示剩余帖子（应该为空）
   SELECT * FROM community_posts;
   ```

### 🔄 备选方案：逐条删除

如果上述方法不工作，可以逐条删除：

```sql
-- 删除特定ID的帖子
DELETE FROM community_posts WHERE id = 'bbd530e2-1121-4903-9a8f-008383d6fa9e';
DELETE FROM community_posts WHERE id = '1c4c1873-41cb-4dbd-bfb2-acb49edcd5b3';
DELETE FROM community_posts WHERE id = 'ae4c66a5-f107-4b42-846b-e765b4b8cb07';
DELETE FROM community_posts WHERE id = '174bbef3-a5ec-44f9-bfc0-60aaa14d0e21';
DELETE FROM community_posts WHERE id = 'ab796fda-e5bb-4203-8eec-17c3bc982372';
DELETE FROM community_posts WHERE id = '2e496094-dd07-4247-9f90-87fa186bf28f';
```

### ⚡ 快速方案：完全重置表

如果所有方法都不工作，可以完全重建表：

```sql
-- 删除整个表
DROP TABLE IF EXISTS community_posts CASCADE;

-- 重新创建表（需要运行创建表的脚本）
-- 请参考 create-community-posts-table.sql 文件内容
```

## 🧹 验证清理

清理完成后，访问社区页面验证：
- 网址：`http://localhost:3005/community`
- 应该显示："暂无社区帖子"

## 📋 当前测试帖子列表

以下是当前存在的测试帖子：

1. **测试帖子** (ID: bbd530e2-1121-4903-9a8f-008383d6fa9e)
   - 作者：测试用户
   - 创建时间：2025-11-21T03:31:10.978558+00:00

2. **1** (ID: 1c4c1873-41cb-4dbd-bfb2-acb49edcd5b3)
   - 作者：管理员
   - 创建时间：2025-11-21T02:14:01.125+00:00

3. **Vue 3 学习心得分享** (ID: ae4c66a5-f107-4b42-846b-e765b4b8cb07)
   - 作者：Vue学习者
   - 标签：前端开发, Vue3, 学习经验

4. **TypeScript 类型体操入门指南** (ID: 174bbef3-a5ec-44f9-bfc0-60aaa14d0e21)
   - 作者：TS爱好者
   - 标签：TypeScript, 前端开发, 教程

5. **算法学习路线推荐** (ID: ab796fda-e5bb-4203-8eec-17c3bc982372)
   - 作者：算法小白
   - 标签：算法, 学习路线, 数据结构

6. **从零开始搭建 Node.js 项目的经验** (ID: 2e496094-dd07-4247-9f90-87fa186bf28f)
   - 作者：后端新手
   - 标签：Node.js, 后端开发, 项目经验

## ⚠️ 注意事项

1. **数据备份**：删除操作不可逆，请确认这些是测试数据
2. **RLS策略**：删除完成后记得重新启用RLS策略
3. **权限问题**：如果遇到权限错误，可能需要使用Service Role Key
4. **缓存延迟**：删除后可能需要刷新浏览器缓存才能看到效果

## 🎉 清理完成后的效果

清理完成后，社区页面将显示：
- "暂无社区帖子"
- "快来发表你的第一个学习经验吧！"
- 用户可以通过"发表我的经验"按钮创建真实帖子

## 🔧 故障排除

如果清理后仍然能看到帖子：

1. **刷新浏览器**：按 Ctrl+F5 强制刷新
2. **清除缓存**：清除浏览器缓存和本地存储
3. **检查连接**：确认前端连接的是正确的Supabase项目
4. **查看控制台**：检查是否有JavaScript错误

---

**文件位置**：
- SQL脚本：`clean-community-sql.sql`
- 清理工具：`clean-posts-safe.js`
- 说明文档：`CLEAN_COMMUNITY_POSTS.md`