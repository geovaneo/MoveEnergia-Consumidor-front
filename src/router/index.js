import { createRouter, createWebHistory } from 'vue-router'

// Define your routes here

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        meta: { title: 'Visão Geral' },
        component: () => import('@/views/Home.vue')
      },
      {
        path: '/faturas',
        name: 'Invoices',
        meta: { title: 'Suas faturas' },
        component: () => import('@/views/Invoices.vue')
      },
      {
        path: '/ajuda',
        name: 'Help',
        meta: { title: 'Precisando de ajuda?' },
        component: () => import('@/views/Help.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    meta: { title: 'Login' },
    component: () => import('@/views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = (to.meta.title ? `${to.meta.title} | Move Energia` : 'Portal Consumidor | Move Energia')
  next()
})

export default router
