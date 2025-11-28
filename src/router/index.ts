import { createRouter, createWebHistory } from 'vue-router'

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
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 简化版本
router.beforeEach((to, _from, next) => {
  // 检查该路由是否需要认证
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

export default router