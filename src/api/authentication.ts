import request from '@/utils/request-authenticaton';
import {
  BaseMoviesIqiyiOrderBase,
  BaseMoviesIqiyiOrderBaseListQuery, OrderFlag,
  Pageable,
  ResponseResult, SearchHistoryModel,
  UserInfoFull,
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

/**
 * --------------------authentication相关接口-------------------------
 */
