# 修复 Nickname 列问题完整指南

## 问题描述
注册时出现 PGRST204 错误：`Could not find the 'nickname' column of 'users' in the schema cache`

## 临时解决方案（已应用）

我已经修改了代码，暂时移除了 `nickname` 字段的传递：

### 1. 修改了注册页面 (`RegisterPage.vue`)
- 注释掉了 nickname 字段的传递
- 保留表单显示，但数据不传递到数据库

### 2. 修改了 Supabase 服务 (`supabase.ts`)
- 添加了字段过滤，避免传递 undefined 字段
- nickname 参数保持可选状态

## 现在可以测试

现在尝试注册应该能够成功，因为不再传递有问题的 `nickname` 字段。

## 永久解决方案

要完全解决 `nickname` 列问题，请在 Supabase Dashboard 中执行：

### 步骤 1：在 SQL Editor 中执行
```sql
-- 确保 nickname 列存在
ALTER TABLE users ADD COLUMN IF NOT EXISTS nickname VARCHAR(100);

-- 更新现有记录
UPDATE users 
SET nickname = COALESCE(nickname, username) 
WHERE nickname IS NULL OR nickname = '';

-- 刷新 PostgREST 缓存（重要）
NOTIFY pgrst, 'reload schema';
```

### 步骤 2：重启 Supabase 项目
如果问题持续，在 Supabase Dashboard 中重启项目：
1. 进入项目设置
2. 点击 "Restart project"
3. 等待重启完成

### 步骤 3：重新启用 nickname 字段
确认问题解决后，可以恢复 nickname 功能：

在 `RegisterPage.vue` 中取消注释：
```javascript
const newUser = await dbStore.createUser({
  username: formData.username,
  email: `${formData.username}@edumatch.local`,
  nickname: formData.nickname || formData.username, // 取消注释
  password_hash: passwordHash
})
```

## 诊断工具

如果问题仍然存在，运行诊断脚本：
1. 在浏览器控制台中执行诊断脚本
2. 检查具体的错误信息
3. 根据诊断结果应用相应修复

## 当前状态

✅ 临时修复已应用
⏳ 等待数据库修复
🔄 可以测试基本注册功能

现在你应该能够成功注册新用户了！