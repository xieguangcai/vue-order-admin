import request from '@/utils/request-pay';
import {
  CardInfo,
  CardInfoListQuery,
  OrderInfo,
  OrderInfoListQuery, OrderRefundInfo, OrderRefundInfoListQuery,
  Pageable,
  ResponseResult, StatusInfo,
  UserInfoFull,
} from '@/types';
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

export function getOrderInfoByorigiOrderNo(origiOrderNo: string): AxiosPromise<ResponseResult<OrderInfo>> {
  return request({
    url: '/pay/order/detail',
    method: 'get',
    params: {origiOrderNo},
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
  // let name = code;
  // AppModule.orderStatus.forEach((item) => {
  //   if (item.value === code) {
  //     name = item.label;
  //     return false;
  //   }
  // });
  // return name;
  return statusToName(code, AppModule.orderStatus);

}

export function ossOrderSourceName(code: number) {
  // let name = code + '';
  // AppModule.ossOrderSource.forEach((item) => {
  //   if (item.value === code) {
  //     name = item.label;
  //     return false;
  //   }
  // });
  // return name;
  return statusToName(code, AppModule.ossOrderSource);
}

export function cardInfoStatusName(code: number) {
  return statusToName(code, AppModule.cardInfoStatus);
}

export function cardBatchStatusName(code: number) {
  return statusToName(code, AppModule.cardBatchStatus);
}

export function layoutStatusName(code: number) {
  return statusToName(code, AppModule.layoutStatus);
}
export function expStatusName(code: string) {
  return statusToName(code, AppModule.expStatus);
}
export function statusToName(code: number | string, valus: StatusInfo[]) {
  let name = code + '';
  const strCode = code + '';
  valus.forEach((item) => {
    if (item.value === strCode) {
      name = item.label;
      return false;
    }
  });
  return name;
}

export function nopassportSignStatusToName(code: number) {
   return statusToName(code, AppModule.nopassPortSignStatus);
}

export function getCardInfoList(params: CardInfoListQuery): AxiosPromise<ResponseResult<Pageable<CardInfo>>> {
  return request({
    url: '/pay/card-info/list',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function getOrderRefundInfoList(params: OrderRefundInfoListQuery): AxiosPromise<ResponseResult<Pageable<OrderRefundInfo>>> {
  return request({
    url: '/pay/order-refund/list',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function payExpOrderInfo(payExpId: number): AxiosPromise<ResponseResult<string>> {
  return request({
    url: '/pay/order/pay-exp',
    method: 'get',
    params: {payExpId},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}
