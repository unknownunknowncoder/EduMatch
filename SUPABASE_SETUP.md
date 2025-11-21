# Supabase 数据库配置指南

## 🚀 快速开始

### 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com/)
2. 点击 "Sign Up" 注册账号或 "Sign In" 登录
3. 创建新项目：
   - 点击 "New Project"
   - 选择组织
   - 输入项目名称：`edumatch`
   - 设置数据库密码
   - 选择地区（建议选择 Asia Southeast）
   - 点击 "Create new project"

### 2. 获取连接信息

项目创建完成后，在项目设置中获取以下信息：

1. **Project URL**: 
   - 进入 Settings → API
   - 复制 "Project URL" (格式: `https://your-project-id.supabase.co`)

2. **API Key**:
   - 在同一页面找到 "anon public" 密钥
   - 复制该密钥 (格式: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3. 配置环境变量

将获取的信息填入 `.env` 文件：

```env
# Supabase 配置
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. 创建数据库表

在 Supabase 控制台的 SQL Editor 中执行 `supabase-schema.sql` 文件中的SQL语句，或者：

#### 方式一：使用 SQL 文件
1. 打开 `supabase-schema.sql` 文件
2. 复制所有SQL语句
3. 在 Supabase SQL Editor 中粘贴并执行

#### 方式二：使用界面创建
1. 进入 Table Editor
2. 点击 "Create a new table"
3. 手动创建以下表：
   - `users` (用户表)
   - `resources` (学习资源表)
   - `learning_records` (学习记录表)
   - `favorites` (收藏表)

### 5. 安装依赖

```bash
npm install @supabase/supabase-js
```

### 6. 启动项目

```bash
npm run dev
```

## 📊 数据库结构说明

### 用户表 (users)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键，自动生成 |
| username | VARCHAR(50) | 用户名，唯一 |
| email | VARCHAR(100) | 邮箱，唯一 |
| password_hash | VARCHAR(255) | 密码哈希值 |
| avatar_url | VARCHAR(255) | 头像URL |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 学习资源表 (resources)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键，自动生成 |
| title | VARCHAR(255) | 资源标题 |
| description | TEXT | 资源描述 |
| category | VARCHAR(100) | 资源分类 |
| difficulty | VARCHAR(20) | 难度等级 |
| rating | DECIMAL(3,2) | 评分 (0-5) |
| duration | VARCHAR(50) | 学习时长 |
| provider | VARCHAR(100) | 提供者 |
| url | VARCHAR(255) | 资源链接 |
| created_by | UUID | 创建者ID |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 学习记录表 (learning_records)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键，自动生成 |
| user_id | UUID | 用户ID |
| resource_id | UUID | 资源ID |
| progress | DECIMAL(5,2) | 学习进度 (0-100) |
| completed_at | TIMESTAMP | 完成时间 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 收藏表 (favorites)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键，自动生成 |
| user_id | UUID | 用户ID |
| resource_id | UUID | 资源ID |
| created_at | TIMESTAMP | 创建时间 |

## 🔧 使用示例

### 在组件中使用

```vue
<script setup lang="ts">
import { useDatabaseStore } from '@/stores/database'
import { supabaseService } from '@/services/supabase'

const dbStore = useDatabaseStore()

// 获取资源列表
const fetchResources = async () => {
  try {
    const resources = await dbStore.getResources({
      limit: 10,
      category: '前端开发',
      difficulty: 'beginner'
    })
    console.log('资源列表:', resources)
  } catch (error) {
    console.error('获取失败:', error)
  }
}

// 添加学习记录
const addLearningRecord = async (userId: string, resourceId: string) => {
  try {
    const record = await dbStore.addLearningRecord(userId, resourceId)
    console.log('学习记录已添加:', record)
  } catch (error) {
    console.error('添加失败:', error)
  }
}

// 获取用户收藏
const getUserFavorites = async (userId: string) => {
  try {
    const favorites = await dbStore.getFavorites(userId)
    console.log('收藏列表:', favorites)
  } catch (error) {
    console.error('获取失败:', error)
  }
}
</script>
```

### 直接使用 Supabase 服务

```typescript
import { supabaseService } from '@/services/supabase'

// 创建新资源
const createResource = async () => {
  const newResource = await supabaseService.createResource({
    title: 'Vue 3 高级教程',
    description: '深入学习 Vue 3 的高级特性',
    category: '前端开发',
    difficulty: 'advanced',
    rating: 4.8,
    duration: '3小时',
    provider: 'EduMatch'
  })
  return newResource
}

// 搜索资源
const searchResources = async (keyword: string) => {
  const results = await supabaseService.getResources({
    search: keyword,
    limit: 20
  })
  return results
}
```

## 🔍 监控和调试

### 1. 查看连接状态
项目右上角会显示数据库连接状态：
- 🟢 绿色：已连接
- 🟡 黄色：连接中
- ⚪ 灰色：未连接
- 🔴 红色：连接错误

### 2. 测试连接
可以使用 `SupabaseDemo.vue` 组件测试连接和数据操作：

```vue
<!-- 在某个页面中使用 -->
<SupabaseDemo />
```

### 3. 查看请求日志
在浏览器控制台中可以查看：
- 数据库连接日志
- 查询执行日志
- 错误信息

## 🛠️ 常见问题

### 1. 连接失败
**问题**: 连接状态显示错误
**解决**:
- 检查 `.env` 文件中的 URL 和 API Key
- 确认 Supabase 项目是否正常启动
- 检查网络连接

### 2. 权限错误 (PGRST116)
**问题**: 查询返回空结果
**解决**:
- 检查 RLS 策略是否正确设置
- 确认用户认证状态
- 检查数据表是否存在

### 3. 表不存在错误
**问题**: 提示表不存在
**解决**:
- 执行 `supabase-schema.sql` 中的建表语句
- 检查表名拼写是否正确

### 4. CORS 错误
**问题**: 浏览器控制台显示 CORS 错误
**解决**:
- 在 Supabase Settings → API 中添加你的域名到 CORS 白名单

## 📚 更多资源

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase JavaScript 客户端文档](https://supabase.com/docs/reference/javascript)
- [Supabase 认证指南](https://supabase.com/docs/guides/auth)

## 🎯 下一步

1. **实现用户认证**: 使用 Supabase Auth
2. **文件上传**: 使用 Supabase Storage
3. **实时功能**: 使用 Supabase Realtime
4. **数据库备份**: 定期备份数据库