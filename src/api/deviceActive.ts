import request from '@/utils/request-device';
import {
  Pageable,
  ResponseResult,
  DeviceActivityInfo, DeviceActivityInfoListQuery,
} from '@/types';
// @ts-ignore
import qs from 'qs';
import {AxiosPromise, AxiosResponse} from 'axios';

/**
 * --------------------active系统激活相关接口-------------------------
 */
export function getDeviceActivePageList(params: DeviceActivityInfoListQuery): AxiosPromise<ResponseResult<Pageable<DeviceActivityInfo>>> {
  return request({
    url: '/active/device/deviceActiveList',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}





