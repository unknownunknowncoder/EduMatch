import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// 加载环境变量
config({ path: '.env' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('🔍 检查 Supabase 配置...')
console.log('URL:', supabaseUrl ? '✅ 已配置' : '❌ 未配置')
console.log('Key:', supabaseAnonKey ? '✅ 已配置' : '❌ 未配置')

if (supabaseUrl && supabaseAnonKey) {
  console.log('🚀 测试数据库连接...')
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  supabase.from('users').select('count').then(({ data, error }) => {
    if (error) {
      console.log('❌ 表不存在或权限问题:', error.message)
      console.log('\n💡 请按照 DATABASE_SETUP_MANUAL.md 中的指南创建数据库表')
    } else {
      console.log('✅ 数据库连接正常')
      console.log('📊 用户表存在，数据:', data)
    }
  }).catch(err => {
    console.log('❌ 连接失败:', err.message)
  })
} else {
  console.log('❌ 请在 .env 文件中配置 Supabase 连接信息')
}