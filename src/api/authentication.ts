import request from '@/utils/request-authenticaton';
import {
  BaseMoviesIqiyiOrderBase,
  BaseMoviesIqiyiOrderBaseListQuery,
  CascaderDataType,
  IqiyiGoldVipQueryList,
  OrderFlag,
  OrderPermissionListQuery,
  OrderPermissionsInfo,
  Pageable,
  ResponseResult,
  SearchHistoryModel,
} from '@/types';
// @ts-ignore
import qs from 'qs';
import {AxiosPromise, AxiosResponse} from 'axios';
import {AppModule} from '@/store/modules/app';


/**
 * --------------------authentication相关接口-------------------------
 */
export function getBaseMoviesIqiyiOrderBaseList(params: BaseMoviesIqiyiOrderBaseListQuery): AxiosPromise<ResponseResult<Pageable<BaseMoviesIqiyiOrderBase>>> {
  return request({
    url: '/authentication/order/list',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function getBaseMoviesIqiyiOrderBaseDetail(orderId: number, searchHistoryModel: SearchHistoryModel): AxiosPromise<ResponseResult<BaseMoviesIqiyiOrderBase>> {
  return request({
    url: '/authentication/order/detail',
    method: 'get',
    params: {orderId, searchHistoryModel },
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function clientTypeToName(code: number) {
  let name = code + '';
  AppModule.clientType.forEach((item) => {
    if (item.value === code) {
      name = item.label;
      return false;
    }
  });
  return name;
}

export function orderTypeToName(code: number) {
  let name = code + '';
  AppModule.orderType.forEach((item) => {
    if (item.value === code) {
      name = item.label;
      return false;
    }
  });
  return name;
}
export function payFlagClassName(payFlag: OrderFlag): string {
  if (payFlag === '0') {
    return 'warning-row';
  } else if (payFlag === '1') {
    return 'success-row';
  }
  return '';
}

export function getOrderPermissionsInfo(params: OrderPermissionListQuery): AxiosPromise<ResponseResult<OrderPermissionsInfo[]>> {
  return request({
    url: '/authentication/order/permissions',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}


export function getCompanyOrderSource(): AxiosPromise<ResponseResult<CascaderDataType[]>> {
  return request({
    url: '/authentication/order/company-order-source',
    method: 'get',
  });
}

export function getIqiyiGoldVipQueryList(openId: string): AxiosPromise<ResponseResult<IqiyiGoldVipQueryList>> {
  return request({
    url: '/authentication/iqiyi/query-gold-vip-list',
    method: 'get',
    params: { openId },
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}


/**
 * --------------------authentication相关接口-------------------------
 */
