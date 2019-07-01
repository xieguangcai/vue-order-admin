import request from '@/utils/request-authenticaton';
import {
  RightsInfoListQuery,
  RightsInfo,
  Pageable,
  ResponseResult,
} from '@/types';
// @ts-ignore
import qs from 'qs';
import {AxiosPromise, AxiosResponse} from 'axios';

export function getRightsInfoList(params: RightsInfoListQuery): AxiosPromise<ResponseResult<Pageable<RightsInfo>>> {
  return request({
    url: '/authentication/rightsinfo/pagelist',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}


export function saveData(data: RightsInfo): AxiosPromise<ResponseResult<boolean>> {
  return request({
    url: '/authentication/rightsinfo/add',
    method: 'post',
    params: data,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

