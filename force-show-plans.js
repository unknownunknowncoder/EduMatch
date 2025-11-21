// 强制显示学习计划脚本
// 在浏览器控制台中执行此脚本

console.log('🔧 强制显示学习计划...');

// 1. 设置用户信息
const currentUser = {
  id: 'b6c871eb-717c-4a40-859b-b639cf8ccd08',
  username: 'admin',
  email: 'admin@edumatch.com',
  nickname: '管理员'
};

localStorage.setItem('currentUser', JSON.stringify(currentUser));
console.log('✅ 用户信息已设置');

// 2. 创建模拟的学习计划数据（基于数据库中的实际数据）
const mockStudyPlans = [
  {
    id: 'bd7ceda8-55b6-4435-91cc-73440245f7b1',
    title: 'c语言',
    description: 'C语言学习计划',
    progress: 0,
    status: 'in_progress',
    startDate: '2025-11-20',
    targetDate: '2025-11-28',
    dailyHours: 2,
    resourceName: 'c语言零基础',
    resourceUrl: ''
  },
  {
    id: 'c1e78b13-f9cf-4b53-8437-872d14fde775',
    title: 'c语言零基础',
    description: 'C语言零基础学习',
    progress: 0,
    status: 'in_progress',
    startDate: '2025-11-20',
    targetDate: '2025-11-28',
    dailyHours: 2,
    resourceName: '',
    resourceUrl: ''
  },
  {
    id: 'fde8c544-2f36-47b1-82b9-556c433ab9e0',
    title: 'java初级',
    description: 'Java初级学习计划',
    progress: 0,
    status: 'in_progress',
    startDate: '2025-11-20',
    targetDate: '2025-11-28',
    dailyHours: 2,
    resourceName: '',
    resourceUrl: ''
  },
  {
    id: '4ea70f7f-ef69-4c1d-b038-82982ce247af',
    title: 'java企业级开发',
    description: 'Java企业级开发学习',
    progress: 0,
    status: 'in_progress',
    startDate: '2025-11-20',
    targetDate: '2025-11-28',
    dailyHours: 2,
    resourceName: '',
    resourceUrl: ''
  }
];

// 3. 等待页面加载完成
setTimeout(() => {
  // 尝试找到 Vue 组件实例并更新数据
  const app = document.querySelector('#app');
  if (app) {
    console.log('🔄 找到 Vue 应用，尝试更新数据...');
    
    // 尝试通过 Vue DevTools 更新数据
    try {
      // 查找当前页面实例
      const vueInstances = Array.from(document.querySelectorAll('*')).reduce((acc, el) => {
        if (el.__vue__) {
          acc.push(el.__vue__);
        }
        return acc;
      }, []);
      
      console.log(`📊 找到 ${vueInstances.length} 个 Vue 实例`);
      
      // 查找学习计划页面的实例
      const studyPlanInstance = vueInstances.find(instance => {
        return instance.$options?.name === 'StudyPlanPage' || 
               instance.currentPlans !== undefined ||
               instance.loadStudyPlans !== undefined;
      });
      
      if (studyPlanInstance) {
        console.log('✅ 找到学习计划页面实例');
        
        // 强制更新计划数据
        studyPlanInstance.currentPlans = mockStudyPlans;
        studyPlanInstance.plans = {
          inProgress: mockStudyPlans.filter(p => p.status === 'in_progress').length,
          completed: mockStudyPlans.filter(p => p.status === 'completed').length,
          totalHours: mockStudyPlans.reduce((sum, p) => sum + (p.dailyHours || 0), 0)
        };
        
        console.log('✅ 学习计划数据已更新:', studyPlanInstance.currentPlans.length, '个');
        
      } else {
        console.log('⚠️ 未找到学习计划页面实例');
      }
    } catch (error) {
      console.error('❌ 更新失败:', error);
    }
  }
  
  // 4. 作为备用方案，直接在页面上创建学习计划显示
  setTimeout(() => {
    const plansContainer = document.querySelector('.space-y-4');
    if (plansContainer && plansContainer.children.length === 0) {
      console.log('🔄 创建备用学习计划显示...');
      
      let html = '';
      mockStudyPlans.forEach((plan, index) => {
        html += `
          <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow" style="margin-bottom: 16px;">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-semibold text-lg text-gray-900">${plan.title}</h3>
                <p class="text-gray-600 text-sm">${plan.description}</p>
              </div>
              <span style="padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; background: #dbeafe; color: #1d4ed8;">
                进行中
              </span>
            </div>
            <div class="mb-3">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">进度</span>
                <span class="font-medium">${plan.progress}%</span>
              </div>
              <div style="width: 100%; background: #e5e7eb; border-radius: 4px; height: 8px;">
                <div style="background: #3b82f6; height: 8px; border-radius: 4px; width: 0%; transition: all 0.3s;"></div>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; font-size: 14px;">
              <div>
                <span class="text-gray-500">开始时间</span>
                <div class="font-medium">${plan.startDate}</div>
              </div>
              <div>
                <span class="text-gray-500">目标时间</span>
                <div class="font-medium">${plan.targetDate}</div>
              </div>
              <div>
                <span class="text-gray-500">每日时长</span>
                <div class="font-medium">${plan.dailyHours}小时</div>
              </div>
            </div>
          </div>
        `;
      });
      
      plansContainer.innerHTML = html;
      console.log('✅ 备用学习计划显示已创建');
    }
  }, 1000);
  
}, 2000);

console.log('🎯 脚本执行完成！');
console.log('📋 如果没有看到学习计划，请刷新页面并重试');