import request from '@/utils/request-pay';
import {OrderInfo, OrderInfoListQuery, Pageable, ResponseResult, UserInfoFull} from '@/types';
// @ts-ignore
import qs from 'qs';
import {AxiosPromise, AxiosResponse} from 'axios';
import {AppModule} from '@/store/modules/app';

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

export function getOrderInfo(orderId: number): AxiosPromise<ResponseResult<OrderInfo>> {
  return request({
    url: '/pay/order/detail',
    method: 'get',
    params: {orderId},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function getUserInfoFull(userId: string): AxiosPromise<ResponseResult<UserInfoFull>> {
  return request({
    url: '/pay/user-info/detail',
    method: 'get',
    params: {userId},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}
export function getUserInfoFullByOpenId(openId: string): AxiosPromise<ResponseResult<UserInfoFull>> {
  return request({
    url: '/pay/user-info/detail',
    method: 'get',
    params: {openId},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}
export function orderStatusClass(orderStatus: string): string {
  if (orderStatus === 'CC00502') {
    return 'warning-row';
  } else if (orderStatus === 'CC00503') {
    return 'success-row';
  }
  return '';
}

export function orderStatusName(code: string) {
  let name = code;
  AppModule.orderStatus.forEach((item) => {
    if (item.value === code) {
      name = item.label;
      return false;
    }
  });
  return name;
}

