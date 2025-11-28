<!-- 只包含修复后的打卡功能代码片段 -->
<!-- 在原始 StudyPlanPage.vue 的打卡函数中替换 -->

<script setup lang="ts">
// 修复后的打卡功能
const handleCheckin = async (plan: StudyPlan) => {
  if (isCheckingIn.value) return
  
  try {
    isCheckingIn.value = true
    
    // 方法1: 直接使用 Supabase 客户端，绕过 dbStore
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase 配置缺失')
    }
    
    const client = createClient(supabaseUrl, supabaseKey)
    
    // 获取当前登录用户信息
    const { data: { user }, error: authError } = await client.auth.getUser()
    
    if (authError || !user) {
      console.error('❌ 获取认证用户失败:', authError)
      throw new Error('用户未登录或认证失败')
    }
    
    console.log('✅ 获取到认证用户:', user.id, user.email)
    
    // 方法2: 使用 auth.uid() 而不是 localStorage 的用户ID
    const today = new Date().toISOString().split('T')[0]
    
    // 检查今天是否已经打卡
    const { data: existingCheckins, error: checkError } = await client
      .from('study_plan_checkins')
      .select('*')
      .eq('study_plan_id', plan.id)
      .eq('user_id', user.id)  // 使用认证后的用户ID
      .eq('checkin_date', today)
    
    if (checkError) {
      console.error('❌ 检查打卡记录失败:', checkError)
      throw new Error(`检查打卡记录失败: ${checkError.message}`)
    }
    
    if (existingCheckins && existingCheckins.length > 0) {
      alert('今天已经打过卡了！')
      return
    }
    
    // 创建打卡记录
    const { data: checkinData, error: checkinError } = await client
      .from('study_plan_checkins')
      .insert([{
        study_plan_id: plan.id,
        user_id: user.id,  // 使用认证后的用户ID
        checkin_date: today,
        checkin_time: new Date().toTimeString().split(' ')[0],
        notes: `学习计划：${plan.title}`
      }])
      .select()
    
    if (checkinError) {
      console.error('❌ 打卡失败:', checkinError)
      
      // 提供详细的错误信息
      if (checkinError.code === '42501') {
        throw new Error('权限被拒绝，请联系管理员检查RLS策略')
      } else if (checkinError.code === 'PGRST116') {
        throw new Error('打卡表不存在，请联系管理员创建')
      } else {
        throw new Error(`打卡失败: ${checkinError.message}`)
      }
    }
    
    console.log('✅ 打卡成功:', checkinData)
    
    // 更新界面的打卡状态
    await loadStudyPlans()
    
    // 显示成功提示
    showSuccessMessage.value = true
    successMessage.value = '打卡成功！继续保持学习节奏！'
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
    
  } catch (error: any) {
    console.error('❌ 打卡功能错误:', error)
    alert(`打卡失败: ${error.message}`)
  } finally {
    isCheckingIn.value = false
  }
}
</script>