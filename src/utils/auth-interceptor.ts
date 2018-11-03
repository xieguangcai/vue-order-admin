import {Message, MessageBox} from "element-ui";
import {UserModule} from "@/store/modules/user";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {getFullToken} from "@/utils/auth";

export function authHeader(config: AxiosRequestConfig) : AxiosRequestConfig {
  if (UserModule.token) {
    config.headers['Authorization'] = getFullToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config;
}
export function authFilter(response : AxiosResponse<any>) : AxiosResponse<any> | Promise<AxiosResponse<any>> {
    const status = response.status;
    if(status == 401){
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
      return Promise.reject('error');
    }
    if(status != 200){
      let message = response.data.error_description || response.data || '服务器资源访问出错';
      Message({
        message: '服务错误：' + message,
        type: 'error',
        duration: 5 * 1000,
      });
      return Promise.reject('error');
    }

    const res = response.data;
    if (typeof res.success != 'undefined' && !res.success) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000,
      });
      return Promise.reject('error');

    } else {
      return response;
    }
}
