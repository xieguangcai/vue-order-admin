import request from '@/utils/request-account';
import {getToken} from "@/utils/auth";

export function login(username: string, password: string) {
  return request({
    url: '/ums/oauth/token',
    method: 'post',
    data: {
      username,
      password,
    },
  });
}

export function getInfo(access_token: string) {
  return request({
    url: '/ums/user',
    method: 'get',
    params: { access_token },
  });
}

export function logout() {
  const token = getToken();
  return request({
    url: '/ums/oauth/delete/token',
    method: 'get',
    params:{access_token: token}
  });
}
