import request from '@/utils/request-authenticaton';
import {
  CompanyListQuery,
  Company,
  Pageable,
  ResponseResult,
} from '@/types';
// @ts-ignore
import qs from 'qs';
import {AxiosPromise, AxiosResponse} from 'axios';

export function getCompanyPageList(params: CompanyListQuery): AxiosPromise<ResponseResult<Pageable<Company>>> {
  return request({
    url: '/authentication/company/pagelist',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function getCompanyList(): AxiosPromise<ResponseResult<Company[]>> {
  return request({
    url: '/authentication/company/list',
    method: 'get',
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function addCompany(data: Company): AxiosPromise<ResponseResult<boolean>> {
  return request({
    url: '/authentication/company/add',
    method: 'post',
    params: data,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function getCompanyById(id: number): AxiosPromise<ResponseResult<Company>> {
  return request({
    url: '/authentication/company/getCompanyById',
    method: 'get',
    params: {id},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function updateStatus(id: number, status: number): AxiosPromise<ResponseResult<boolean>> {
  return request({
    url: '/authentication/company/updateStatus',
    method: 'post',
    params: {id, status},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}
