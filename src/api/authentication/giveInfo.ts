import request from '@/utils/request-authenticaton';
import {
  GiveInfo,
  Pageable,
  ResponseResult,
} from '@/types';
// @ts-ignore
import qs from 'qs';
import {AxiosPromise, AxiosResponse} from 'axios';

export function getGiveInfoPageList(params: GiveInfo): AxiosPromise<ResponseResult<Pageable<GiveInfo>>> {
  return request({
    url: '/authentication/giveinfo/pagelist',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}
