import router from './router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {Message, MessageBox} from 'element-ui';
import { getToken } from '@/utils/auth';
import { Route } from 'vue-router';
import { UserModule } from '@/store/modules/user';

const whiteList = ['/login'];

router.beforeEach((to: Route, from: Route, next: any) => {
  NProgress.start();
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done(); // If current page is dashboard will not trigger afterEach hook, so manually handle it
    } else {
      if (UserModule.roles.length === 0) {
        UserModule.GetInfo().then(() => {
          next();
        }).catch((err) => {
          UserModule.FedLogOut().then(() => {
            Message.error(err || '授权失败，请重新登录');
            next({ path: '/login' });
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
      if (to.path === '/login' || from.path === '/login') {
        NProgress.done();
      }else{
        if(to.path === '/'){
          next('/login');
          NProgress.done();
        }else{
          MessageBox.alert(
            '由于太久没有操作授权已经超时，请重新登录',
            {
              confirmButtonText: '重新登录',
              type: 'error',
            }
          ).then(
            () => {
              next('/login');
              NProgress.done();
            }
          );
        }
      }
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
