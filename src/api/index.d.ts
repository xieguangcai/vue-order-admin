export interface Pageable {
  page: number;
  size: number;
  total: number;
}

export interface ResponseResult<T> {
  success: boolean;
  message: string;
  code: string;
  data: T;
}
export interface Pageable {
  content: any;
  number: number;
  size: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  totalPages: number;
}


export type AccountStatus = 1|2;
export interface StatusInfo {
  value: number;
  label: string;
}

export interface AccountInfo {
  accountId?: number;
  accountStatus: AccountStatus;
  nickName?: string;
  userName?: string;
  pwd?: string;
  salt?: string;
  lastLoginIp?: string;
  email?: string;
  department?: string;
  memo?: string;
  avatar?: string;
  lastLoginTime?: string;
  createTime?: string;
  modifyTime?: string;
}
