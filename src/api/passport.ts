import request from '@/utils/request-passport';
import {
  SysAccountQuery,
  Pageable,
  RedisValueInfo,
  ResponseResult,
  SysAccount,
  SysLoginLayoutListQuery,
  SysLoginLayoutModel,
  JscnUserInfo,
  JscnUserInfoQuery,
  ExternalAccessRecords,
  VideoImg,
  VideoImgListQuery,
  SysVideoInfo,
} from '@/types';
// @ts-ignore
import qs from 'qs';
import {AxiosPromise, AxiosResponse} from 'axios';

/**
 * --------------------pay相关接口-------------------------
 */
// export function getSysAccountInfoDetail(openId: string): AxiosPromise<ResponseResult<SysAccount>> {
//   return request({
//     url: '/passport/sys-account/detail',
//     method: 'get',
//     params: {openId},
//     paramsSerializer(p: any) {
//       return qs.stringify(p, {arrayFormat: 'repeat'});
//     },
//   });
// }

export function getSysAccountInfoDetail(params: SysAccountQuery): AxiosPromise<ResponseResult<SysAccount>> {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  return request({
    url: '/passport/sys-account/detail',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}




export function getMoblieCode(mobile: string): AxiosPromise<ResponseResult<RedisValueInfo>> {
  return request({
    url: '/passport/redis/mobile-code',
    method: 'get',
    params: {mobile},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function delMobileCheck(mobile: string): AxiosPromise<ResponseResult<string>> {
  return request({
    url: '/passport/redis/del-mobile-check',
    method: 'get',
    params: {mobile},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}


export function getLoginLayoutList(params: SysLoginLayoutListQuery): AxiosPromise<ResponseResult<Pageable<SysLoginLayoutModel>>> {
  return request({
    url: '/passport/sys-login-layout/view/list',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}


export function getLoginLayoutDetail(id: number): AxiosPromise<ResponseResult<SysLoginLayoutModel>> {
  return request({
    url: '/passport/sys-login-layout/view/detail',
    method: 'get',
    params: {id},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function addNewLoginLayout(data: SysLoginLayoutModel): AxiosPromise<ResponseResult<SysLoginLayoutModel>> {
  return request({
    url: '/passport/sys-login-layout/edit/add',
    method: 'post',
    data,
  });
}

export function updateLoginLayout(data: SysLoginLayoutModel): AxiosPromise<ResponseResult<boolean>> {
  return request({
    url: '/passport/sys-login-layout/edit/update',
    method: 'post',
    data,
  });
}

export function publisLoginLayoutTest(data: SysLoginLayoutModel): AxiosPromise<ResponseResult<boolean>> {
  return request({
    url: '/passport/sys-login-layout/edit/publish-test',
    method: 'post',
    data,
  });
}

export function publisLoginLayout(data: SysLoginLayoutModel): AxiosPromise<ResponseResult<boolean>> {
  return request({
    url: '/passport/sys-login-layout/audit/publish',
    method: 'post',
    data,
  });
}

export function offlineLoginLayout(id: number): AxiosPromise<ResponseResult<boolean>> {
  return request({
    url: '/passport/sys-login-layout/audit/offline',
    method: 'get',
    params: {id},
  });
}
export function copyLoginLayout(id: number): AxiosPromise<ResponseResult<boolean>> {
  return request({
    url: '/passport/sys-login-layout/edit/copy',
    method: 'get',
    params: {id},
  });
}

export function adjustPriority(id: number, priority: number): AxiosPromise<ResponseResult<boolean>> {
  return request({
    url: '/passport/sys-login-layout/audit/priority',
    method: 'get',
    params: {id, priority},
  });
}

export function passportMandatoryOffline(openId: string): AxiosPromise<ResponseResult<string>> {
  return request({
    url: '/passport/sys-account/mandatory-offline',
    method: 'get',
    params: {openId},
  });
}

export function jscnUserInfoList(params: JscnUserInfoQuery): AxiosPromise<ResponseResult<JscnUserInfo[]>> {
  return request({
    url: '/passport/jscn-user-info/list',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });

}

export function externalAccessRecordsList(userId: string): AxiosPromise<ResponseResult<ExternalAccessRecords[]>> {
  return request({
    url: '/passport/jscn-user-info/access-records',
    method: 'get',
    params: { userId},
  });

}

/***
 * vip运营图标
 * @param params
 */
export function getVideoImgPageList(params: VideoImgListQuery): AxiosPromise<ResponseResult<Pageable<VideoImg>>> {
  return request({
    url: '/passport/video-img/videoImgList',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}
/***
 * 修改vip购买运营图片信息
 * @param params
 */
export function updateVideoImg(data: VideoImg) {

  return request({
    url: '/passport/video-img/updateVideoImg?id=' + data.id + '&mobile=' + data.userType,
    method: 'get',
    data,
  });
}

export function getVideoImgInfo(id: number): AxiosPromise<ResponseResult<VideoImg>> {
  return request({
    url: '/passport/video-img/getVideoImgById',
    method: 'get',
    params: {id},
  });
}

/**
 * 添加vip购买运营图片信息
 */
export function saveVideoImg(data: VideoImg): AxiosPromise<ResponseResult<boolean>> {
  return request({
    url : '/passport/video-img/saveVideoImg',
    method: 'post',
    data,
  });
}

/**
 * CIBN用户信息列表
 */
export function getCibnAccountPageList(params: VideoImgListQuery): AxiosPromise<ResponseResult<Pageable<VideoImg>>> {
  return request({
    url: '/passport/cibn-account/cibnAccountList',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function getUserHistoryVideByOpenId(params: SysAccountQuery, pageNumber: number): AxiosPromise<ResponseResult<Pageable<SysVideoInfo>>> {
  const openId = params.openId;
  return request({
    url: '/passport/sys-account/history/get2',
    method: 'get',
    params: {openId, pageNumber},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}


