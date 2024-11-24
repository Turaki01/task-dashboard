import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '@/views/TaskDashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Dashboard,
    },
    {
      path: '/task/:id',
      name: 'TaskDetail',
      component: () => import('../views/TaskDetail.vue'),
      props: true,
    },
  ],
})

export default router
