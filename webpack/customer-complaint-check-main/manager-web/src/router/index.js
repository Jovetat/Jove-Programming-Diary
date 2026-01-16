import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/audio-processing',
  },
  {
    path: '/audio-processing',
    name: 'AudioProcessing',
    component: () => import('@/page/AudioProcessing/AudioProcessing.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes,
});

export default router;
