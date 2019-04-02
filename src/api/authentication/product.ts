import request from '@/utils/request-authenticaton';
import {
  ProductListQuery,
  BaseOrderProducts,
  Pageable,
  ResponseResult,
} from '@/types';
// @ts-ignore
import qs from 'qs';
import {AxiosPromise, AxiosResponse} from 'axios';

export function getProductList(params: ProductListQuery): AxiosPromise<ResponseResult<Pageable<BaseOrderProducts>>> {
  return request({
    url: '/authentication/product/pagelist',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}
