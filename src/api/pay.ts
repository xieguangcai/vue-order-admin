import request from '@/utils/request-pay';
import {OrderInfo, OrderInfoListQuery, Pageable, ResponseResult} from "@/types";
// @ts-ignore
import qs from 'qs';
import {AxiosPromise, AxiosResponse} from 'axios';

/**
 * --------------------pay相关接口-------------------------
 */
export function getOrderInfoList(params: OrderInfoListQuery): AxiosPromise<ResponseResult<Pageable<OrderInfo>>> {
  return request({
    url: '/pay/order/list',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}



