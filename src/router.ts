import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/views/layout/Layout.vue';

Vue.use(Router);

/*
  redirect:                      if `redirect: noredirect`, it won't redirect if click on the breadcrumb
  meta: {
    title: 'title'               the name showed in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    hidden: true                 if `hidden: true`, this route will not show in the sidebar (default is false)
    alwaysShow: true             if set to true, it will always show the root menu
                                 if not set, only show with nested mode if there are more than one route under its children
  }
*/

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ x: 0, y: 0 }),
  base: process.env.BASE_URL,
  routes: [
    { path: '/login', component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue') },
    { path: '/404', component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue') },
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      name: '智能客服系统',
      meta: { hidden: true },
      children: [{
        path: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
      }],
    },
    {
      path: 'external-link',
      component: Layout,
      children: [
        {
          path: 'https://github.com/Armour/vue-typescript-admin-template',
          meta: { title: 'ExternalLink', icon: 'link' },
        },
      ],
    },
    {
      path: '/orders',
      component: Layout,
      name: '会员信息管理',
      meta: { title: '会员信息管理', icon: 'nested' },
      children: [
        {
          path: 'oss-order-list',
          name: 'oss订单列表',
          component: () => import(/* webpackChunkName: "oss-order-list" */ '@/views/pay/orders/index.vue'),
          meta: {title: 'oss订单列表', icon: 'link'},
        },
        {
          path: 'movies-order-list',
          name: '业务订单列表',
          component: () => import(/* webpackChunkName: "movies-order-list" */ '@/views/authentication/orders/index.vue'),
          meta: {title: '业务订单列表', icon: 'link'},

        },
      ],
    },
    {
      path: '/union-manager',
      component: Layout,
      name: '系统管理',
      meta: { title: '系统管理', icon: 'nested' },
      children: [
        {
          path: 'account-list',
          name: '系统账户管理',
          component: () => import(/* webpackChunkName: "account-list" */ '@/views/account/index.vue'),
          meta: {title: '系统账户列表', icon: 'link'},
        },
        {
          path: 'app-list',
          name: '接入应用管理',
          component: () => import(/* webpackChunkName: "app-list" */ '@/views/app/index.vue'),
          meta: {title: '接入应用列表', icon: 'link'},
        },
        {
          path: 'role-list',
          name: '系统角色管理',
          component: () => import(/* webpackChunkName: "role-list" */ '@/views/role/index.vue'),
          meta: {title: '角色列表', icon: 'link'},
        },
      ],
    },

    { path: '*', redirect: '/404' },
  ],
});
