# 数据库设置指南

## 方法一：手动创建表（推荐）

1. **登录 Supabase 控制台**
   - 打开 https://supabase.com
   - 使用您的账号登录
   - 选择对应的项目

2. **打开 SQL Editor**
   - 在左侧菜单中找到 "SQL Editor"
   - 点击 "New query"

3. **创建表**
   - 复制 `supabase-schema.sql` 文件中的所有内容
   - 粘贴到 SQL Editor 中
   - 点击 "Run" 执行

## 方法二：使用初始化脚本

如果您已经安装了 Node.js 和相关依赖：

```bash
# 安装依赖（如果还没有安装）
npm install @supabase/supabase-js

# 运行初始化脚本
node init-database.js
```

## 方法三：使用 Table Editor 逐个创建表

### 1. 创建 users 表
在 Table Editor 中点击 "Create a new table"，使用以下配置：

| 字段名 | 类型 | 约束 | 备注 |
|--------|------|------|------|
| id | uuid | Primary Key | Default: uuid_generate_v4() |
| username | text | Unique, Not Null | 用户名 |
| email | text | Unique, Not Null | 邮箱 |
| password_hash | text | Not Null | 密码哈希 |
| avatar_url | text | Optional | 头像URL |
| created_at | timestamptz | Default: now() | 创建时间 |
| updated_at | timestamptz | Default: now() | 更新时间 |

### 2. 创建 resources 表
| 字段名 | 类型 | 约束 | 备注 |
|--------|------|------|------|
| id | uuid | Primary Key | Default: uuid_generate_v4() |
| title | text | Not Null | 资源标题 |
| description | text | Optional | 资源描述 |
| type | text | Optional | 资源类型 |
| category | text | Optional | 资源分类 |
| difficulty | text | Optional | 难度等级 |
| rating | numeric | Default: 0 | 评分 |
| duration | text | Optional | 学习时长 |
| provider | text | Optional | 提供者 |
| url | text | Optional | 资源链接 |
| tags | array | Optional | 标签数组 |
| created_by | uuid | Foreign Key → users.id | 创建者 |
| created_at | timestamptz | Default: now() | 创建时间 |
| updated_at | timestamptz | Default: now() | 更新时间 |

### 3. 创建其他表
同样方式创建 `learning_records` 和 `favorites` 表。

## 验证设置

创建完成后，您可以：

1. **检查表是否存在**
   - 在 Table Editor 中查看左侧的表列表
   - 应该看到：users, resources, learning_records, favorites

2. **测试连接**
   - 启动项目：`npm run dev`
   - 打开浏览器访问：http://localhost:3000
   - 检查控制台是否有数据库连接错误

## 常见问题

### Q: 看不到表怎么办？
A: 
1. 确保您有正确的权限
2. 刷新 Supabase 控制台页面
3. 检查 SQL 执行是否有错误信息

### Q: 执行 SQL 时报错？
A:
1. 检查 SQL 语法是否正确
2. 确保表名和字段名没有重复
3. 检查外键引用是否正确

### Q: 连接数据库失败？
A:
1. 检查 .env 文件中的 Supabase URL 和 API Key
2. 确保网络连接正常
3. 检查 Supabase 项目是否激活

## 下一步

数据库设置完成后，您就可以：
1. 在创建资源页面创建学习资源
2. 在个人中心查看"我的资源"
3. 使用搜索功能查找资源
4. 收藏喜欢的资源

如有问题，请查看控制台错误信息或联系技术支持。