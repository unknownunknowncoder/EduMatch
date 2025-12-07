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
    path: '/test-supabase',
    name: 'TestSupabase',
    component: () => import('@/views/TestSupabasePage.vue')
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
    component: () => import(/* webpackPrefetch: true */ '@/views/ProfilePage.vue'),
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
    component: () => import(/* webpackPrefetch: true */ '@/views/CreateResource.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/community',
    name: 'Community',
    component: () => import(/* webpackPrefetch: true */ '@/views/CommunityPage.vue'),
    meta: { requiresAuth: false } // 社区页面改为不需要认证，方便展示
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
    component: () => import(/* webpackPrefetch: true */ '@/views/StudyPlanPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/study-plan/:id',
    name: 'StudyPlanDetail',
    component: () => import('@/views/StudyPlanDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/study-plan/:id/edit',
    name: 'StudyPlanEdit',
    component: () => import('@/views/StudyPlanEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/study-plan/:id/checkin',
    name: 'StudyPlanCheckin',
    component: () => import('@/views/StudyPlanCheckinPage.vue'),
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
    name: 'AdminDatabase',
    component: () => import('@/views/AdminDatabase.vue'),
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
    // 检查登录状态是否过期
    if (autoLogoutIfExpired()) {
      next('/admin/login')
      return
    }
    
    // 管理员登录页面不需要认证
    if (to.path === '/admin/login') {
      next()
      return
    }
    
    // 其他管理员页面需要管理员认证
    if (!isAdminLoggedIn()) {
      next({
        path: '/admin/login',
        query: { redirect: to.fullPath }
      })
      return
    }
    
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

// 全局错误处理
router.onError((error) => {
  console.error('Router error:', error)
  // 如果是组件加载错误，尝试重新加载页面
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    window.location.reload()
  }
})

export default router