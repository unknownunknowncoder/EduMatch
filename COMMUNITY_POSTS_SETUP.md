# 社区帖子表设置指南

## 概述

本文档介绍如何在 Supabase 数据库中创建和配置 `community_posts` 表，用于保存用户发布的帖子，包括标题、内容和标签。

## 功能特性

- ✅ 支持帖子标题、内容、分类标签
- ✅ 标签数组存储和索引优化
- ✅ 点赞、浏览量、评论数统计
- ✅ 全文搜索和标签搜索
- ✅ 行级安全策略 (RLS)
- ✅ 自动触发器更新统计数据
- ✅ 热门标签统计功能

## 数据库结构

### community_posts 表结构

| 字段名 | 类型 | 说明 | 默认值 |
|--------|------|------|--------|
| id | UUID | 主键 | uuid_generate_v4() |
| user_id | UUID | 用户ID (外键) | - |
| title | VARCHAR(255) | 帖子标题 | - |
| content | TEXT | 帖子内容 | - |
| category | VARCHAR(100) | 分类 | - |
| tags | TEXT[] | 标签数组 | '{}' |
| author | VARCHAR(100) | 作者昵称 | '匿名用户' |
| likes_count | INTEGER | 点赞数 | 0 |
| views_count | INTEGER | 浏览量 | 0 |
| comments_count | INTEGER | 评论数 | 0 |
| created_at | TIMESTAMPTZ | 创建时间 | CURRENT_TIMESTAMP |
| updated_at | TIMESTAMPTZ | 更新时间 | CURRENT_TIMESTAMP |

## 设置步骤

### 方法一：直接执行 SQL 文件

1. **执行 SQL 脚本**
   ```bash
   # 运行设置脚本
   node setup-community-posts.js
   ```

2. **复制 SQL 到 Supabase**
   - 打开 Supabase Dashboard
   - 进入 SQL Editor
   - 复制脚本输出的 SQL 内容
   - 执行 SQL

### 方法二：手动执行 SQL

1. **打开 Supabase SQL Editor**
   - 访问 [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - 选择你的项目
   - 进入 SQL Editor

2. **执行 SQL 文件**
   ```sql
   -- 文件: create-community-posts-table.sql
   -- 直接复制该文件内容到 SQL Editor 中执行
   ```

## 验证设置

### 1. 检查表结构
```sql
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'community_posts' 
ORDER BY ordinal_position;
```

### 2. 检查示例数据
```sql
SELECT * FROM community_posts LIMIT 5;
```

### 3. 测试搜索功能
```sql
-- 按标签搜索
SELECT * FROM search_posts_by_tags(ARRAY['Vue3', '前端开发']);

-- 全文搜索
SELECT * FROM search_community_posts('Vue');

-- 获取热门标签
SELECT * FROM get_popular_tags(10);
```

## 前端集成

### 1. 数据库服务配置

更新 `src/services/database.ts` 已包含以下方法：

- `createCommunityPost()` - 创建帖子
- `getCommunityPosts()` - 获取帖子列表
- `getPopularTags()` - 获取热门标签

### 2. 组件使用示例

```vue
<script setup>
import { dbService } from '@/services/database'

// 创建帖子
const createPost = async (postData) => {
  try {
    const result = await dbService.createCommunityPost({
      title: postData.title,
      content: postData.content,
      tags: postData.tags,
      category: postData.tags.join(', ')
    })
    console.log('帖子创建成功:', result)
  } catch (error) {
    console.error('创建失败:', error)
  }
}

// 获取帖子列表
const loadPosts = async () => {
  const posts = await dbService.getCommunityPosts({
    limit: 10,
    sortBy: 'latest'
  })
  return posts
}
</script>
```

## 安全策略

### RLS 策略配置

1. **查看策略** - 允许任何人查看帖子
2. **创建策略** - 仅认证用户可创建帖子
3. **更新策略** - 仅作者可更新自己的帖子
4. **删除策略** - 仅作者可删除自己的帖子

## 性能优化

### 索引配置

- `idx_community_posts_tags` - GIN 索引优化标签搜索
- `idx_community_posts_comments_count` - 评论数排序索引
- `idx_community_posts_created_at` - 时间排序索引

### 查询优化

- 使用 GIN 索引加速标签搜索
- 触发器自动更新统计计数
- 分页查询避免大数据量加载

## 故障排除

### 常见问题

1. **表不存在**
   ```sql
   -- 检查表是否存在
   SELECT * FROM information_schema.tables WHERE table_name = 'community_posts';
   ```

2. **权限问题**
   ```sql
   -- 检查 RLS 策略
   SELECT * FROM pg_policies WHERE tablename = 'community_posts';
   ```

3. **标签搜索不工作**
   ```sql
   -- 检查 GIN 索引
   SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'community_posts';
   ```

## 扩展功能

### 未来可添加的功能

1. **图片上传支持** - 添加图片字段
2. **投票系统** - 帖子投票功能
3. **收藏功能** - 帖子收藏
4. **审核机制** - 帖子审核流程
5. **推荐算法** - 基于用户行为的推荐

## 维护说明

### 定期维护

1. **清理旧数据** - 定期清理过期帖子
2. **索引重建** - 重建性能下降的索引
3. **统计更新** - 更新热门标签统计
4. **备份检查** - 确保数据备份正常

---

📝 **注意**: 在生产环境中，请确保：
- 配置正确的 RLS 策略
- 设置适当的资源限制
- 定期备份重要数据
- 监控数据库性能指标