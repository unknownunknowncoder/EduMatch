import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// 加载环境变量
config({ path: '.env' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function cleanMockData() {
  console.log('🧹 开始清理模拟数据...')
  
  try {
    // 删除初始示例资源
    const { error: deleteError } = await supabase
      .from('resources')
      .delete()
      .in('title', ['Vue 3 基础教程', 'TypeScript 进阶', 'React Hooks 详解'])
    
    if (deleteError) {
      console.error('❌ 删除模拟资源失败:', deleteError.message)
    } else {
      console.log('✅ 已删除模拟资源')
    }
    
    // 删除模拟用户（除了admin用户）
    const { error: deleteUsersError } = await supabase
      .from('users')
      .delete()
      .neq('username', 'admin')
    
    if (deleteUsersError) {
      console.error('❌ 删除模拟用户失败:', deleteUsersError.message)
    } else {
      console.log('✅ 已删除模拟用户')
    }
    
    // 查看清理后的数据
    console.log('\n📊 清理后的数据状态:')
    
    // 查看用户
    const { data: users } = await supabase
      .from('users')
      .select('username, email, created_at')
    
    console.log('用户列表:')
    users?.forEach(user => {
      console.log(`   - ${user.username} (${user.email}) - ${user.created_at}`)
    })
    
    // 查看资源
    const { data: resources } = await supabase
      .from('resources')
      .select('title, type, created_at')
      .order('created_at', { ascending: false })
    
    console.log('\n资源列表:')
    if (resources && resources.length > 0) {
      resources.forEach((resource, index) => {
        console.log(`   ${index + 1}. ${resource.title} (${resource.type}) - ${resource.created_at}`)
      })
    } else {
      console.log('   (暂无资源)')
    }
    
    console.log('\n🎉 模拟数据清理完成！')
    
  } catch (error) {
    console.error('❌ 清理过程中发生错误:', error.message)
  }
}

cleanMockData()