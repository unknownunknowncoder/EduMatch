// 从数据库加载学习计划 - 完整修复版本
const loadDatabasePlans = async () => {
  try {
    console.log('🔄 从数据库加载学习计划...')
    
    // 直接使用 Supabase 客户端，确保认证状态一致
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Supabase 配置缺失')
      successMessage.value = '应用配置错误'
      showSuccessMessage.value = true
      setTimeout(() => { showSuccessMessage.value = false }, 3000)
      return
    }
    
    const client = createClient(supabaseUrl, supabaseKey)
    
    // 获取认证用户信息
    const { data: { user }, error: authError } = await client.auth.getUser()
    if (authError || !user) {
      console.error('❌ 用户认证失败:', authError)
      console.log('⚠️ 用户未登录，显示空学习计划列表')
      currentPlans.value = []
      updateStats()
      return
    }
    
    console.log('✅ 获取到认证用户:', { id: user.id, email: user.email })
    
    // 测试表访问权限
    const { data: testAccess, error: accessError } = await client
      .from('study_plans')
      .select('id')
      .limit(1)
    
    if (accessError) {
      console.error('❌ 表访问权限错误:', accessError)
      successMessage.value = '数据库权限不足，请联系管理员'
      showSuccessMessage.value = true
      setTimeout(() => { showSuccessMessage.value = false }, 5000)
      return
    }
    
    // 加载用户的学习计划数据
    const { data: plansData, error: plansError } = await client
      .from('study_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (plansError) {
      console.error('❌ 数据库加载失败:', plansError)
      successMessage.value = '数据库加载失败，请刷新页面重试'
      showSuccessMessage.value = true
      setTimeout(() => { showSuccessMessage.value = false }, 3000)
      return
    }
    
    if (plansData && plansData.length > 0) {
      console.log(`📚 找到 ${plansData.length} 个学习计划，正在加载打卡记录...`)
      
      // 为每个学习计划加载打卡记录
      const plansWithCheckins = await Promise.all(
        plansData.map(async (plan: any) => {
          try {
            // 重新使用相同的客户端确保认证状态一致
            const { data: checkinsData, error: checkinsError } = await client
              .from('study_plan_checkins')
              .select('*')
              .eq('study_plan_id', plan.id)
              .order('checkin_date', { ascending: false })
            
            if (checkinsError) {
              console.warn('⚠️ 加载打卡记录失败:', checkinsError)
              return {
                ...plan,
                checkinCount: 0,
                checkins: [],
                isTodayChecked: false,
                remainingDays: 0,
                progress: plan.progress || 0
              }
            }
            
            // 计算打卡统计
            const checkinCount = checkinsData?.length || 0
            const today = new Date().toISOString().split('T')[0]
            const isTodayChecked = checkinsData?.some((checkin: any) => 
              checkin.checkin_date === today
            ) || false
            
            // 计算剩余天数和进度
            const targetDate = new Date(plan.target_date)
            const todayDate = new Date()
            const remainingDays = Math.max(0, Math.ceil((targetDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24)))
            const progress = plan.progress || 0
            
            console.log(`📈 学习计划 "${plan.title}": ${checkinCount}次打卡，进度${progress}%`)
            
            return {
              ...plan,
              checkinCount,
              checkins: checkinsData || [],
              isTodayChecked,
              remainingDays,
              progress
            }
          } catch (error) {
            console.error(`❌ 处理学习计划 ${plan.id} 时出错:`, error)
            return {
              ...plan,
              checkinCount: 0,
              checkins: [],
              isTodayChecked: false,
              remainingDays: 0,
              progress: plan.progress || 0
            }
          }
        })
      )
      
      console.log(`✅ 成功加载 ${plansWithCheckins.length} 个学习计划（含打卡记录）`)
      currentPlans.value = plansWithCheckins
    } else {
      console.log('ℹ️ 用户没有创建任何学习计划')
      currentPlans.value = []
    }
    
  } catch (error) {
    console.error('❌ 加载学习计划时出错:', error)
    successMessage.value = '加载学习计划失败，请刷新页面重试'
    showSuccessMessage.value = true
    setTimeout(() => { showSuccessMessage.value = false }, 5000)
    currentPlans.value = []
  } finally {
    updateStats()
  }
}