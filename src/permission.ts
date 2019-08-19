import router from './router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {Message, MessageBox} from 'element-ui';
import { getToken } from '@/utils/auth';
import { Route } from 'vue-router';
import { UserModule } from '@/store/modules/user';

const whiteList = ['/login', '/qiyu/login'];
let prefix = '';
if(dashboard === 'qiyu'){
  prefix = '/qiyu';
}
let loginAction = prefix + '/login';
let mainAction = prefix + '/';

router.beforeEach((to: Route, from: Route, next: any) => {
  NProgress.start();
  console.log('路由发生变化了。。。。');
  if (getToken()) {
    if (to.path === loginAction) {
      next({ path: mainAction });
      NProgress.done(); // If current page is dashboard will not trigger afterEach hook, so manually handle it
    } else {
      if (UserModule.roles.length === 0) {
        UserModule.GetInfo().then(() => {
          next();
        }).catch((err) => {
          UserModule.FedLogOut().then(() => {
            Message.error(err || '授权失败，请重新登录');
            next({ path: loginAction });
          });
        });
      } else {
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      if (to.path === loginAction || from.path === loginAction) {
        NProgress.done();
      } else {
        if (to.path === mainAction) {
          next(loginAction);
          NProgress.done();
        } else {
          MessageBox.alert(
            '由于太久没有操作授权已经超时，请重新登录',
            {
              confirmButtonText: '重新登录',
              type: 'error',
            },
          ).then(
            () => {
              next(loginAction);
              NProgress.done();
            },
          );
        }
      }
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
