import {Message, MessageBox} from 'element-ui';
import {UserModule} from '@/store/modules/user';
import {AxiosRequestConfig, AxiosResponse} from 'axios';
import {getFullToken} from '@/utils/auth';
import {ResponseResult} from '@/types';

export function authHeader(config: AxiosRequestConfig): AxiosRequestConfig {
  // if (UserModule.token) {
  const fullToken = getFullToken();
  if (fullToken !== undefined) {
    config.headers.Authorization = getFullToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config;
}

export function authRejectFilter(error: any) {

  const response = error.response;
  let message = "";
  if (typeof response === "undefined") {
    message = error.message;
    Message({
      message: '错误：' + message,
      type: 'error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  } else {
    message = response.data.error_description || response.data.message || response.data || '服务器资源访问出错';
    if (response !== undefined) {
      const status = response.status;
      if (status === 401) {
        if (response.data.error === 'unauthorized') {
          Message({
            message: '账号密码错误！',
            type: 'error',
            duration: 5 * 1000,
          });
          return Promise.reject('error');
        }
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning',
          },
        ).then(() => {
          UserModule.FedLogOut().then(() => {
            location.reload(); // 为了重新实例化vue-router对象 避免bug
          });
        });
        const errorInfo: ResponseResult<any> = {code: response.status, message, success: false, data: response};

        return Promise.reject(errorInfo);
      } else {
        // Message({
        //   message: '服务错误：' + message,
        //   type: 'error',
        //   duration: 5 * 1000,
        // });
        const errorInfo: ResponseResult<any> = {code: response.status, message, success: false, data: response};
        return Promise.reject(errorInfo);
      }
    }
  }
}

export function handlerCommonError(error: ResponseResult<any>): void {
  Message({
    message: '错误：' + error.message,
    type: 'error',
    duration: 5 * 1000,
  });
}

export function authFilter(response: AxiosResponse<any>): AxiosResponse<any> | Promise<AxiosResponse<any>> {
  const res = response.data;
  if (typeof res.success !== 'undefined' && !res.success) {
    return Promise.reject(res);
  } else {
    return response;
  }
}
