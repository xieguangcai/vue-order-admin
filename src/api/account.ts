import request from '@/utils/request-account';

export function getList(params: any) {
  return request({
    url: '/user/list',
    method: 'get',
    params,
  });
}
