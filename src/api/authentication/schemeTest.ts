import request from '@/utils/request-authenticaton';
import {
  SchemeTestListQuery,
  SchemeTest,
  Pageable,
  ResponseResult,
} from '@/types';
// @ts-ignore
import qs from 'qs';
import {AxiosPromise, AxiosResponse} from 'axios';

export function getSchemeTestPageList(params: SchemeTestListQuery): AxiosPromise<ResponseResult<Pageable<SchemeTest>>> {
  return request({
    url: '/authentication/schemetest/pagelist',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

