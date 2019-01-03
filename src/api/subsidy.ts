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
  SysLoginLayoutModel,
  BaseMoviesIqiyiOrderBaseListQuery,
  BaseMoviesIqiyiOrderBase,
  SearchHistoryModel,
  SubsidyUserDetailSearchQuery,
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

export function editActivity(data: SubsidyActivityInfo): AxiosPromise<ResponseResult<boolean>> {
  return request({
    url : '/subsidy/edit/activity',
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

export function toAuditActivity(id: number) {
  return request({
    url : '/subsidy/toAudit/activity',
    method: 'get',
    params: {id},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function offlineActivity(id: number) {
  return request({
    url : '/subsidy/offline/activity',
    method: 'get',
    params: {id},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function auditActivity(id: number, isAgree: boolean) {
  return request({
    url : '/subsidy/audit/activity',
    method: 'get',
    params: {id, isAgree},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function getSubsidyList(activityId: number): AxiosPromise<ResponseResult<Array<SubsidyType | undefined>>> {
  return request({
    url: '/subsidy/list/allowance',
    method: 'get',
    params: {activityId},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function getSubsidDetail(activityId: number, id: number): AxiosPromise<ResponseResult<SubsidyType>> {
  return request({
    url: '/subsidy/detail/allowance',
    method: 'get',
    params: {activityId, id},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function addSubsidy(activityId: number, subsidyName: string | undefined, money: number | undefined, sendNum: number | undefined): AxiosPromise<ResponseResult<boolean>> {
  return request({
    url : '/subsidy/add/allowance',
    method: 'post',
    params: {activityId, subsidyName, money, sendNum},
  });
}

export function editSubsidy(activityId: number, subsidyId: number, subsidyName: string | undefined, sendNum: number | undefined): AxiosPromise<ResponseResult<boolean>> {
  return request({
    url : '/subsidy/edit/allowance',
    method: 'post',
    params: {activityId, subsidyId, subsidyName, sendNum},
  });
}

export function deleteSubsidy(activityId: number, ids: Array<number | undefined>) {
  return request({
    url : '/subsidy/delete/allowance',
    method: 'get',
    params: {activityId, ids},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function getSubsidySerialList(params: SubsidyUserDetailSearchQuery): AxiosPromise<ResponseResult<Pageable<SubsidyUserDetail>>> {
  return request({
    url: '/subsidy/list/subsidySerial',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}
