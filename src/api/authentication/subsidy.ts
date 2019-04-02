import request from '@/utils/request-authenticaton';
import {
  AllowanceActivityInfo,
  Pageable,
  ResponseResult,
} from '@/types';
// @ts-ignore
import qs from 'qs';
import {AxiosPromise, AxiosResponse} from 'axios';

export function getSubsidyPageList(params: AllowanceActivityInfo): AxiosPromise<ResponseResult<Pageable<AllowanceActivityInfo>>> {
  return request({
    url: '/authentication/subsidy/pagelist',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}
