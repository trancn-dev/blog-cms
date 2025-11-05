import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/posts',
    name: 'Posts',
    component: () => import('@/views/Posts/PostList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/posts/create',
    name: 'PostCreate',
    component: () => import('@/views/Posts/PostForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/posts/:id/edit',
    name: 'PostEdit',
    component: () => import('@/views/Posts/PostForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@/views/Categories/CategoryList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/categories/create',
    name: 'CategoryCreate',
    component: () => import('@/views/Categories/CategoryForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/categories/:id/edit',
    name: 'CategoryEdit',
    component: () => import('@/views/Categories/CategoryForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tags',
    name: 'Tags',
    component: () => import('@/views/Tags/TagList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('@/views/Projects/ProjectList.vue'),
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
