import { createRouter, createWebHistory } from 'vue-router'
import { isAdminLoggedIn, autoLogoutIfExpired } from '@/utils/adminAuth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/SearchPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterPage.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfilePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/resource/:id',
    name: 'ResourceDetails',
    component: () => import('@/views/ResourceDetails.vue')
  },
  {
    path: '/create-resource',
    name: 'CreateResource',
    component: () => import('@/views/CreateResource.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/community',
    name: 'Community',
    component: () => import('@/views/CommunityPage.vue')
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: () => import('@/views/PostDetail.vue')
  },

  {
    path: '/liked',
    name: 'LikedFavorites',
    component: () => import('@/views/LikedFavoritesPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/study-plan',
    name: 'StudyPlan',
    component: () => import('@/views/StudyPlanPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/study-plan/:id',
    name: 'StudyPlanDetail',
    component: () => import('@/views/StudyPlanDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/my-all-posts',
    name: 'MyAllPosts',
    component: () => import('@/views/MyAllPostsPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/my-all-resources',
    name: 'MyAllResources',
    component: () => import('@/views/MyAllResourcesPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/:userId',
    name: 'UserProfile',
    component: () => import('@/views/UserProfilePage.vue')
  },
  
  {
    path: '/admin',
    redirect: '/admin/dashboard'
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('@/views/AdminSystem.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/test',
    name: 'AdminTest',
    component: () => import('@/views/AdminTest.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('@/views/AdminSystem.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/settings',
    name: 'AdminSettings',
    component: () => import('@/views/AdminSystem.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/maintenance',
    name: 'AdminMaintenance',
    component: () => import('@/views/AdminSystem.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/user/:userId',
    name: 'UserDetailAdmin',
    component: () => import('@/views/UserDetailAdmin.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/post/:id',
    name: 'AdminPostDetail',
    component: () => import('@/views/AdminPostDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/plan/:id',
    name: 'AdminPlanDetail',
    component: () => import('@/views/AdminPlanDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/resource/:id',
    name: 'AdminResourceDetail',
    component: () => import('@/views/AdminResourceDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/views/AdminLogin.vue')
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('@/views/HelpPage.vue')
  },
  {
    path: '/profile/following',
    name: 'MyFollowing',
    component: () => import('@/views/MyFollowingPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/followers',
    name: 'MyFollowers',
    component: () => import('@/views/MyFollowersPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/:userId/following',
    name: 'UserFollowing',
    component: () => import('@/views/UserFollowingPage.vue')
  },
  {
    path: '/user/:userId/followers',
    name: 'UserFollowers',
    component: () => import('@/views/UserFollowersPage.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 检查是否是管理员路由
  if (to.path.startsWith('/admin')) {
    console.log('🔍 Admin route accessed:', to.path)
    
    // 管理员登录页面不需要认证
    if (to.path === '/admin/login') {
      console.log('✅ Admin login page, allowing access')
      next()
      return
    }
    
    // 检查登录状态是否过期
    const isExpired = autoLogoutIfExpired()
    console.log('🕐 Login expired?', isExpired)
    
    if (isExpired) {
      console.log('🔄 Redirecting to admin login due to expiration')
      next('/admin/login')
      return
    }
    
    // 其他管理员页面需要管理员认证
    const isLoggedIn = isAdminLoggedIn()
    console.log('🔐 Is admin logged in?', isLoggedIn)
    
    if (!isLoggedIn) {
      console.log('🔄 Redirecting to admin login, not authenticated')
      next({
        path: '/admin/login',
        query: { redirect: to.fullPath }
      })
      return
    }
    
    console.log('✅ Admin authenticated, allowing access')
    next()
    return
  }
  
  // 普通用户认证检查
  if (to.meta.requiresAuth) {
    // 获取当前用户信息
    const currentUser = localStorage.getItem('currentUser')
    
    if (!currentUser) {
      // 用户未登录，重定向到登录页面
      next('/login')
      return
    }
    
    try {
      // 验证用户数据格式
      const user = JSON.parse(currentUser)
      if (user && user.id) {
        // 用户已登录，允许访问
        next()
        return
      } else {
        // 用户数据无效，重定向到登录页面
        localStorage.removeItem('currentUser')
        next('/login')
        return
      }
    } catch (error) {
      // JSON 解析失败，清除无效数据并重定向
      localStorage.removeItem('currentUser')
      next('/login')
      return
    }
  } else {
    // 不需要认证的路由，直接允许访问
    next()
  }
})

// 路由切换后确保侧边栏可见
router.afterEach((to, from) => {
  // 如果是管理员路由，确保侧边栏可见
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    // 特别处理从用户详情页返回的情况
    const isReturningFromUserDetail = from.path.startsWith('/admin/user/')
    const isMaintenancePage = to.path.startsWith('/admin/maintenance')
    const checkInterval = isMaintenancePage ? 50 : 0
    
    // 如果是从用户详情页返回，立即强制恢复侧边栏
    if (isReturningFromUserDetail) {
      console.log('🔄 从用户详情页返回，立即强制恢复侧边栏按钮')
      // 立即执行一次强制恢复
      const immediateFix = () => {
        const sidebar = document.querySelector('.admin-sidebar') as HTMLElement
        if (sidebar) {
          // 强制恢复侧边栏
          sidebar.style.setProperty('display', 'block', 'important')
          sidebar.style.setProperty('visibility', 'visible', 'important')
          sidebar.style.setProperty('opacity', '1', 'important')
          
          // 强制恢复导航容器
          const nav = sidebar.querySelector('nav.sidebar-nav') as HTMLElement
          if (nav) {
            nav.style.setProperty('display', 'flex', 'important')
            nav.style.setProperty('visibility', 'visible', 'important')
            nav.style.setProperty('opacity', '1', 'important')
          }
          
          // 强制恢复所有按钮
          const buttons = sidebar.querySelectorAll('nav.sidebar-nav a, .sidebar-button') as NodeListOf<HTMLElement>
          buttons.forEach((btn) => {
            btn.style.setProperty('display', 'flex', 'important')
            btn.style.setProperty('visibility', 'visible', 'important')
            btn.style.setProperty('opacity', '1', 'important')
            
            // 恢复按钮内的所有元素
            const spans = btn.querySelectorAll('span')
            spans.forEach((span) => {
              const spanEl = span as HTMLElement
              spanEl.style.setProperty('display', 'inline-block', 'important')
              spanEl.style.setProperty('visibility', 'visible', 'important')
              spanEl.style.setProperty('opacity', '1', 'important')
            })
          })
          
          console.log(`✅ 立即修复完成，找到 ${buttons.length} 个按钮`)
        }
      }
      
      // 立即执行
      immediateFix()
      
      // 使用 requestAnimationFrame 确保在下一帧执行
      requestAnimationFrame(() => {
        immediateFix()
      })
    }
    
    // 使用 setTimeout 确保 DOM 已更新
    setTimeout(() => {
      const sidebar = document.querySelector('.admin-sidebar') as HTMLElement
      if (sidebar) {
        // 强制清除任何可能的 display:none 样式
        sidebar.style.removeProperty('display')
        sidebar.style.removeProperty('visibility')
        sidebar.style.removeProperty('opacity')
        
        // 强制设置侧边栏样式
        sidebar.style.setProperty('display', 'block', 'important')
        sidebar.style.setProperty('visibility', 'visible', 'important')
        sidebar.style.setProperty('opacity', '1', 'important')
        sidebar.style.setProperty('position', 'fixed', 'important')
        sidebar.style.setProperty('z-index', '50', 'important')
        
        // 强制清除所有可能的隐藏类
        sidebar.classList.remove('hidden', 'invisible', 'opacity-0')
        
        // 确保导航容器可见
        const nav = sidebar.querySelector('nav.sidebar-nav') as HTMLElement
        if (nav) {
          nav.style.removeProperty('display')
          nav.style.removeProperty('visibility')
          nav.style.removeProperty('opacity')
          nav.classList.remove('hidden', 'invisible', 'opacity-0')
          
          nav.style.setProperty('display', 'flex', 'important')
          nav.style.setProperty('visibility', 'visible', 'important')
          nav.style.setProperty('opacity', '1', 'important')
        }
        
        // 确保所有按钮可见 - 使用更全面的选择器
        const buttons = sidebar.querySelectorAll('nav.sidebar-nav a, .sidebar-button, nav.sidebar-nav router-link')
        buttons.forEach((button) => {
          const btn = button as HTMLElement
          // 清除所有可能隐藏的样式
          btn.style.removeProperty('display')
          btn.style.removeProperty('visibility')
          btn.style.removeProperty('opacity')
          btn.style.removeProperty('width')
          btn.style.removeProperty('height')
          btn.style.removeProperty('position')
          btn.style.removeProperty('left')
          btn.style.removeProperty('top')
          btn.classList.remove('hidden', 'invisible', 'opacity-0')
          
          // 强制设置可见样式
          btn.style.setProperty('display', 'flex', 'important')
          btn.style.setProperty('visibility', 'visible', 'important')
          btn.style.setProperty('opacity', '1', 'important')
          btn.style.setProperty('min-height', '2.25rem', 'important')
          btn.style.setProperty('width', '100%', 'important')
          
          // 确保按钮内的图标和文字可见
          const spans = btn.querySelectorAll('span')
          spans.forEach(span => {
            const spanEl = span as HTMLElement
            spanEl.style.removeProperty('display')
            spanEl.style.removeProperty('visibility')
            spanEl.style.removeProperty('opacity')
            spanEl.style.removeProperty('width')
            spanEl.style.removeProperty('height')
            spanEl.style.removeProperty('position')
            spanEl.style.removeProperty('left')
            spanEl.style.removeProperty('top')
            spanEl.classList.remove('hidden', 'invisible', 'opacity-0')
            
            spanEl.style.setProperty('display', 'inline-block', 'important')
            spanEl.style.setProperty('visibility', 'visible', 'important')
            spanEl.style.setProperty('opacity', '1', 'important')
          })
        })
        
        // 确保侧边栏底部正常显示 - 同一行布局
        const sidebarBottom = sidebar.querySelector('div[class*="border-t"]') as HTMLElement
        if (sidebarBottom) {
          sidebarBottom.style.removeProperty('display')
          sidebarBottom.style.removeProperty('visibility')
          sidebarBottom.style.removeProperty('opacity')
          sidebarBottom.classList.remove('hidden', 'invisible', 'opacity-0')
          sidebarBottom.style.setProperty('display', 'flex', 'important')
          sidebarBottom.style.setProperty('align-items', 'center', 'important')
          sidebarBottom.style.setProperty('justify-content', 'space-between', 'important')
          sidebarBottom.style.setProperty('width', '100%', 'important')
          sidebarBottom.style.setProperty('visibility', 'visible', 'important')
          sidebarBottom.style.setProperty('opacity', '1', 'important')
        }
        
        console.log('✅ 路由切换后已确保侧边栏可见，找到', buttons.length, '个按钮', 
          isMaintenancePage ? '(系统维护页面)' : '', 
          isReturningFromUserDetail ? '(从用户详情页返回)' : '')
      } else {
        console.warn('⚠️ 路由切换后未找到侧边栏元素')
      }
    }, checkInterval)
    
    // 再次检查，确保在 DOM 完全更新后（系统维护页面使用更短的延迟）
    setTimeout(() => {
      const sidebar = document.querySelector('.admin-sidebar') as HTMLElement
      if (sidebar) {
        const buttons = sidebar.querySelectorAll('nav.sidebar-nav a')
        if (buttons.length < 3) {
          console.log('⚠️ 按钮数量不足，再次修复...', isMaintenancePage ? '(系统维护页面)' : '')
          const nav = sidebar.querySelector('nav.sidebar-nav') as HTMLElement
          if (nav) {
            nav.style.removeProperty('display')
            nav.style.removeProperty('visibility')
            nav.style.removeProperty('opacity')
            nav.classList.remove('hidden', 'invisible', 'opacity-0')
            nav.style.setProperty('display', 'flex', 'important')
            nav.style.setProperty('visibility', 'visible', 'important')
            nav.style.setProperty('opacity', '1', 'important')
          }
          buttons.forEach((button) => {
            const btn = button as HTMLElement
            btn.style.removeProperty('display')
            btn.style.removeProperty('visibility')
            btn.style.removeProperty('opacity')
            btn.classList.remove('hidden', 'invisible', 'opacity-0')
            btn.style.setProperty('display', 'flex', 'important')
            btn.style.setProperty('visibility', 'visible', 'important')
            btn.style.setProperty('opacity', '1', 'important')
          })
        }
      }
    }, isMaintenancePage ? 50 : 100)
    
    // 第三次检查，确保万无一失（系统维护页面使用更频繁的检查）
    const finalCheckDelay = isMaintenancePage ? 150 : 300
    setTimeout(() => {
      const sidebar = document.querySelector('.admin-sidebar') as HTMLElement
      if (sidebar) {
        const buttons = sidebar.querySelectorAll('nav.sidebar-nav a')
        buttons.forEach((button) => {
          const btn = button as HTMLElement
          const computedStyle = window.getComputedStyle(btn)
          if (computedStyle.display === 'none' || 
              computedStyle.visibility === 'hidden' || 
              parseFloat(computedStyle.opacity) < 0.1) {
            console.log('🔧 最终检查发现按钮问题，强制修复...', isMaintenancePage ? '(系统维护页面)' : '')
            btn.style.removeProperty('display')
            btn.style.removeProperty('visibility')
            btn.style.removeProperty('opacity')
            btn.classList.remove('hidden', 'invisible', 'opacity-0')
            btn.style.setProperty('display', 'flex', 'important')
            btn.style.setProperty('visibility', 'visible', 'important')
            btn.style.setProperty('opacity', '1', 'important')
          }
        })
      }
    }, finalCheckDelay)
    
    // 系统维护页面额外检查
    if (isMaintenancePage) {
      setTimeout(() => {
        const sidebar = document.querySelector('.admin-sidebar') as HTMLElement
        if (sidebar) {
          const buttons = sidebar.querySelectorAll('nav.sidebar-nav a')
          console.log('🔍 系统维护页面额外检查，找到', buttons.length, '个按钮')
          buttons.forEach((button) => {
            const btn = button as HTMLElement
            btn.style.removeProperty('display')
            btn.style.removeProperty('visibility')
            btn.style.removeProperty('opacity')
            btn.classList.remove('hidden', 'invisible', 'opacity-0')
            btn.style.setProperty('display', 'flex', 'important')
            btn.style.setProperty('visibility', 'visible', 'important')
            btn.style.setProperty('opacity', '1', 'important')
          })
        }
      }, 250)
    }
  }
})

export default router