import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        auth: undefined
      }
    },
    {
      path: '/403',
      name: 'Error 403',
      component: () => import('../views/Exceptions/403View.vue'),
      meta: {
        auth: undefined
      }
    },
    {
      path: '/tablo',
      name: 'tablo',
      component: () => import('../views/TabloView.vue'),
      meta: {
        auth: undefined
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        auth: false
      }
    },
    {
      path: '/account/profile',
      name: 'profile',
      component: () => import('../views/Account/ProfileView.vue'),
      meta: {
        auth: true
      }
    },
    {
      path: '/queue/operator',
      name: 'operator',
      component: () => import('../views/OperatorTabsView.vue'),
      meta: {
        auth: ['Operators']
      }
    },
    {
      path: '/queue/registrator',
      name: 'registrator',
      component: () => import('../views/RegistratorTabsView.vue'),
      meta: {
        auth: ['Registrators']
      }
    },
    {
      path: '/queue/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        auth: ['Admins']
      }
    }
  ]
});

export default router;
