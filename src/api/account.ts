import request from '@/utils/request-account';
import {AccountInfo, ApplicationInfo, Pageable, ResponseResult, RoleInfo} from '@/types/index';
// @ts-ignore
import qs from 'qs';
import {AxiosPromise, AxiosResponse} from 'axios';
import {debug} from 'util';

/**
 * --------------------account相关接口-------------------------
 */
export function getList(params: any): AxiosPromise<ResponseResult<Pageable<AccountInfo>>> {
  return request({
    url: '/user/list',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function deleteUser(ids: Array<number | undefined>) {
  return request({
    url : '/user/delete',
    method: 'get',
    params: {ids},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
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
export function getAccountInfo(id: number): AxiosPromise<ResponseResult<AccountInfo>> {
  return request({
    url : '/user/detail',
    method: 'post',
    params: {id},
  });
}

export function getAccountRoles(id: number): AxiosPromise<ResponseResult<RoleInfo[]>> {
  return request({
    url : '/user/roles',
    method: 'get',
    params: {id},
  });
}

export function saveAccountRoles(accountId: number, roleIds: number[]): AxiosPromise<ResponseResult<boolean>> {
  return request({
    url: '/user/save/roles',
    method: 'get',
    params : {accountId, roleIds},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function newUser(data: AccountInfo) {
  return request({
    url : '/user/new',
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
    url: '/role/list',
    method: 'get',
    params,
  });
}

export function getAllValidRoleList() {
  return request({
    url: '/role/valid/list',
    method: 'get',
  });
}

export function deleteRole(ids: number[]) {
  return request({
    url : '/role/delete',
    method: 'get',
    params: {ids},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function saveRole(data: RoleInfo) {
  return request({
    url : '/role/update',
    method: 'post',
    data,
  });
}

export function newRole(data: RoleInfo) {
  return request({
    url : '/role/new',
    method: 'post',
    data,
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
    url: '/application/list',
    method: 'get',
    params,
  });
}

export function deleteApp(ids: number[]) {
  return request({
    url : '/application/delete',
    method: 'get',
    params: {ids},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function saveApp(data: ApplicationInfo) {
  return request({
    url : '/application/update',
    method: 'post',
    data,
  });
}

export function newApp(data: ApplicationInfo) {
  return request({
    url : '/application/new',
    method: 'post',
    data,
  });
}
/**
 * --------------------application相关接口-------------------------
 */
