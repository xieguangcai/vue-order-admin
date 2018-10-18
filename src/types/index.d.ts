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
  value: number|string;
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


//------------pay------------
export interface OrderInfo {
  orderId: number;
  orderNo: string;
  origiOrderNo: string;
  prodCatalog?: string;
  payMod?: string;
  prodName: string;
  orderTime: string;
  payTime?: string;
  completedTime?: string;
  orderAmount: number;
  actualAmount?: number;
  royaltyRate?: string;
  delyDetailAddr?: string;
  orderStatus?: string;
  isReturn?: string;
  appTypeCode?: string;
  appCode: string;
  appName: string;
  userId: number;
  phoneNo: string;
  mac?: string;
  shopNo?: string;
  apkPackageName?: string;
  apkVersionCode?: string;
  callBackUrl?: string;
  remark?: string;
  channelNo?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  appRealName?: string;
  ybDealNo?: string;
  serialNo?: string;
  appTypeCodeValue?: string;
  payModValue?: string;
  appCName?: string;
  statusRemark?: string;
  thirdPayName?: string;
  thirdPayMod?: string;
  coinsNum?: string;
  ccRoyalty?: string;
  partnerRoyalty?: string;
  orderSource?: string;
  invoiceTitle?: string;
  invoiceType?: string;
  hasInvoice?: string;
  payPhoneNo?: string;
  payUserId?: string;
  discount?: string;
  currencyCode?: string;

  orderInfoExtend?: OrderInfoExtend[];
  orderOpenidInfo?: OrderOpenidInfo[];
  orderSerialInfos?: OrderSerialInfo[];
  paySerialInfos?: PaySerialInfo[];
  payExpInfos?: PayExpInfo[];
  trnInfos?: TrnInfo[];
}

export interface OrderInfoExtend {
  extendId : number;
  orderId : number;
  activatedId? : string;
  openId? : string;
  bindTime? : string;
  extend1? : string;
  extend2? : string;
  extend3? : string;
  extend4? : string;
  extend5? : string;
  extend6? : string;
  extend7? : string;
  extend8? : string;
  extend9? : string;
  extend10? : string;
  extend11? : string;
  extend12? : string;
}
export interface OrderOpenidInfo {
  id: number;
  orderId: number;
  openid?: string;
  flag?: string;
  mac?: string;
  activatedId?: string;
  appCode?: string;
  appTypeCode?: string;
  createTime?: string;
}
export interface OrderSerialInfo {
  serialId: number;
  serialNo: string;
  tradeNo?: string;
  retOrderNo?: string;
  returnTime?: string;
  payTime?: string;
  orderAmount?: number;
  returnParam?: string;
  payMod?: string;
  orderId?: number;
  payStatus?: number;
  createdDate?: string;
  lastUpdateDate?: string;
}
export interface PaySerialInfo {
  id: number;
  orderId: number;
  serialNo: string;
  type: string;
  status?: number;
  phone?: string;
  successTime?: string;
  createdTime?: string;
  modifyTime?: string;
  queNum?: string;
  remark1?: string;
  remark2?: string;
  remark3?: string;
  payMod?: string;
}
export interface PayExpInfo {
  payExpId: number;
  expType: string;
  rechgId?: number;
  orderId?: number;
  retOrderId?: number;
  contact?: string;
  expTime?: string;
  status?: string;
  remark?: string;
  modifiedBy?: string;
  modifiedTime?: string;

}
export interface TrnInfo {
  trnId: number;
  userId: number;
  phoneNo?: string;
  rechgId?: string;
  prodCatalog?: string;
  orderNo?: string;
  retOrderNo?: string;
  trnType: string;
  trnCode: string;
  dealNo?: string;
  trnTime?: string;
  trnAmount: number;
  balance?: string;
  comScore?: string;
  bankName?: string;
  accountNo?: string;
  ybDealNo?: string;
  createdTime?: string;
  remark?: string;
}
//查询
export interface OrderInfoListQuery extends IPageinfo{
  mac?: string;
  phoneNo?: string;
  orderNo?: string;
  origiOrderNo?: string;
  ybDealNo?: string;
  serialNo?: string;
  appCode?: string;
  orderStatus?: string;
  orderTime?: string[];
  payTime?: string[];
}
//------------pay------------
