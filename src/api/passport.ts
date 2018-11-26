import request from '@/utils/request-passport';
import {Pageable, RedisValueInfo, ResponseResult, SysAccount} from '@/types';
// @ts-ignore
import qs from 'qs';
import {AxiosPromise, AxiosResponse} from 'axios';

/**
 * --------------------pay相关接口-------------------------
 */
export function getSysAccountInfoDetail(openId: string ): AxiosPromise<ResponseResult<SysAccount>> {
  return request({
    url: '/passport/sys-account/detail',
    method: 'get',
    params: {openId},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function getMoblieCode(mobile: string) : AxiosPromise<ResponseResult<RedisValueInfo>> {
  return request({
    url: '/passport/redis/mobile-code',
    method: 'get',
    params: {mobile},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function delMobileCheck(mobile: string) : AxiosPromise<ResponseResult<String>> {
  return request({
    url: '/passport/redis/del-mobile-check',
    method: 'get',
    params: {mobile},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}
