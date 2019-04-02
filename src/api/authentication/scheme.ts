import request from '@/utils/request-authenticaton';
import {
  SchemeInfoListQuery,
  SchemeInfo,
  Pageable,
  ResponseResult,
} from '@/types';
// @ts-ignore
import qs from 'qs';
import {AxiosPromise, AxiosResponse} from 'axios';

export function getSchemePageList(params: SchemeInfoListQuery): AxiosPromise<ResponseResult<Pageable<SchemeInfo>>> {
  return request({
    url: '/authentication/scheme/pagelist',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

