import request from '@/utils/request-authenticaton';
import {
  ProductChangprice,
  BaseOrderProducts,
  Pageable,
  ResponseResult,
} from '@/types';
// @ts-ignore
import qs from 'qs';
import {AxiosPromise, AxiosResponse} from 'axios';

export function getGuideBuyPageList(params: ProductChangprice): AxiosPromise<ResponseResult<Pageable<ProductChangprice>>> {
  return request({
    url: '/authentication/guidebuy/pagelist',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function getProductChangeprice(params: BaseOrderProducts): AxiosPromise<ResponseResult<BaseOrderProducts>> {
  return request({
    url: '/authentication/guidebuy/changeprice',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}
