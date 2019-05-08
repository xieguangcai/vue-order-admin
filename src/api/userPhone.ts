import request from '@/utils/request-device';
import {
  Pageable,
  RedisValueInfo,
  ResponseResult,
  UserPhoneListQuery, UserPhone,
} from '@/types';
// @ts-ignore
import qs from 'qs';
import {AxiosPromise, AxiosResponse} from 'axios';

/**
 * --------------------active系统激活相关接口-------------------------
 */
export function getUserPhonePageList(params: UserPhoneListQuery): AxiosPromise<ResponseResult<Pageable<UserPhone>>> {
  return request({
    url: '/active/userPhone/userPhoneList',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}


/**
 * 修改手机号
 */
export function updateUserPhone(data: UserPhone) {

  return request({
    url: '/active/userPhone/updateUserPhone?id='+data.id+"&mobile="+data.mobile,
    method: 'get',
    data,
  });
}

export function getUserInfoInfo(id: number): AxiosPromise<ResponseResult<UserPhone>> {
  return request({
    url: '/active/userPhone/getUserPhoneById',
    method: 'get',
    params: {id},
  });
}

/**
 * 添加手机号
 */
export function saveUserPhone(data: UserPhone) {
  return request({
    url : '/active/userPhone/saveUserPhone?mobile='+data.mobile,
    method: 'get',
    data,
  });
}

export function deleteUserPhone(ids: Array<number | undefined>) {
  return request({
    url : '/active/userPhone/deleteUserPhone',
    method: 'get',
    params: {ids},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}



