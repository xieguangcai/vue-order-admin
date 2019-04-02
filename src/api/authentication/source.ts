import request from '@/utils/request-authenticaton';
import {
  SourceListQuery,
  BaseOrderSource,
  Pageable,
  ResponseResult,
} from '@/types';
// @ts-ignore
import qs from 'qs';
import {AxiosPromise, AxiosResponse} from 'axios';

export function getSourcePageList(params: SourceListQuery): AxiosPromise<ResponseResult<Pageable<BaseOrderSource>>> {
  return request({
    url: '/authentication/source/pagelist',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function getSourceListByCompany(company: string): AxiosPromise<ResponseResult<BaseOrderSource[]>> {
  return request({
    url: '/authentication/source/querybycompany',
    method: 'get',
    params: {company},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}
