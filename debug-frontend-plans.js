// 测试前端数据库连接
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFrontendConnection() {
  console.log('🔍 测试前端数据库连接...');
  
  // 模拟前端的用户ID
  const userId = 'b6c871eb-717c-4a40-859b-b639cf8ccd08';
  console.log('👤 使用用户ID:', userId);
  
  try {
    // 完全复制前端的查询逻辑
    const { data, error } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ 数据库查询失败:');
      console.error('   错误代码:', error.code);
      console.error('   错误消息:', error.message);
      console.error('   错误详情:', error.details);
      return;
    }
    
    console.log('✅ 数据库查询成功!');
    console.log('📊 找到计划数量:', data?.length || 0);
    
    if (data && data.length > 0) {
      console.log('\n📚 学习计划详情:');
      data.forEach((plan, index) => {
        console.log(`\n${index + 1}. ${plan.title}`);
        console.log(`   ID: ${plan.id}`);
        console.log(`   用户ID: ${plan.user_id}`);
        console.log(`   状态: ${plan.status}`);
        console.log(`   进度: ${plan.progress}%`);
        console.log(`   开始日期: ${plan.start_date}`);
        console.log(`   目标日期: ${plan.target_date}`);
        console.log(`   每日时长: ${plan.daily_hours}小时`);
        console.log(`   资源名称: ${plan.resource_name || '无'}`);
        console.log(`   资源链接: ${plan.resource_url || '无'}`);
        console.log(`   创建时间: ${plan.created_at}`);
      });
    } else {
      console.log('⚠️ 没有找到学习计划');
    }
    
    // 测试数据转换逻辑
    console.log('\n🔄 测试数据转换逻辑...');
    if (data && data.length > 0) {
      const testPlan = data[0];
      const frontendPlan = {
        id: testPlan.id,
        title: testPlan.title,
        description: testPlan.description,
        progress: testPlan.progress,
        status: testPlan.status,
        startDate: testPlan.start_date || testPlan.startDate,
        targetDate: testPlan.target_date || testPlan.targetDate,
        dailyHours: testPlan.daily_hours || testPlan.dailyHours,
        resourceName: testPlan.resource_name,
        resourceUrl: testPlan.resource_url
      };
      
      console.log('✅ 前端格式数据:', frontendPlan);
    }
    
  } catch (error) {
    console.error('❌ 连接测试失败:', error.message);
    console.error('错误堆栈:', error.stack);
  }
}

testFrontendConnection();