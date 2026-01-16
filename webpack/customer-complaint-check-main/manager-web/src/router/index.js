import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/quality-rule',
    name: 'QualityRule',
    component: () => import('@/page/QualityRule/QualityRule.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes,
});

export default router;
