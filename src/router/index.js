import { createRouter, createWebHistory } from 'vue-router'
import { useLoginStore } from "@/stores/login";

// Define your routes here

const routes = [
  {
    path: '/home',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '/home',
        name: 'Home',
        meta: { title: 'Visão Geral', requiresAuth: true },
        component: () => import('@/views/Home.vue')
      },
      {
        path: '/faturas',
        name: 'Invoices',
        meta: { title: 'Suas faturas', requiresAuth: true },
        component: () => import('@/views/Invoices.vue')
      },
      {
        path: '/faturas/:invoiceId',
        name: 'InvoiceDetails',
        component: () => import('@/views/InvoiceDetails.vue'),
        meta: { title: 'Detalhes da Fatura', requiresAuth: true },
      },
      {
        path: '/ajuda',
        name: 'Help',
        meta: { title: 'Precisando de ajuda?', requiresAuth: true },
        component: () => import('@/views/Help.vue')
      },
    ]
  },
  {
    path: '/',
    name: 'HomeTemp',
    meta: { title: 'Visão Geral', requiresAuth: true },
    component: () => import('@/views/InvoicesTemp.vue')
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


router.beforeEach(async (to, from, next) => {
  document.title = (to.meta.title ? `${to.meta.title} | Move Energia` : 'Portal Consumidor | Move Energia')
  const loginStore = useLoginStore();

  if (!loginStore.authenticated) {
    await loginStore.verifyToken();
  }

  if (to.meta.requiresAuth && !loginStore.authenticated) {
    next("/login");
  } else {
    next();
  }
});


export default router
