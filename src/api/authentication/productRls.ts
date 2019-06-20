import request from '@/utils/request-authenticaton';
import {
  ProductRlsListQuery,
  ProductRls,
  Pageable,
  ResponseResult,
} from '@/types';
// @ts-ignore
import qs from 'qs';
import {AxiosPromise, AxiosResponse} from 'axios';

export function getProductRlsList(params: ProductRlsListQuery): AxiosPromise<ResponseResult<Pageable<ProductRls>>> {
  return request({
    url: '/authentication/productrls/pagelist',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}
