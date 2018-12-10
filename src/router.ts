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
    roles: []                    拥有全新到用户组
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
      meta: {title: '会员信息管理', icon: 'form', roles: ['ROLE_VIEW']},
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
        {
          path: 'order-refund-list',
          name: '重复支付列表',
          component: () => import(/* webpackChunkName: "order-refund-list" */ '@/views/pay/orders-refund/index.vue'),
          meta: {title: '重复支付列表', icon: 'card'},
        },
        {
          path: 'phone-valid-code',
          name: '验证码',
          component: () => import(/* webpackChunkName: "phone-valid-code" */ '@/views/passport/user/index.vue'),
          meta: {title: '验证码', icon: 'card'},
        },
      ],
    }, {
      path: '/passport',
      component: Layout,
      name: '登录布局',
      meta: {title: '登录布局', icon: 'layout', roles: ['LAYOUT_ROLE_VIEW']},
      children: [
        {
          path: 'new-login-layout',
          name: '新增登录页',
          component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
          meta: {title: '新增登录页', icon: 'layout1', keepAlive: true, roles: ['LAYOUT_ROLE_EDIT']},
        },
        {
          path: 'edit-login-layout',
          name: '编辑',
          component: () => import(/* webpackChunkName: "edit-native-layout" */ '@/views/passport/tvlogin/edit-native-layout.vue'),
          meta: {title: '编辑登录页面', icon: 'layout1', hidden: true, keepAlive: true, roles: ['LAYOUT_ROLE_EDIT']},
        },
        {
          path: 'view-login-layout',
          name: '查看',
          component: () => import(/* webpackChunkName: "view-native-layout" */ '@/views/passport/tvlogin/view-native-layout.vue'),
          meta: {title: '查看登录页面', icon: 'layout1', hidden: true, roles: ['LAYOUT_ROLE_VIEW']},
        },
        {
          path: 'login-layout-list',
          name: '登录布局管理',
          component: () => import(/* webpackChunkName: "login-layout-list" */ '@/views/passport/tvlogin/index.vue'),
          meta: {title: '登录布局管理', icon: 'layout2', roles: ['LAYOUT_ROLE_VIEW']},
        }],
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
