import { createRouter, createWebHistory } from 'vue-router';
import { h } from 'vue';
import Layout from '@/components/Layout/Layout.vue';
import { HomeOutlined, AuditOutlined } from '@ant-design/icons-vue';

// 左侧菜单配置
export const menuItems = [
  {
    key: '/dashboard',
    icon: () => h(HomeOutlined),
    label: '首页',
  },
  {
    key: 'case-management',
    icon: () => h(AuditOutlined),
    label: '案件管理',
    children: [
      {
        key: '/case-management/my-cases',
        label: '我的法催案件',
      },
      {
        key: '/case-management/material-export',
        label: '材料导出',
      },
    ],
  },
];

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/page/Dashboard/Dashboard.vue'),
      },
      {
        path: 'case-management/my-cases',
        name: 'MyCases',
        component: () => import('@/page/MyCases/MyCases.vue'),
      },
      {
        path: 'case-management/material-export',
        name: 'MaterialExport',
        component: () => import('@/page/MaterialExport/MaterialExport.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes,
});

export default router;
