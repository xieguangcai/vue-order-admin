import request from '@/utils/request-passport';
import {Pageable, ResponseResult, SysAccount} from '@/types';
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

