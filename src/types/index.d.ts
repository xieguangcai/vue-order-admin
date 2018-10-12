// export interface Pageable {
//   page: number;
//   size: number;
//   total: number;
// }

export interface IPageinfo {
  page: number;
  size: number;
  total: number;
}

export interface AccountListQuery extends IPageinfo {
  userName: string;
  nickName: string;
  createTime?: string[];
  accountStatus?: number[];
}
export interface ApplicationListQuery extends IPageinfo {
  name: string;
  appKey: string;
}
export interface RoleListQuery extends IPageinfo {
  name: string;
  roleKey: string;
}
export interface ResponseResult<T> {
  success: boolean;
  message: string;
  code: string;
  data: T;
}
export interface Pageable<T = any> {
  content: T[];
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
  roles?: RoleInfo[];
}

export type RoleStatus = 1|2;

export interface RoleInfo {
  roleId?: number;
  roleKey?: string;
  name?: string;
  status?: RoleStatus;
  createTime?: string;
  modifyTime?: string;
  application?: ApplicationInfo;
}

export type AppStatus = 1|2;
export type AppType = 1|2;
export interface ApplicationInfo {
  appId?: number;
  appKey?: string;
  appSecret?: string;
  name?: string;
  memo?: string;
  status?: AppStatus;
  type?: AppType;
  createTime?: string;
  modifyTime?: string;
}
