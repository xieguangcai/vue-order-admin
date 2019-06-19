import request from '@/utils/request-authenticaton';
import {
  Policy,
  Pageable,
  ResponseResult,
} from '@/types';
// @ts-ignore
import qs from 'qs';
import {AxiosPromise, AxiosResponse} from 'axios';

export function getPolicyList(params: Policy): AxiosPromise<ResponseResult<Pageable<Policy>>> {
  return request({
    url: '/authentication/policy/pagelist',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}
