import request from '@/utils/request-passport';
import {
  Pageable,
  RedisValueInfo,
  ResponseResult,
  SysAccount, SysLoginLayoutListQuery,
  SysLoginLayoutModel,
} from '@/types';
// @ts-ignore
import qs from 'qs';
import {AxiosPromise, AxiosResponse} from 'axios';

/**
 * --------------------pay相关接口-------------------------
 */
export function getSysAccountInfoDetail(openId: string): AxiosPromise<ResponseResult<SysAccount>> {
  return request({
    url: '/passport/sys-account/detail',
    method: 'get',
    params: {openId},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function getMoblieCode(mobile: string): AxiosPromise<ResponseResult<RedisValueInfo>> {
  return request({
    url: '/passport/redis/mobile-code',
    method: 'get',
    params: {mobile},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function delMobileCheck(mobile: string): AxiosPromise<ResponseResult<string>> {
  return request({
    url: '/passport/redis/del-mobile-check',
    method: 'get',
    params: {mobile},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}


export function getLoginLayoutList(params: SysLoginLayoutListQuery): AxiosPromise<ResponseResult<Pageable<SysLoginLayoutModel>>> {
  return request({
    url: '/passport/sys-login-layout/list',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}


export function getLoginLayoutDetail(id: number): AxiosPromise<ResponseResult<SysLoginLayoutModel>> {
  return request({
    url: '/passport/sys-login-layout/detail',
    method: 'get',
    params: {id},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function addNewLoginLayout(data: SysLoginLayoutModel): AxiosPromise<ResponseResult<SysLoginLayoutModel>> {
  return request({
    url: '/passport/edit/sys-login-layout/add',
    method: 'post',
    data,
  });
}

export function updateLoginLayout(data: SysLoginLayoutModel): AxiosPromise<ResponseResult<boolean>> {
  return request({
    url: '/passport/edit/sys-login-layout/update',
    method: 'post',
    data,
  });
}

export function publisLoginLayoutTest(data: SysLoginLayoutModel): AxiosPromise<ResponseResult<boolean>> {
  return request({
    url: '/passport/edit/sys-login-layout/publish-test',
    method: 'post',
    data,
  });
}

export function publisLoginLayout(id: number): AxiosPromise<ResponseResult<boolean>> {
  return request({
    url: '/passport/audit/sys-login-layout/publish',
    method: 'get',
    params: {id},
  });
}

export function offlineLoginLayout(id: number): AxiosPromise<ResponseResult<boolean>> {
  return request({
    url: '/passport/audit/sys-login-layout/offline',
    method: 'get',
    params: {id},
  });
}
