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
  path name 不能重复，切换标签的时候会根据name去路由。
*/

const hiddenInCoocaa: boolean = process.env.VUE_APP_CHANNEL === 'coocaa';
const title = hiddenInCoocaa ? '酷开智能客服系统' : '智能客服系统';

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
      name: title,
      meta: {hidden: true},
      children: [{
        path: 'dashboard',
        name: title,
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
          meta: {title, icon: 'coocaa'},
        },
      ],
    }, {
      path: '/subsidy',
      component: Layout,
      name: '津贴管理',
      meta: {title: '津贴管理', hidden: !hiddenInCoocaa, icon: 'form', roles: ['SUBSIDY_ROLE_VIEW']},
      children: [
        {
          path: 'subsidy-activity-list',
          name: '津贴管理',
          component: () => import(/* webpackChunkName: "subsidy-activity-list" */ '@/views/subsidy/activity/index.vue'),
          meta: {title: '津贴管理', icon: 'tree'},
        },
        {
          path: 'addActive',
          name: 'addActive',
          component: () => import(/* webpackChunkName: "addActive" */ '@/views/subsidy/activity/addActive.vue'),
          meta: {title: '新增活动', icon: 'form', hidden: true},
        },
        {
          path: 'addSubsidy',
          name: 'addSubsidy',
          component: () => import(/* webpackChunkName: "addSubsidy" */ '@/views/subsidy/activity/addSubsidy.vue'),
          meta: {title: '新增津贴', icon: 'form', hidden: true},
        },
        {
          path: 'activeInfo',
          name: 'activeInfo',
          component: () => import(/* webpackChunkName: "activeInfo" */ '@/views/subsidy/activity/activeInfo.vue'),
          meta: {title: '查看活动', icon: 'form', hidden: true},
        },
        {
          path: 'subsidyDetailList',
          name: 'subsidyDetailList',
          component: () => import(/* webpackChunkName: "subsidyDetail" */ '@/views/subsidy/activity/subsidyDetailList.vue'),
          meta: {title: '津贴流水', icon: 'form', hidden: true},
        },


      ],
    }, {
      path: '/active-manager',
      component: Layout,
      name: '设备激活管理',
      meta: {title: '设备激活管理', hidden: !hiddenInCoocaa, icon: 'form', roles: ['ACTIVE_ROLE_VIEW']},
      children: [
        {
          path: 'test-device-list',
          name: '测试手机号管理',
          component: () => import(/* webpackChunkName: "account-list" */ '@/views/device-activate/userPhone/index.vue'),
          meta: {title: '测试手机号列表', icon: 'tree', roles: ['ACTIVE_ROLE_VIEW']},
        },
        {
          path: 'device-list',
          name: '激活设备查询',
          component: () => import(/* webpackChunkName: "app-list" */ '@/views/device-activate/device/index.vue'),
          meta: {title: '激活设备列表', icon: 'tree', roles: ['ACTIVE_ROLE_VIEW']},
        },
      ],
    },
    {
      path: '/rights-manage',
      component: Layout,
      name: '权益管理',
      meta: {title: '权益管理', hidden: !hiddenInCoocaa, icon: 'form', roles: ['PRODUCT_ROLE_VIEW']},
      children: [
        {
          path: 'company-list',
          name: '供应商列表',
          component: () => import(/* webpackChunkName: "company-list" */ '@/views/authentication/company/index.vue'),
          meta: {title: '供应商列表', icon: 'tree', roles: ['PRODUCT_ROLE_VIEW']},
        },
        {
          path: 'rights-list',
          name: '会员权益',
          component: () => import(/* webpackChunkName: "rights-list" */ '@/views/authentication/rights-info/index.vue'),
          meta: {title: '会员权益', icon: 'tree', roles: ['PRODUCT_ROLE_VIEW']},
        },
      ],
    },
    {
      path: '/product-manage',
      component: Layout,
      name: '产品包管理',
      meta: {title: '产品包管理', hidden: !hiddenInCoocaa, icon: 'form', roles: ['PRODUCT_ROLE_VIEW', 'OFFLINE_ROLE_EDIT_PRICE']},
      children: [
        {
          path: 'source',
          name: '产品包分类列表',
          component: () => import(/* webpackChunkName: "source" */ '@/views/authentication/source/index.vue'),
          meta: {title: '产品包分类列表', icon: 'tree', roles: ['PRODUCT_ROLE_VIEW']},
        },
        {
          path: 'product',
          name: '基础产品包列表',
          component: () => import(/* webpackChunkName: "product" */ '@/views/authentication/product/index.vue'),
          meta: {title: '基础产品包列表', icon: 'tree', roles: ['PRODUCT_ROLE_VIEW']},
        },
        {
          path: 'activity',
          name: '产品包活动',
          // component: () => import(/* webpackChunkName: "activity" */ '@/views/authentication/product/index.vue'),
          meta: {title: '产品包活动', icon: 'tree', roles: ['PRODUCT_ROLE_VIEW']},
        },
        {
          path: 'scheme',
          name: 'VIP方案管理',
          component: () => import(/* webpackChunkName: "scheme" */ '@/views/authentication/scheme/index.vue'),
          meta: {title: 'VIP方案管理', icon: 'tree', roles: ['PRODUCT_ROLE_VIEW']},
        },
        {
          path: 'scheme-test',
          name: '方案测试管理',
          component: () => import(/* webpackChunkName: "scheme-test" */ '@/views/authentication/scheme-test/index.vue'),
          meta: {title: '方案测试管理', icon: 'tree', roles: ['PRODUCT_ROLE_VIEW']},
        },
        {
          path: 'policy',
          name: 'VIP投放策略',
          component: () => import(/* webpackChunkName: "policy" */ '@/views/authentication/policy/index.vue'),
          meta: {title: 'VIP投放策略', icon: 'tree', roles: ['PRODUCT_ROLE_VIEW']},
        },
        {
          path: 'give-info',
          name: '赠品管理',
          component: () => import(/* webpackChunkName: "policy" */ '@/views/authentication/give-info/index.vue'),
          meta: {title: '赠品管理', icon: 'tree', roles: ['PRODUCT_ROLE_VIEW']},
        },
        {
          path: 'subsidy',
          name: '产品包津贴管理',
          component: () => import(/* webpackChunkName: "subsidy" */ '@/views/authentication/subsidy/index.vue'),
          meta: {title: '产品包津贴管理', icon: 'tree', roles: ['PRODUCT_ROLE_VIEW']},
        },
        {
          path: 'open-product',
          name: '开通产品包管理',
          component: () => import(/* webpackChunkName: "open-product" */ '@/views/authentication/open-product/index.vue'),
          meta: {title: '开通产品包管理', icon: 'tree', roles: ['PRODUCT_ROLE_VIEW']},
        },
        {
          path: 'changprice',
          name: '线下包价格管理',
          component: () => import(/* webpackChunkName: "changprice" */ '@/views/authentication/product/guideBuy.vue'),
          meta: {title: '线下包价格管理', icon: 'tree', roles: ['OFFLINE_ROLE_EDIT_PRICE']},
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
          meta: {title: 'oss订单列表', icon: 'tree', roles: ['ROLE_VIEW']},
        },
        {
          path: 'oss-bind-user-terminal',
          name: '终端解绑',
          component: () => import(/* webpackChunkName: "terminal-list" */ '@/views/pay/user/terminal-list.vue'),
          meta: {title: '终端解绑',  hidden: !hiddenInCoocaa, icon: 'user', roles: ['ROLE_VIEW', 'VIEW_USER_INFO']},
        },
        {
          path: 'movies-order-list',
          name: '业务订单列表',
          component: () => import(/* webpackChunkName: "movies-order-list" */ '@/views/authentication/orders/index.vue'),
          meta: {title: '业务订单列表', icon: 'table', roles: ['ROLE_VIEW']},

        },
        {
          path: 'card-info-list',
          name: '卡密信息列表',
          component: () => import(/* webpackChunkName: "card-info-list" */ '@/views/pay/cards/index.vue'),
          meta: {title: '卡密信息列表', hidden: !hiddenInCoocaa,  icon: 'card', roles: ['ROLE_VIEW']},

        },
        {
          path: 'order-refund-list',
          name: '重复支付列表',
          component: () => import(/* webpackChunkName: "order-refund-list" */ '@/views/pay/orders-refund/index.vue'),
          meta: {title: '重复支付列表', icon: 'card', roles: ['ROLE_VIEW']},
        },
        {
          path: 'phone-valid-code',
          name: '验证码',
          component: () => import(/* webpackChunkName: "phone-valid-code" */ '@/views/passport/user/index.vue'),
          meta: {title: '验证码',  hidden: !hiddenInCoocaa, icon: 'card', roles: ['PASSPORT_ROLE_VIEW_SMS_CODE']},
        },
        {
          path: 'account-info-detail',
          name: '账号信息',
          component: () => import(/* webpackChunkName: "account-info-detail" */ '@/views/passport/user/detail.vue'),
          meta: {title: '账号信息', icon: 'user', roles: ['ROLE_VIEW', 'VIEW_USER_INFO']},
        },
        {
          path: 'jscn-user-detail',
          name: '广电账号信息',
          component: () => import(/* webpackChunkName: "account-info-detail" */ '@/views/passport/user/jscn-detail.vue'),
          meta: {title: '广电账号信息', hidden: hiddenInCoocaa, icon: 'user', roles: ['ROLE_VIEW', 'VIEW_USER_INFO']},
        },
        {
          path: 'permissions',
          name: '查询会员权益',
          component: () => import(/* webpackChunkName: "add-oss-retaining-window" */ '@/views/authentication/order-permissions/index.vue'),
          meta: {title: '查询会员权益', icon: 'form', hidden: false},
        },
      ],
    },
    {
      path: '/oss',
      component: Layout,
      name: '自动续费管理',
      meta: {title: '自动续费管理', hidden: !hiddenInCoocaa, icon: 'form', roles: ['DEDUCTION_ROLE_VIEW']},
      children: [
        {
          path: 'autimatic-deduction-iframe',
          name: '挽留弹窗',
          component: () => import(/* webpackChunkName: "oss-retaining-window" */ '@/views/pay/Autimatic-deduction-iframe/index.vue'),
          meta: {title: '挽留弹窗', icon: 'layout1', roles: ['DEDUCTION_ROLE_VIEW']},
        },
        {
          path: 'autimatic-deduction-iframe-detail',
          name: '挽留弹窗详情',
          component: () => import(/* webpackChunkName: "oss-retaining-window-detail" */ '@/views/pay/Autimatic-deduction-iframe/windowsDetail.vue'),
          meta: {title: '挽留弹窗详情', icon: 'layout1', hidden: true, roles: ['DEDUCTION_ROLE_VIEW']},
        },
        {
          path: 'add-autimatic-deduction-iframe',
          name: '新增挽留弹窗',
          component: () => import(/* webpackChunkName: "add-oss-retaining-window" */ '@/views/pay/Autimatic-deduction-iframe/new-iframe.vue'),
          meta: {title: '新增/修改挽留弹窗', icon: 'form', hidden: true, roles: ['DEDUCTION_ROLE_EDIT']},
        },
        {
          path: 'autimatic-app-scene',
          name: '第三方自动续费',
          component: () => import(/* webpackChunkName: "oss-retaining-window" */ '@/views/pay/Automatic-app-scene/index.vue'),
          meta: {title: '第三方自动续费', icon: 'layout1', roles: ['DEDUCTION_ROLE_VIEW','DEDUCTION_ROLE_EDIT']},
        },
        {
          path: 'add-autimatic-app-scene',
          name: '新增第三方自动续费',
          component: () => import(/* webpackChunkName: "add-oss-retaining-window" */ '@/views/pay/Automatic-app-scene/new-app-scene.vue'),
          meta: {title: '新增/修改第三方自动续费', icon: 'form', hidden: true, roles: ['DEDUCTION_ROLE_EDIT']},
        },
      ],
    },
    // {
    //   path: '/rights',
    //   component: Layout,
    //   name: '会员权益',
    //   meta: {title: '会员权益', icon: 'layout', roles: ['AUTHEN_ROLE_VIEW']},
    //   children: [
    //     {
    //       path: 'company-list',
    //       name: '供应商管理',
    //       component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
    //       meta: {title: '供应商', icon: 'layout1', keepAlive: true, roles: ['AUTHEN_ROLE_VIEW']},
    //     },
    //     {
    //       path: 'company-edit',
    //       name: '编辑-供应商',
    //       component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
    //       meta: {hidden: true, title: '编辑-供应商', icon: 'layout1', keepAlive: true},
    //     },
    //     {
    //       path: 'right-info-list',
    //       name: '会员权益管理',
    //       component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
    //       meta: {title: '会员权益', icon: 'layout1',  roles: ['AUTHEN_ROLE_VIEW']},
    //     },
    //     {
    //       path: 'right-info-edit',
    //       name: '编辑-会员权益',
    //       component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
    //       meta: {hidden: true, title: '编辑-会员权益', icon: 'layout1', keepAlive: true},
    //     },
    //   ],
    // },
    // {
    //   path: '/product',
    //   component: Layout,
    //   name: '产品包管理',
    //   meta: {title: '产品包管理', icon: 'layout', roles: ['PRODUCT_ROLE_VIEW']},
    //   children: [
    //     {
    //       path: 'source-list',
    //       name: '产品包分类',
    //       component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
    //       meta: {title: '产品包分类', icon: 'layout1',  roles: ['PRODUCT_ROLE_VIEW']},
    //     },
    //     {
    //       path: 'source-audit',
    //       name: '审核-产品包分类',
    //       component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
    //       meta: {hidden: true, title: '审核-产品包分类', icon: 'layout1', keepAlive: true},
    //     },
    //     {
    //       path: 'source-edit',
    //       name: '编辑-产品包分类',
    //       component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
    //       meta: {hidden: true, title: '编辑-产品包分类', icon: 'layout1', keepAlive: true},
    //     },
    //     {
    //       path: 'source-view',
    //       name: '查看-产品包分类',
    //       component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
    //       meta: {hidden: true, title: '查看-产品包分类', icon: 'layout1', keepAlive: true},
    //     },
    //     {
    //       path: 'product-list',
    //       name: '基础产品包',
    //       component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
    //       meta: {title: '基础产品包', icon: 'layout1', keepAlive: true, roles: ['PRODUCT_ROLE_VIEW']},
    //     },
    //     {
    //       path: 'product-audit',
    //       name: '审核-基础产品包',
    //       component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
    //       meta: {hidden: true, title: '审核-基础产品包', icon: 'layout1', keepAlive: true},
    //     },
    //     {
    //       path: 'product-edit',
    //       name: '编辑-基础产品包',
    //       component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
    //       meta: {hidden: true, title: '编辑-基础产品包', icon: 'layout1', keepAlive: true},
    //     },
    //     {
    //       path: 'product-view',
    //       name: '查看-基础产品包',
    //       component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
    //       meta: {hidden: true, title: '查看-基础产品包', icon: 'layout1', keepAlive: true},
    //     },
    //     {
    //       path: 'scheme-list',
    //       name: 'VIP方案管理',
    //       component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
    //       meta: {title: 'VIP方案', icon: 'layout1', keepAlive: true, roles: ['PRODUCT_ROLE_VIEW']},
    //     },
    //     {
    //       path: 'scheme-audit',
    //       name: '审核-VIP方案',
    //       component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
    //       meta: {hidden: true, title: '审核-VIP方案', icon: 'layout1', keepAlive: true},
    //     },
    //     {
    //       path: 'scheme-edit',
    //       name: '编辑-VIP方案',
    //       component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
    //       meta: {hidden: true, title: '编辑-VIP方案', icon: 'layout1', keepAlive: true},
    //     },
    //     {
    //       path: 'scheme-test-view',
    //       name: '查看-VIP方案',
    //       component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
    //       meta: {hidden: true, title: '查看-VIP方案', icon: 'layout1', keepAlive: true},
    //     },
    //     {
    //       path: 'scheme-test-list',
    //       name: '测试方案管理',
    //       component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
    //       meta: {title: '测试方案', icon: 'layout1', keepAlive: true, roles: ['PRODUCT_ROLE_VIEW']},
    //     },
    //     {
    //       path: 'scheme-test-audit',
    //       name: '审核-测试方案',
    //       component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
    //       meta: {hidden: true, title: '审核-测试方案', icon: 'layout1', keepAlive: true},
    //     },
    //     {
    //       path: 'scheme-test-edit',
    //       name: '编辑-测试方案',
    //       component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
    //       meta: {hidden: true, title: '编辑-测试方案', icon: 'layout1', keepAlive: true},
    //     },
    //     {
    //       path: 'scheme-test-view',
    //       name: '查看-测试方案',
    //       component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
    //       meta: {hidden: true, title: '查看-测试方案', icon: 'layout1', keepAlive: true},
    //     },
    //     {
    //       path: 'policy-list',
    //       name: 'VIP投放策略',
    //       component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
    //       meta: {title: 'VIP投放策略', icon: 'layout1', keepAlive: true, roles: ['PRODUCT_ROLE_VIEW']},
    //     },
    //     {
    //       path: 'policy-audit',
    //       name: '审核-VIP投放策略',
    //       component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
    //       meta: {hidden: true, title: '审核-VIP投放策略', icon: 'layout1', keepAlive: true},
    //     },
    //     {
    //       path: 'policy-edit',
    //       name: '编辑-VIP投放策略',
    //       component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
    //       meta: {hidden: true, title: '编辑-VIP投放策略', icon: 'layout1', keepAlive: true},
    //     },
    //     {
    //       path: 'policy-view',
    //       name: '查看-VIP投放策略',
    //       component: () => import(/* webpackChunkName: "new-native-layout" */ '@/views/passport/tvlogin/new-native-layout.vue'),
    //       meta: {hidden: true, title: '查看-VIP投放策略', icon: 'layout1', keepAlive: true},
    //     },
    //   ],
    // },
    {
      path: '/passport',
      component: Layout,
      name: '登录布局',
      meta: {title: '登录布局', hidden: !hiddenInCoocaa, icon: 'layout', roles: ['LAYOUT_ROLE_VIEW']},
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
          component: () => import(/* webpackChunkName: "account-list" */ '@/views/union-manager/account/index.vue'),
          meta: {title: '系统账户列表', icon: 'user'},
        },
        {
          path: 'app-list',
          name: '接入应用管理',
          component: () => import(/* webpackChunkName: "app-list" */ '@/views/union-manager/app/index.vue'),
          meta: {title: '接入应用列表', icon: 'tree'},
        },
        {
          path: 'role-list',
          name: '系统角色管理',
          component: () => import(/* webpackChunkName: "role-list" */ '@/views/union-manager/role/index.vue'),
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
