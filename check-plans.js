import { createClient } from '@supabase/supabase-js'

// 从环境变量或配置中获取
const supabaseUrl = 'https://qizofqgkwzfpplbpjagi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpem9mcWt3emZwcGxicGphZ2kiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczMjA3MTAzOSwiZXhwIjoyMDQ3NjQ3MDM5fQ.nM_Ypqn-y-h5pC2VFcYtUhGWt_abA9jD85W_kAKSFKE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkStudyPlans() {
  try {
    console.log('🔍 检查数据库中的学习计划...')
    
    // 检查表是否存在
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'study_plans')
    
    if (tablesError) {
      console.log('⚠️ 无法检查表是否存在，尝试直接查询...')
    }
    
    // 尝试查询学习计划
    const { data, error } = await supabase
      .from('study_plans')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ 查询失败:', error)
      return
    }
    
    if (data && data.length > 0) {
      console.log(`✅ 找到 ${data.length} 个学习计划:`)
      data.forEach((plan, index) => {
        console.log(`\n📚 计划 ${index + 1}:`)
        console.log(`   ID: ${plan.id}`)
        console.log(`   标题: ${plan.title}`)
        console.log(`   描述: ${plan.description || '无描述'}`)
        console.log(`   状态: ${plan.status}`)
        console.log(`   进度: ${plan.progress}%`)
        console.log(`   开始日期: ${plan.start_date}`)
        console.log(`   目标日期: ${plan.target_date}`)
        console.log(`   每日时长: ${plan.daily_hours}小时`)
        console.log(`   资源名称: ${plan.resource_name || '无'}`)
        console.log(`   资源链接: ${plan.resource_url || '无'}`)
        console.log(`   创建时间: ${plan.created_at}`)
      })
    } else {
      console.log('📭 数据库中没有学习计划')
    }
    
  } catch (error) {
    console.error('❌ 检查失败:', error)
  }
}

checkStudyPlans()