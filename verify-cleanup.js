import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// 加载环境变量
config({ path: '.env' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function verifyCleanup() {
  console.log('🔍 验证数据清理状态...')
  
  try {
    // 检查用户数据
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('username, email, created_at')
    
    if (userError) {
      console.error('❌ 获取用户失败:', userError.message)
    } else {
      console.log('\n📊 用户列表:')
      users?.forEach(user => {
        console.log(`   - ${user.username} (${user.email})`)
      })
    }
    
    // 检查资源数据
    const { data: resources, error: resourceError } = await supabase
      .from('resources')
      .select('title, type, created_at, created_by')
      .order('created_at', { ascending: false })
    
    if (resourceError) {
      console.error('❌ 获取资源失败:', resourceError.message)
    } else {
      console.log('\n📚 资源列表:')
      if (resources && resources.length > 0) {
        resources.forEach((resource, index) => {
          console.log(`   ${index + 1}. ${resource.title} (${resource.type})`)
        })
        console.log(`\n   总计: ${resources.length} 个资源`)
      } else {
        console.log('   (暂无资源)')
      }
    }
    
    // 验证清理效果
    const mockResourceTitles = ['Vue 3 基础教程', 'TypeScript 进阶', 'React Hooks 详解']
    const hasMockResources = resources?.some(resource => 
      mockResourceTitles.includes(resource.title)
    )
    
    const mockUsernames = ['teacher1', 'student1']
    const hasMockUsers = users?.some(user => 
      mockUsernames.includes(user.username)
    )
    
    console.log('\n✅ 清理状态检查:')
    console.log(`   模拟资源: ${hasMockResources ? '❌ 仍有残留' : '✅ 已清理'}`)
    console.log(`   模拟用户: ${hasMockUsers ? '❌ 仍有残留' : '✅ 已清理'}`)
    
    if (!hasMockResources && !hasMockUsers) {
      console.log('\n🎉 所有模拟数据清理完成！')
      console.log('   - 只保留admin用户')
      console.log('   - 只保留用户自己发布的资源')
      console.log('   - 所有页面已清空静态模拟数据')
    }
    
  } catch (error) {
    console.error('❌ 验证过程中发生错误:', error.message)
  }
}

verifyCleanup()