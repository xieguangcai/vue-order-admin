import request from '@/utils/request-subsidy';
import {
  SysAccountQuery,
  Pageable,
  RedisValueInfo,
  ResponseResult,
  SubsidyActivityInfo,
  ActivityListQuery,
  SubsidyUserTotal,
  SubsidyUserDetail,
  SubsidyType,
  SysLoginLayoutModel, BaseMoviesIqiyiOrderBaseListQuery, BaseMoviesIqiyiOrderBase, SearchHistoryModel,
} from '@/types';
// @ts-ignore
import qs from 'qs';
import {AxiosPromise, AxiosResponse} from 'axios';

/**
 * -------------------- subsidy 相关接口 -------------------------
 */
export function getActivityList(params: ActivityListQuery): AxiosPromise<ResponseResult<Pageable<SubsidyActivityInfo>>> {
  return request({
    url: '/subsidy/list/activity',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function getActivityDetail(id: number): AxiosPromise<ResponseResult<SubsidyActivityInfo>> {
  return request({
    url: '/subsidy/detail/activity',
    method: 'get',
    params: {id},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function addActivity(data: SubsidyActivityInfo): AxiosPromise<ResponseResult<boolean>> {
  return request({
    url : '/subsidy/add/activity',
    method: 'post',
    data,
  });
}

export function deleteActivity(ids: Array<number | undefined>) {
  return request({
    url : '/subsidy/delete/activity',
    method: 'get',
    params: {ids},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}
