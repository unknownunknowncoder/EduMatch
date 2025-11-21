// 修复用户ID匹配问题
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('缺少 Supabase 配置')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function main() {
  console.log('检查用户ID匹配问题...')
  
  // 获取第一个用户
  const { data: users } = await supabase
    .from('users')
    .select('id, username')
    .limit(1)
  
  if (!users || users.length === 0) {
    console.error('数据库中没有用户')
    return
  }
  
  const user = users[0]
  console.log('数据库用户:', user)
  
  console.log('\n在浏览器控制台执行:')
  console.log(`localStorage.setItem("currentUser", JSON.stringify({"id":"${user.id}","username":"${user.username}","nickname":"${user.username}"}))`)
  
  // 测试
  const testPlan = {
    user_id: user.id,
    title: 'ID修复测试',
    description: '测试',
    progress: 0,
    status: 'in_progress',
    start_date: '2024-01-01',
    target_date: '2024-12-31',
    daily_hours: 2.5,
    resource_name: '测试',
    resource_url: 'https://test.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  const { data, error } = await supabase
    .from('study_plans')
    .insert([testPlan])
    .select()
  
  if (error) {
    console.error('插入失败:', error.message)
  } else {
    console.log('插入成功!')
    // 清理
    await supabase.from('study_plans').delete().eq('title', 'ID修复测试')
  }
}

main()