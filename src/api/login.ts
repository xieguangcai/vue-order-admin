import request from '@/utils/request-account';
import {getToken} from "@/utils/auth";

export function login(username: string, password: string) {
  return request({
    url: '/oauth/token',
    method: 'get',
    params: {
      username,
      password,
    },
  });
}

export function getInfo(access_token: string) {
  return request({
    url: '/user',
    method: 'get',
    params: { access_token },
  });
}

export function logout() {
  const token = getToken();
  return request({
    url: '/oauth/delete/token',
    method: 'get',
    params:{access_token: token}
  });
}

export function changePwd(oldPwd: string, newPwd: string) {
  return request({
    url: '/api/me/changepwd',
    method: 'post',
    params: { oldPwd, newPwd},
  });
}
