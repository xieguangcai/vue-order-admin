import request from "@/utils/request-authenticaton";
import {BaseOrderSource, Pageable, ResponseResult, SourceListQuery} from "@/types";
// @ts-ignore
import qs from "qs";
import {AxiosPromise} from "axios";

export function getSourcePageList(params: SourceListQuery): AxiosPromise<ResponseResult<Pageable<BaseOrderSource>>> {
  return request({
    url: '/authentication/source/pagelist',
    method: 'get',
    params,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function getSourceListByCompany(company: string): AxiosPromise<ResponseResult<BaseOrderSource[]>> {
  return request({
    url: '/authentication/source/querybycompany',
    method: 'get',
    params: {company},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function updateFlag(id: number, flag: number): AxiosPromise<ResponseResult<boolean>> {
  return request({
    url: '/authentication/source/updateFlag',
    method: 'post',
    params: {id, flag},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function querySource(id: number): AxiosPromise<ResponseResult<BaseOrderSource>> {
  return request({
    url: '/authentication/source/querySource',
    method: 'get',
    params: {id},
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}

export function saveSource(source: BaseOrderSource): AxiosPromise<ResponseResult<boolean>> {
  source.baseOrderCompany = undefined;
  return request({
    url: '/authentication/source/save',
    method: 'post',
    params: source,
    paramsSerializer(p: any) {
      return qs.stringify(p, {arrayFormat: 'repeat'});
    },
  });
}
