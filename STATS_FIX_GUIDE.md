# 今日新增统计修复指南

## 问题描述
学习计划和学习资源的"今日新增"统计无法正常显示，即使添加了新数据，计数也没有变化。

## 问题原因
Row Level Security (RLS) 策略限制了管理员查看所有数据的能力，导致统计数据只能看到当前用户创建的记录。

## 解决方案

### 方法一：使用数据库管理功能（推荐）

1. **访问管理设置页面**：
   - 进入后台管理系统
   - 点击左侧导航的"系统设置"

2. **设置统计函数**：
   - 在"数据库管理"部分点击"设置统计函数"按钮
   - 系统会尝试检测并创建必要的 RPC 函数

3. **手动刷新统计**：
   - 点击"手动刷新统计"按钮立即更新数据

### 方法二：手动执行 SQL（如果方法一失败）

1. **打开 Supabase SQL Editor**：
   - 登录 Supabase 控制台
   - 进入项目的 SQL Editor

2. **执行 RPC 函数脚本**：
   ```sql
   -- 复制 admin-stats-rpc.sql 文件中的所有内容
   -- 粘贴到 SQL Editor 中并执行
   ```

3. **验证函数创建**：
   ```sql
   SELECT get_admin_stats();
   ```

### 方法三：临时修复（如果前两种方法都失败）

执行 `quick-stats-fix.sql` 文件中的语句来临时放宽 RLS 限制。

## 验证修复效果

1. **添加测试数据**：
   - 创建一个新的学习计划
   - 添加一个新的学习资源

2. **检查统计显示**：
   - 在管理仪表板中查看"今日新增 +1"
   - 刷新页面确认数据持续显示

## 技术细节

### RPC 函数功能
- `get_user_stats()`: 获取用户总数、今日新增和封禁用户数
- `get_plan_stats()`: 获取学习计划统计
- `get_resource_stats()`: 获取资源统计  
- `get_admin_stats()`: 综合统计函数

### RLS 绕过原理
RPC 函数使用 `SECURITY DEFINER` 权限，可以绕过表的 RLS 策略，返回完整的数据统计。

### 数据查询逻辑
```sql
-- 今日新增的查询逻辑
COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as new_today
```

## 故障排除

### 如果"设置统计函数"显示失败
1. 检查 Supabase 连接是否正常
2. 确认当前用户有管理员权限
3. 手动执行 SQL 脚本

### 如果数据仍然不显示
1. 检查新创建的记录 `created_at` 字段是否正确
2. 确认服务器时区设置
3. 查看浏览器控制台的错误信息

### SQL 调试查询
```sql
-- 检查今日创建的学习计划
SELECT COUNT(*) as new_plans_today 
FROM study_plans 
WHERE created_at >= CURRENT_DATE;

-- 检查今日创建的资源
SELECT COUNT(*) as new_resources_today 
FROM resources 
WHERE created_at >= CURRENT_DATE;
```

## 维护说明

- RPC 函数只需要创建一次
- 如果 Supabase 项目重置，需要重新创建这些函数
- 定期检查统计数据是否正常显示
- 生产环境建议使用服务端密钥而不是匿名密钥