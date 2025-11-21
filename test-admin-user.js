import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// 加载环境变量
config({ path: '.env' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAdminUser() {
  console.log('🔍 检查admin用户...')
  
  try {
    // 查询admin用户
    const { data: adminUser, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', 'admin')
      .single()
    
    if (error) {
      console.log('❌ admin用户不存在:', error.message)
      
      // 创建admin用户
      console.log('🚀 正在创建admin用户...')
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          username: 'admin',
          email: 'admin@edumatch.com',
          password_hash: 'admin_password_hash'
        })
        .select()
        .single()
      
      if (createError) {
        console.error('❌ 创建admin用户失败:', createError.message)
      } else {
        console.log('✅ admin用户创建成功:', newUser)
      }
    } else {
      console.log('✅ admin用户存在:', adminUser)
      
      // 查询该用户创建的资源
      const { data: resources, error: resourceError } = await supabase
        .from('resources')
        .select('*')
        .eq('created_by', adminUser.id)
        .order('created_at', { ascending: false })
      
      if (resourceError) {
        console.error('❌ 获取资源失败:', resourceError.message)
      } else {
        console.log(`📊 admin用户创建了 ${resources.length} 个资源:`)
        resources.forEach((resource, index) => {
          console.log(`   ${index + 1}. ${resource.title} (${resource.type}) - ${resource.created_at}`)
        })
      }
    }
  } catch (error) {
    console.error('❌ 测试失败:', error.message)
  }
}

testAdminUser()