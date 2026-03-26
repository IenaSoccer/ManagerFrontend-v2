import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('layouts/MainLayout.vue'),
    meta: { authGuarded: true },
    children: [
      {
        path: '',
        name: 'IndexPage',
        component: () => import('src/modules/dashboard/pages/IndexPage.vue'),
      },
      {
        path: 'account',
        name: 'AccountPage',
        component: () => import('src/modules/dashboard/pages/AccountPage.vue'),
      },
      {
        path: 'users',
        name: 'UsersPage',
        component: () => import('src/modules/dashboard/pages/UsersPage.vue'),
      },
      {
        path: 'resources',
        name: 'ResourcesPage',
        component: () => import('src/modules/dashboard/pages/ResourcesPage.vue'),
      },
      {
        path: 'mappings',
        name: 'MappingsPage',
        component: () => import('src/modules/dashboard/pages/MappingsPage.vue'),
      },
      {
        path: 'api-settings',
        name: 'APITokenPage',
        component: () => import('src/modules/dashboard/pages/APITokenPage.vue'),
      },
      {
        path: 'security',
        name: 'SecurityPage',
        component: () => import('src/modules/dashboard/pages/SecurityPage.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'LoginPage',
        component: () => import('src/modules/auth/pages/LoginPage.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
