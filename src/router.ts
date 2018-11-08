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
    keepAlive: true              cache the view if need useful for edit from
  }
*/

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({x: 0, y: 0}),
  base: process.env.BASE_URL,
  routes: [
    {path: '/login', component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue')},
    {path: '/404', component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue')},
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      name: '智能客服系统',
      meta: {hidden: true},
      children: [{
        path: 'dashboard',
        name: '智能客服系统',
        meta: {title: '仪表板'},
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
      }],
    },
    {
      path: 'external-link',
      component: Layout,
      children: [
        {
          path: '/',
          meta: {title: '酷开智能客服系统', icon: 'coocaa'},
        },
      ],
    },
    {
      path: '/orders',
      component: Layout,
      name: '会员信息管理',
      meta: {title: '会员信息管理', icon: 'form'},
      children: [
        {
          path: 'oss-order-list',
          name: 'oss订单列表',
          component: () => import(/* webpackChunkName: "oss-order-list" */ '@/views/pay/orders/index.vue'),
          meta: {title: 'oss订单列表', icon: 'tree'},
        },
        {
          path: 'movies-order-list',
          name: '业务订单列表',
          component: () => import(/* webpackChunkName: "movies-order-list" */ '@/views/authentication/orders/index.vue'),
          meta: {title: '业务订单列表', icon: 'table'},

        },
        {
          path: 'card-info-list',
          name: '卡密信息列表',
          component: () => import(/* webpackChunkName: "card-info-list" */ '@/views/pay/cards/index.vue'),
          meta: {title: '卡密信息列表', icon: 'card'},

        },
      ],
    },
    {
      path: '/union-manager',
      component: Layout,
      name: '系统管理',
      meta: {title: '系统管理', icon: 'nested', roles: ['ROLE_ADMIN']},
      children: [
        {
          path: 'account-list',
          name: '系统账户管理',
          component: () => import(/* webpackChunkName: "account-list" */ '@/views/account/index.vue'),
          meta: {title: '系统账户列表', icon: 'user'},
        },
        {
          path: 'app-list',
          name: '接入应用管理',
          component: () => import(/* webpackChunkName: "app-list" */ '@/views/app/index.vue'),
          meta: {title: '接入应用列表', icon: 'tree'},
        },
        {
          path: 'role-list',
          name: '系统角色管理',
          component: () => import(/* webpackChunkName: "role-list" */ '@/views/role/index.vue'),
          meta: {title: '角色列表', icon: 'role'},
        },
      ],
    },
    {
      path: '/me',
      component: Layout,
      name: '个人设置',
      meta: {title: '个人设置', hidden: true}, children: [
        {
          path: 'changepwd',
          name: '修改密码',
          component: () => import(/* webpackChunkName: "changepwd" */ '@/views/changepwd.vue'),
          meta: {title: '修改密码', icon: 'user', hidden: true},
        },
      ],
    },
    {path: '*', redirect: '/404'},

  ],
});
