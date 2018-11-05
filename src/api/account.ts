import request from '@/utils/request-account';
import {AccountInfo, ApplicationInfo, Pageable, ResponseResult, RoleInfo} from '@/types/index';
// @ts-ignore
import qs from 'qs';
import {AxiosPromise, AxiosResponse} from 'axios';

/**
 * --------------------account相关接口-------------------------
 */
export function getList(params: any): AxiosPromise<ResponseResult<Pageable<AccountInfo>>> {
  return request({
    url: '/api/user/list',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function deleteUser(ids: Array<number | undefined>) {
  return request({
    url : '/api/user/delete',
    method: 'get',
    params: {ids},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function saveUser(data: AccountInfo) {
  return request({
    url : '/api/user/update',
    method: 'post',
    data,
  });
}
export function getAccountInfo(id: number): AxiosPromise<ResponseResult<AccountInfo>> {
  return request({
    url : '/api/user/detail',
    method: 'post',
    params: {id},
  });
}

export function getAccountRoles(id: number): AxiosPromise<ResponseResult<RoleInfo[]>> {
  return request({
    url : '/api/user/roles',
    method: 'get',
    params: {id},
  });
}

export function saveAccountRoles(accountId: number, roleIds: Array<number | undefined>): AxiosPromise<ResponseResult<boolean>> {
  return request({
    url: '/api/user/save/roles',
    method: 'get',
    params : {accountId, roleIds},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function newUser(data: AccountInfo) {
  return request({
    url : '/api/user/new',
    method: 'post',
    data,
  });
}

/**
 * --------------------account相关接口-------------------------
 */

/**
 * --------------------role相关接口-------------------------
 */
/**
 * 获取所有的角色信息
 * @param params
 */
export function getRoleList(params: any) {
  return request({
    url: '/api/role/list',
    method: 'get',
    params,
  });
}

export function getAllValidRoleList() {
  return request({
    url: '/api/role/valid/list',
    method: 'get',
  });
}

export function deleteRole(ids: Array<number | undefined>) {
  return request({
    url : '/api/role/delete',
    method: 'get',
    params: {ids},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function saveRole(data: RoleInfo) {
  return request({
    url : '/api/role/update',
    method: 'post',
    data,
  });
}

export function newRole(data: RoleInfo) {
  return request({
    url : '/api/role/new',
    method: 'post',
    data,
  });
}


export function getRoleInfo(id: number): AxiosPromise<ResponseResult<RoleInfo>> {
  return request({
    url : '/api/role/detail',
    method: 'post',
    params: {id},
  });
}
/**
 * --------------------role相关接口-------------------------
 */

/**
 * --------------------application相关接口-------------------------
 */
export function getAppList(params: any) {
  return request({
    url: '/api/application/list',
    method: 'get',
    params,
  });
}

export function deleteApp(ids: Array<number | undefined>) {
  return request({
    url : '/api/application/delete',
    method: 'get',
    params: {ids},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}
export function getAppInfo(id: number): AxiosPromise<ResponseResult<ApplicationInfo>> {
  return request({
    url : '/api/application/detail',
    method: 'post',
    params: {id},
  });
}
export function saveApp(data: ApplicationInfo) {
  return request({
    url : '/api/application/update',
    method: 'post',
    data,
  });
}

export function newApp(data: ApplicationInfo) {
  return request({
    url : '/api/application/new',
    method: 'post',
    data,
  });
}
/**
 * --------------------application相关接口-------------------------
 */
