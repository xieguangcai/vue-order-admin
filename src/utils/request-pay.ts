import axios from 'axios';
import { Message, MessageBox } from 'element-ui';
import {authFilter, authHeader} from "@/utils/auth-interceptor";

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_PAY_API + 'api',
  timeout: 5000,
});

// request 拦截器
service.interceptors.request.use(
  authHeader,
  (error) => {
    // Handle request error here
    Promise.reject(error);
  },
);

// respone 拦截器
service.interceptors.response.use(
  authFilter,
  (error) => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  },
);

export default service;
