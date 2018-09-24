import request from '@/utils/request-account';
import {AccountInfo} from '@/api/index';
// @ts-ignore
import qs from 'qs';

export function getList(params: any) {
  return request({
    url: '/user/list',
    method: 'get',
    params,
  });
}

export function deleteUser(ids: number[]) {
  return request({
    url : '/user/delete',
    method: 'get',
    params: {ids},
    paramsSerializer(params) {
      debugger;
      return qs.stringify(params, {arrayFormat: 'repeat'});
    },
  });
}

export function saveUser(data: AccountInfo) {
  return request({
    url : '/user/update',
    method: 'post',
    data,
  });
}

export function newUser(data: AccountInfo) {
  return request({
    url : '/user/new',
    method: 'post',
    data,
  });
}
