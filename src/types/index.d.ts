// export interface Pageable {
//   page: number;
//   size: number;
//   total: number;
// }

import {Dictionary} from 'vue-router/types/router';

export interface IPageinfo extends Dictionary<any> {
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


export type AccountStatus = 1 | 2;

export interface StatusInfo {
  value: number | string;
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

export type RoleStatus = 1 | 2;

export interface RoleInfo {
  roleId: number;
  roleKey?: string;
  name?: string;
  status?: RoleStatus;
  createTime?: string;
  modifyTime?: string;
  application?: ApplicationInfo;
}

export type AppStatus = 1 | 2;
export type AppType = 1 | 2;

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


// ------------pay------------
export interface OrderInfo {
  orderId: number;
  orderNo?: string;
  origiOrderNo?: string;
  prodCatalog?: string;
  payMod?: string;
  prodName?: string;
  orderTime?: string;
  payTime?: string;
  completedTime?: string;
  orderAmount?: number;
  actualAmount?: number;
  royaltyRate?: string;
  delyDetailAddr?: string;
  orderStatus?: string;
  isReturn?: string;
  appTypeCode?: string;
  appCode?: string;
  appName?: string;
  userId?: number;
  phoneNo?: string;
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
  extendId: number;
  orderId: number;
  activatedId?: string;
  openId?: string;
  bindTime?: string;
  extend1?: string;
  extend2?: string;
  extend3?: string;
  extend4?: string;
  extend5?: string;
  extend6?: string;
  extend7?: string;
  extend8?: string;
  extend9?: string;
  extend10?: string;
  extend11?: string;
  extend12?: string;
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

// 查询
export interface OrderInfoListQuery extends IPageinfo {
  mac?: string;
  phoneNo?: string;
  orderNo?: string;
  origiOrderNo?: string;
  ybDealNo?: string;
  serialNo?: string;
  appCode?: string;
  orderStatus?: string;
  orderTimes?: string[];
  payTimes?: string[];
  orderId?: string;
}

export interface UserInfoFull {
  userId: number;
  phoneNo?: string;
  nickname?: string;
  userName?: string;
  userType?: string;
  userGradeId?: string;
  appTypeCode?: string;
  appTypeName?: string;
  verifiCode?: string;
  bindQty?: string;
  registerTime?: string;
  userStatus?: string;
  idcardNo?: string;
  sex?: string;
  birthday?: string;
  postcode?: string;
  regionCode?: string;
  regionName?: string;
  address?: string;
  email?: string;
  occupation?: string;
  eduGrd?: string;
  annualIncome?: string;
  hobbies?: string;
  viewingPrefer?: string;
  shoppingPrefer?: string;
  moviePrefer?: string;
  gamePrefer?: string;
  userPwd?: string;
  pwdMask?: string;
  remark?: string;
  modifiedBy?: string;
  modifiedTime?: string;

  protocols?: AutomaticDeductionProtocol[];
  noPassportSigns?: PayNoPassportSign[];
}

export interface AutomaticDeductionProtocol {
  id: number;
  userId?: number;
  phoneNo?: string;
  appCode?: string;
  scene?: string;
  externalSignNo?: string;
  agreementNo?: string;
  signTime?: string;
  validTime?: string;
  invalidTime?: string;
  openId?: string;
  status: number;
  modifyTime?: string;
  prodName?: string;
  memo?: string;
  price?: string;
  originalPrice?: string;
  priceUnit?: string;
  clientType?: string;
  notifyUrl?: string;
  unsignTime?: string;
}

export interface PayNoPassportSign {
  id: number;
  userId: number;
  payMethod?: string;
  mobile?: string;
  status: number;
  validTime?: string;
  invalidTime?: string;
  signScene?: string;
  signTime?: string;
  signModifyTime?: string;
  createTime?: string;
  modifyTime?: string;
  signUserId?: string;
  signInfo?: string;
  orderId?: number;
  noPassportSignAuths?: PayNoPassportSignAuth[];
}

export interface PayNoPassportSignAuth {
  id: number;
  deviceId?: string;
  userId: number;
  mobile?: string;
  authTime?: string;
  status?: string;
  createTime?: string;
  modifyTime?: string;
}

export interface CardInfo {
  cardId?: number;
  cardPid?: number;
  cardNo?: string;
  cardPwd?: string;
  cardStatus?: number;
  creatDate?: string;
  usedDate?: string;
  openId?: string;
  flag?: string;
  appCode?: string;
  orderNo?: string;
  extOpenId?: string;
  extAppId?: string;
  serviceType?: string;
  mac?: string;
  sn?: string;
  memo?: string;
  warehouseId?: number;
  resourceId?: number;
  serviceId?: number;
  tvModel?: string;
  tvChip?: string;
  activeSource?: string;
  tvBrand?: string;
  modifyDate?: string;
  activeOrderNo?: string;
  cardBatch?: CardBatch;
  cardResource?: CardResouce;
  cardService?: CardService;
}

export interface CardResouce {
  id?: number;
  cardResourceName?: string;
  tipResourceName?: string;
  resourceCode?: string;
  erpCode?: string;
  resourceSupplier?: string;
  status?: number;
  purchasePrice?: number;
  salePrice?: number;
  memo?: string;
  createBy?: string;
  createDate?: string;
  modifyBy?: string;
  modifyDate?: string;
  waringEmail?: string;
  waringMobile?: string;
}

export interface CardService {
  serviceId?: number;
  flag?: string;
  serviceType?: string;
  serviceName?: string;
  createBy?: string;
  creatDate?: string;
  appCode?: string;
  extAppId?: string;
  modifyBy?: string;
  modifyDate?: string;
  thirdData?: string;
  memo?: string;
  notifyUrl?: string;
  validTime?: number;
  validTimeUnit?: string;
  serviceStartTime?: string;
  serviceEndTime?: string;
  totalServiceNum?: number;
  canUseNum?: number;
  totalUseNum?: number;
  cardType?: string;
  cardModel?: string;
  resourceId?: number;
  resourceServiceType?: number;
}

export interface CardBatch {
  cardPid?: number;
  startDate?: string;
  endDate?: string;
  cardPno?: string;
  prefix?: string;
  useMaxNum?: number;
  cardBatchStatus?: number;
  cardBatchName?: string;
  creatDate?: string;
  createBy?: string;
  modifyDate?: string;
  createCarNum?: number;
  usedCarNum?: number;
  cardPar?: string;
  cardSettlement?: string;
  cardPtype?: string;
  memo?: string;
  cardBillDetailId?: number;
  useCardToken?: string;
  oaBillNo?: string;
  waringEmail?: string;
  waringMobile?: string;
  isUseLimit?: number;
}

export interface CardInfoListQuery extends IPageinfo {
  orderNo?: string;
  cardNo?: string;
  cardPwd?: string;
  cardStatus?: string;
  mac?: string;
  usedDate?: string[];
}
// ------------pay------------


// --------passport---------------
export interface SysAccount {
  accountId: number;
  skyId?: string;
  reservedId?: string;
  visitNum?: number;
  userName?: string;
  nickName?: string;
  mobile?: string;
  email?: string;
  salt?: string;
  passwordType?: string;
  password?: string;
  verifyStatus?: string;
  accountType?: string;
  accountStatus?: string;
  score?: string;
  externalFlag?: string;
  externalId?: string;
  lastTime?: string;
  lastIp?: string;
  adminType?: string;
  clientId?: string;
  createDate?: string;
  updater?: string;
  updateDate?: string;
  creator?: string;
  reservedFlag?: string;
  openId?: string;
  balance?: string;
  bindDevices?: SysAccountBindDevice[];
  bindExternals?: SysAccountBindExternal[];
  eduVips?: SysAccountEduVip[];
  bindLogs?: SysAccountBindLog[];
  user?: SysUser[];
  fromMergeInfos?: SysUserMergeInfo[];
  toMergeInfos?: SysUserMergeInfo[];
}

export interface SysAccountBindDevice {
  bindId: number;
  accountId?: number;
  deviceId?: string;
  cUdid?: string;
  deviceType?: string;
  deviceName?: string;
  isBind?: string;
  lastIp?: string;
  bindTime?: string;
}

export interface SysAccountBindExternal {
  bindId: number;
  accountId: number;
  externalFlag: string;
  externalId: string;
  bindTime?: string;
  externalNickname?: string;
  externalAvatar?: string;
  vuserid?: string;
  vusession?: string;
  unionid?: string;
}

export interface SysAccountEduVip {
  vipId?: number;
  accountId?: number;
  createdDate?: string;
  openDate?: string;
  endDate?: string;
  openStatus?: string;
  openContent?: string;
  orderNo?: string;
  rightsName?: string;
}

export interface SysAccountBindLog {
  bindLogId?: number;
  externalFlag?: string;
  externalId?: string;
  bindStatus?: string;
  createTime?: string;
  bindFrom?: string;
  memo?: string;
  sysAccountByAccountId?: string;
  accountId?: string;
}

export interface SysUser {
  userId: number;
  regionId?: string;
  address?: string;
  postcode?: string;
  idcard?: string;
  userType?: string;
  userStatus?: string;
  gender?: string;
  birthday?: string;
  email2?: string;
  tel1?: string;
  tel2?: string;
  avatar?: string;
  slogan?: string;
  birthRegion?: string;
  birthAddress?: string;
  hobbies?: string;
  revenue?: string;
  industryId?: string;
  occupation?: string;
  school?: string;
  corp?: string;
  qq?: string;
  wechat?: string;
  weibo?: string;
  skype?: string;
  line?: string;
  homeUrl?: string;
  lastName?: string;
  firtstName?: string;
  createDate?: string;
  updateDate?: string;
  creator?: string;
  updater?: string;
  educationGrade?: string;
  updateImageTimes?: string;
}

export interface JscnUserInfo {
  id?: number;
  userId?: string;
  lastUpdateTime?: string;
  userPassword?: string;
  smartCardId?: string;
  tvCode?: string;
  settopboxId?: string;
  imsNumber?: string;
  userName?: string;
  customerGroup?: string;
  education?: string;
  familyInfo?: string;
  phoneNumber?: string;
  districtCode?: string;
  districtName?: string;
  customerType?: string;
  customerLevel?: string;
  status?: string;
  userType?: string;
  customerCode?: string;
  email?: string;
  managementStationId?: string;
  managementStationName?: string;
  baseStatus?: string;
  interactiveStatus?: string;
  stbMac?: string;
  cmMac?: string;
}

export interface SysUserMergeInfo {
  id?: number;
  fromOpenId?: string;
  toOpenId?: string;
  fromUserInfo?: string;
  toUserInfo?: string;
  fromExtUserInfo?: string;
  toExtUserInfo?: string;
  createTime?: string;
  modifyTime?: string;
}

export interface OrderRefundInfo {
  id?: number;
  refundNo?: string;
  orderId?: number;
  refundDate?: string;
  returnParam?: string;
  refundFee?: string;
  refundId?: string;
  transactionId?: string;
  refundStatus?: string;
  refundChannel?: string;
  payMod?: string;
  lastUpdateDate?: string;
  serialNo?: string;
  dealNo?: string;
  appTypeCode?: string;
  phoneNo?: string;
  origiOrderNo?: string;
}

export interface OrderRefundInfoListQuery extends IPageinfo {
  orderNo?: string;
  origiOrderNo?: string;
  dealNo?: string;
  serialNo?: string;
  appCode?: string;
  mac?: string;
  phoneNo?: string;
  transactionId?: string;
}

export interface RedisValueInfo {
  value?: any;
  ttlTime?: number;
}

interface SysAccountQuery {
  mobile?: string;
  openId?: string;
  externalFlag?: string;
  externalId?: string;
}
interface SysAccountQueryConstructor {
  (value?: any): SysAccountQuery;
  readonly prototype: SysAccountQuery;
  new(value?: any): SysAccountQuery;
}

declare const SysAccountQuery: SysAccountQueryConstructor;

/**
 *  客户端native登录ui元素类型-start
 */
export type UiItemType = 'COMMON'|'TEXT'| 'IMAGE'| 'BUTTON'| 'TEXT_VERSION'|'IMAGE_QR_CODE'|'COMMON_LOGIN_BY_MOBILE';
export type UiPageSwitchType = 'up_down'| 'left_right';
export interface UiSwitchPageData {
  name?: string;
  keyCode: number;
  toPageId?: number;
}
export interface UiItemData {
  zIndex?: number;
  id?: number;
  type: UiItemType;
  name?: string;
  w: number;
  h: number;
  x: number;
  y: number;
  text?: string;
  size?: number;
  color?: string;
  bold?: boolean;
  isBG?: boolean;
  imgUrl?: string;
  imgMd5?: string;
  imgName?: string;
  focusImgUrl?: string;
  focusImgMd5?: string;
  focusImgName?: string;
  clickAction?: string;
  bgColor?: string;

}
export interface UiPageData {
  id?: number;
  name?: string;
  isDefault: boolean;
  itemList?: UiItemData[];
  switchPage?: UiSwitchPageData[];
}
export interface UiContentData {
  commonBg: UiItemData;
  switchType: UiPageSwitchType;
  pageList: UiPageData[];
}

export interface SysLoginLayoutModel {
  id: number;
  name: string;
  createTime?: string;
  modifyTime?: string;
  mac?: string;
  minVersion?: string;
  status: number;
  content?: string;
  creator?: string;
  editor?: string;
  auditor?: string;
  sourceSign?: string;
  startTime?: string;
  endTime?: string;
  priority?: number;
  uiContentData: UiContentData;
}
export interface SysLoginLayoutListQuery extends IPageinfo {
  name?: string;
  status?: string;
  validTime?: string[];
}

export interface UploadFileInfo {
  url: string;
  fileName: string;
  md5: string;
}
/**
 *  客户端native登录ui元素类型-end
 */
// --------passport---------------


// --------authentication---------

export interface BaseMoviesIqiyiOrderBase {
  id?: number;
  orderNo?: string;
  orderSource?: string;
  thirdData?: string;
  payTradeNo?: string;
  synTradeNo?: string;
  payCardNo?: string;
  thirdCardNo?: string;
  activityId?: string;
  coocaaOpenId?: string;
  thirdOpenId?: string;
  wxVuOpenId?: string;
  thirdAppid?: string;
  appcode?: string;
  sourceId?: number;
  sourceSign?: string;
  productId?: number;
  productType?: string;
  movieId?: string;
  movieType?: string;
  payPrice?: number;
  buyCount?: number;
  totalFee?: number;
  totalDiscountFee?: number;
  totalPayFee?: number;
  title?: string;
  description?: string;
  mac?: string;
  tvId?: string;
  clientType?: string;
  paymentMode?: string;
  ip?: string;
  mobile?: string;
  createTime?: string;
  lastUpdateTime?: string;
  payTime?: string;
  payFlag?: number;
  payDesc?: string;
  synFlag?: number;
  synTimes?: string;
  modifyPermissionFlag?: number;
  beginTime?: string;
  dueTime?: string;
  testFlag?: number;
  serviceStatus?: number;
  orderType?: string;
  synWay?: string;
  synParams?: string;
  synDatetime?: string;
  flag?: number;
  orderProduct?: BaseOrderProducts;
  baseOrderSource?: BaseOrderSource;
}

// export interface BaseMoviesIqiyiOrder extends BaseMoviesIqiyiOrderBase {
//
// }
//
// export interface BaseMoviesIqiyiOrder2017History extends BaseMoviesIqiyiOrderBase {
//
// }
//
// export interface BaseMoviesIqiyiOrderHistory extends BaseMoviesIqiyiOrderBase {
//
// }

export interface BaseOrderProducts {
  productId?: number;
  openType?: number;
  uniqueCode?: string;
  erpCode?: string;
  productType?: string;
  ticketId?: number;
  sourceId?: number;
  sourceSign?: string;
  productName?: string;
  productTitle?: string;
  productLevel?: number;
  unitFee?: number;
  discountFee?: number;
  buyCount?: number;
  baseDescription?: string;
  validCount?: number;
  validUnit?: string;
  clientSort?: number;
  isAlert?: number;
  supportOtherDiscount?: number;
  orderPrefix?: string;
  productSynWay?: number;
  openServiceSetting?: string;
  openServiceParams?: string;
  description?: string;
  showStlye?: number;
  icon?: string;
  v1ThumbImage?: string;
  v2ThumbImage?: string;
  webThumbImage?: string;
  openMaParams?: string;
  openMaStartTime?: string;
  openMaEndTime?: string;
  openCardToken?: string;
  isThreeTerminal?: number;
  extendedAttribute?: string;
  totalCount?: string;
  isUnpaid?: number;
  userLimitTimes?: string;
  userLimitBuyNotice?: string;
  creater?: string;
  createdDate?: string;
  modifier?: string;
  lastUpdateDate?: string;
  flag?: number;
  productStatus?: number;
  productModel?: number;
  unpayMsgPush?: number;
}

export interface BaseOrderSource {
  sourceId?: number;
  sourceModel?: number;
  businessType?: number;
  sourceType?: number;
  sourceSign?: string;
  sourceName?: string;
  recommendBuyPid?: number;
  keeppayPid?: number;
  pushType?: number;
  clientSort?: number;
  company?: string;
  cmdAction?: string;
  cmdActionserver?: string;
  description?: string;
  sourceIcon?: string;
  v1ThumbImage?: string;
  v1DescImage?: string;
  v1ChildBgImage?: string;
  v2ThumbImage?: string;
  v2DescImage?: string;
  icon?: string;
  weixinBgImage?: string;
  v2BgImage?: string;
  v2ChildBgImage?: string;
  v2CmdAction?: string;
  v2CmdActionParams?: string;
  webVipcenterBg?: string;
  buttonTitle?: string;
  buttonAction?: string;
  buttonActionParams?: string;
  validWay?: number;
  flag?: number;
  sourceStatus?: number;
  creater?: number;
  createdDate?: string;
  modifier?: number;
  lastUpdateDate?: string;
  authenticationSubject?: number;
  backUrl?: string;
}


export type SearchHistoryModel = '0' | '1' | '2'; // 为了能与url地址带查询条件联合在一起，查询条件中需要定义字符类型的查询否则下拉列表中的转换会出错。
export type SearchFlag = '' | OrderFlag;
export type OrderFlag = '0' | '1';

export interface BaseMoviesIqiyiOrderBaseListQuery extends IPageinfo {
  searchHistory: SearchHistoryModel; // 0 为查询历史订单
  orderNo?: string;
  coocaaOpenId?: string;
  thirdOpenId?: string;
  productId?: string;
  productType?: string;
  mac?: string;
  tvId?: string;
  payFlag?: SearchFlag;
  synFlag?: SearchFlag;
  createTimes?: string[];
  payTimes?: string[];
}

// --------authentication---------


export enum Roles {
  ROLE_VIEW = 'ROLE_VIEW',
  ROLE_EDIT = 'ROLE_EDIT',
  ROLE_AUDIT = 'ROLE_AUDIT',
  ROLE_ADMIN = 'ROLE_ADMIN',
  LAYOUT_ROLE_VIEW = 'LAYOUT_ROLE_VIEW',
  LAYOUT_ROLE_EDIT = 'LAYOUT_ROLE_EDIT',
  LAYOUT_ROLE_AUDIT = 'LAYOUT_ROLE_AUDIT',

}


// -------- subsidy ---------
export interface SubsidyActivityInfo {
  subsidyActivityId: number;
  name?: string;
  subsidyCode?: string;
  subsidyStatus?: number;
  validStartTime?: string;
  validEndTime?: string;
  memo?: string;
  createTime?: string;
  createBy?: string;
  modifyTime?: string;
  modifyBy?: string;
  auditTime?: string;
  auditBy?: string;
  useStartTime?: string;
  useEndTime?: string;
  sendMoney?: number;
  useMoney?: number;
  receiveMoney?: number;
  subsidyNum?: number;
  subsidyInfoList?: SubsidyType[];
}

export interface ActivityListQuery extends IPageinfo {
  searchValue?: string;
}

export interface SubsidyUserTotal {
  subsidyActivityId: number;
  userTotalId: number;
  money?: number;
  openId?: string ;
  nickName?: string ;
  createTime?: string ;
  modifyTime?: string ;
}

export interface SubsidyUserDetail {
  userDetailId?: number;
  subsidyTypeId?: number;
  subsidyName?: string ;
  subsidyActivityId: number;
  type?: number;
  money?: number;
  openId?: string ;
  nickName?: string ;
  businessName?: string ;
  mac?: string ;
  cudid?: string;
  orderNo?: string ;
  status?: number ;
  lockEndTime?: string ;
  lockTime?: string ;
  createTime?: string ;
  modifyTime?: string ;
  driver?: string ;
  moneyStr?: string;
}

export interface SubsidyType {
  subsidyTypeId: number;
  subsidyTypeCode?: string;
  typeName?: string;
  subsidyActivityId?: number;
  sendNum?: number ;
  receiveNum?: number ;
  money?: number;
  createTime?: string ;
  modifyTime?: string ;
}

export interface SubsidyUserDetailSearchQuery extends IPageinfo {
  searchValue?: string;
  activityId: number;
  serialType: number;
  businessName?: string;
  createTime?: Date[];
}
