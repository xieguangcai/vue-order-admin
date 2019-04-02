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

