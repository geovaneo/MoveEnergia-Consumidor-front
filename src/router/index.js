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
        component: () => import('@/views/Home.vue')
      },
      {
        path: '/faturas',
        name: 'Invoices',
        component: () => import('@/views/Invoices.vue')
      },
      {
        path: '/ajuda',
        name: 'Help',
        component: () => import('@/views/Help.vue')
      }
    ]
  },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
