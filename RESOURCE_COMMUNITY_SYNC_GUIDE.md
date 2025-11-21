# 资源创建与学习社区同步调试指南

## 问题说明
用户在"创建资源"页面创建的资源需要同时出现在：
1. "我的资源"（resources表）
2. "学习社区"（community_posts表）

## 实现逻辑

### 1. 双重创建机制
创建资源时执行两个操作：
```javascript
// 创建资源（resources表）
const createdResource = await supabaseService.createResource(resourceData)

// 创建社区帖子（community_posts表）
const createdPost = await supabaseService.createCommunityPost(postData)
```

### 2. 数据映射关系
| 资源字段 | 社区帖子字段 | 说明 |
|-----------|-------------|------|
| title | title | 标题 |
| description | content | 内容 |
| type | category | 分类 |
| user_id | user_id | 用户ID |
| - | likes_count | 点赞数（初始为0） |
| - | views_count | 浏览数（初始为0） |

## 调试步骤

### 1. 运行数据库测试
执行 `test-community-post.sql` 检查：
- RLS策略权限
- 手动插入帖子
- 用户ID验证

### 2. 查看浏览器控制台
创建资源时查看详细日志：
```
✅ 资源创建成功: {id: "...", ...}
🔄 准备创建社区帖子，数据: {user_id: "...", ...}
✅ 社区帖子创建成功: {id: "...", ...}
```

### 3. 检查数据库
在Supabase Dashboard查看：
- resources表：确认新资源存在
- community_posts表：确认新帖子存在

## 可能的问题

### 1. RLS权限问题
如果社区帖子创建失败，检查RLS策略：
```sql
-- 允许认证用户创建帖子
CREATE POLICY "Authenticated users can create posts" ON community_posts
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
```

### 2. 数据类型问题
确保字段类型匹配：
- `user_id`: UUID
- `title`: TEXT/VARCHAR
- `content`: TEXT
- `created_at`: TIMESTAMP

### 3. 异步处理
两个数据库操作是独立的，一个成功不会影响另一个。

## 验证方法

### 1. 前端验证
- 创建资源后检查"我的资源"页面
- 检查"学习社区"页面

### 2. 数据库验证
```sql
-- 检查最新资源
SELECT title, created_by, created_at 
FROM resources 
ORDER BY created_at DESC LIMIT 1;

-- 检查最新帖子
SELECT title, user_id, created_at 
FROM community_posts 
ORDER BY created_at DESC LIMIT 1;
```

## 修复方案

### 方案1：修复RLS策略
如果权限问题，在Supabase SQL Editor执行：
```sql
-- 删除现有策略
DROP POLICY IF EXISTS "Authenticated users can create posts" ON community_posts;

-- 创建新策略
CREATE POLICY "Authenticated users can create posts" ON community_posts
    FOR INSERT WITH CHECK (true);
```

### 方案2：修改数据结构
如果字段类型不匹配：
```sql
ALTER TABLE community_posts 
ALTER COLUMN user_id TYPE UUID USING user_id::UUID;
```

### 方案3：使用触发器自动同步
创建触发器自动在resources插入时创建community_posts：
```sql
CREATE OR REPLACE FUNCTION sync_resource_to_community()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO community_posts (
    user_id, title, content, category, created_at, updated_at
  ) VALUES (
    NEW.created_by, NEW.title, NEW.description, NEW.type, NEW.created_at, NEW.updated_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sync_resource_to_community
    AFTER INSERT ON resources
    FOR EACH ROW EXECUTE FUNCTION sync_resource_to_community();
```

## 测试清单
- [ ] 资源创建成功（无错误）
- [ ] 社区帖子创建成功（无错误）
- [ ] 控制台显示两个成功日志
- [ ] "我的资源"页面显示新资源
- [ ] "学习社区"页面显示新帖子
- [ ] 数据库两个表都有新记录