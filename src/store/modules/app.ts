import Cookies from 'js-cookie';
import {VuexModule, Module, Mutation, Action, getModule, MutationAction} from 'vuex-module-decorators';
import store from '@/store';
import {ElementUIComponentSize} from 'element-ui/types/component';
import {CascaderDataType, IPageinfo, StatusInfo} from '@/types';
import {getCompanyOrderSource} from '@/api/authentication';

export enum DeviceType {
  Mobile,
  Desktop,
}

export interface IAppState {
  device: DeviceType;
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
  };
  formSize: ElementUIComponentSize;
  formLabelWidth: string;
  recordeStatus: StatusInfo[];
  // orderStatus: StatusInfo[];
  productStatus: StatusInfo[];
  businessType: StatusInfo[];
  schemeStatus: StatusInfo[];
  schemeScene: StatusInfo[];
  productType: StatusInfo[];
  // appTypeCodeStatus: StatusInfo[];
  ossOrderSource: StatusInfo[];
  clientType: StatusInfo[];
  orderType: StatusInfo[];
  cardInfoStatus: StatusInfo[];
  cardBatchStatus: StatusInfo[];
  layoutStatus: StatusInfo[];
  expStatus: StatusInfo[];
  ossDict: StatusInfo[];
  orderStatus: StatusInfo[];
  uploadAction: string;
  companyOrderSource: CascaderDataType[];
  // 每个页面默认数量
  pageSize: number;
}

export function propertyToName(code: number | string, valus: StatusInfo[]) {
  let name = code + '';
  const strCode = code + '';
  valus.forEach((item) => {
    if (item.value === strCode) {
      name = item.label;
      return false;
    }
  });
  return name;
}

@Module({dynamic: true, store, name: 'app'})
class App extends VuexModule {
  sidebar: IAppState['sidebar'] = {
    opened: Cookies.get('sidebarStatus') !== 'closed',
    withoutAnimation: false,
  };
  pageSize = 20;
  device: IAppState['device'] = DeviceType.Desktop;
  formSize: IAppState['formSize'] = 'small';
  formLabelWidth: IAppState['formLabelWidth'] = '120px';
  recordeStatus: IAppState['recordeStatus'] = [{value: 1, label: '正常'}, {value: 2, label: '禁用'}];
  // orderStatus: IAppState['orderStatus'] = [
  //   {value: 'CC00501', label: '待支付'},
  //   {value: 'CC00502', label: '待授信'},
  //   {value: 'CC00503', label: '完成'},
  //   {value: 'CC00504', label: '取消	'},
  //   {value: 'CC00505', label: '已发货'},
  //   {value: 'CC00506', label: '支付中'}];
  // appTypeCodeStatus: IAppState['orderStatus'] = [
  //   {value: 'CC01201', label: '影视'},
  //   {value: 'CC01202', label: '游戏'},
  //   {value: 'CC01203', label: 'PC商城'},
  //   {value: 'CC01204', label: '购物'},
  //   {value: 'CC01205', label: '教育'},
  //   {value: 'CC01206', label: '其他'},
  //   {value: 'CC01207', label: '旅游'},
  //   {value: 'CC01208', label: '音乐'},
  //   {value: 'CC01209', label: '广告'},
  //   {value: 'CC01210', label: '体育'},
  // ];
  ossOrderSource: IAppState['ossOrderSource'] = [
    {value: '1', label: 'tv端'},
    {value: '2', label: 'pc端'},
    {value: '3', label: '自动续费'},
    {value: '4', label: '移动端'},
    {value: '5', label: 'v1版支付'},
  ];
  clientType: IAppState['clientType'] = [
    // 下单设备类型(1TV，2天赐派，3微信，4tv-web版,5电视派APP,6IPtvWeb页面,7江苏广电线下订单,8教育订制机,9商城兑换,10试看出二维码已登录,11试看出二维码未登录)
    {value: '1', label: 'TV老版本'},
    {value: '2', label: '天赐派'},
    {value: '3', label: '微信'},
    {value: '4', label: 'tv-web版'},
    {value: '5', label: '电视派APP'},
    {value: '6', label: 'IPtvWeb页面'},
    {value: '7', label: '江苏广电线下订单'},
    {value: '8', label: '教育订制机'},
    {value: '9', label: '商城兑换'},
    {value: '10', label: '试看出二维码已登录'},
    {value: '11', label: '试看出二维码未登录'},
  ];
  orderType: IAppState['orderType'] = [
    {value: '0', label: '未知类型'},
    {value: '1', label: '普通支付'},
    {value: '2', label: '卡密兑换'},
    {value: '3', label: '用券兑换'},
    {value: '4', label: '活动赠送'},
    {value: '5', label: '线下导购'},
  ];
  cardInfoStatus: IAppState['cardInfoStatus'] = [
    {value: '1', label: '正常'},
    {value: '2', label: '开通中'},
    {value: '3', label: '已开通'},
    {value: '4', label: '作废'},
  ];
  cardBatchStatus: IAppState['cardBatchStatus'] = [
    {value: '0', label: '未审核'},
    {value: '1', label: '正常'},
    {value: '2', label: '作废'},
  ];
  layoutStatus: IAppState['layoutStatus'] = [
    {value: '0', label: '草稿'},
    {value: '1', label: '测试中'},
    {value: '2', label: '全网上线'},
    {value: '3', label: '下线'},
  ];

  nopassPortSignStatus: IAppState['layoutStatus'] = [
    {value: '0', label: '新建'},
    {value: '1', label: '签约'},
    {value: '2', label: '停止'},
    {value: '3', label: '解约'},
    {value: '4', label: '解约中'},
  ];
  expStatus: IAppState['expStatus'] = [
    {value: '0', label: '未处理'},
    {value: '1', label: '已处理'},
  ];
  uploadAction: IAppState['uploadAction']  = process.env.VUE_APP_PASSPORT_API + 'api/authentication/file/upload';

  // 公司于对应的产品源信息
  companyOrderSource: IAppState['companyOrderSource'] = [];

  productStatus: IAppState['productStatus'] = [
    {value: '0', label: '草稿'},
    {value: '1', label: '待审核'},
    {value: '2', label: '审核中'},
    {value: '3', label: '审核不通过	'},
    {value: '4', label: '审核通过'}];

  businessType: IAppState['businessType'] = [
    {value: '0', label: '影视'},
    {value: '1', label: '教育'},
    {value: '2', label: 'IPTV'},
    {value: '3', label: '体育'},
    {value: '4', label: '宽带提速	'},
    {value: '6', label: '游戏'}];

  schemeStatus: IAppState['schemeStatus'] = [
    {value: '0', label: '草稿'},
    {value: '1', label: '待测试'},
    {value: '2', label: '测试中'},
    {value: '3', label: '测试不通过	'},
    {value: '4', label: '测试通过'}];

  schemeScene: IAppState['schemeScene'] = [
    {value: 'v1', label: 'v1'},
    {value: 'v3', label: 'v3'},
    {value: 'web', label: 'web'}];

  productType: IAppState['productType'] = [
    {value: '1', label: '1个月'},
    {value: '2', label: '3个月'},
    {value: '3', label: '6个月'},
    {value: '4', label: '12个月'},
    {value: '6', label: '1星期'},
    {value: 'P-Month', label: '1个月'},
    {value: 'P-Season', label: '3个月'},
    {value: 'P-HalfYear', label: '6个月'},
    {value: 'P-Year', label: '12个月'},
    {value: 'P-Week', label: '1星期'},
    {value: 'P-5Days', label: '5天'},
    {value: 'P-36Days', label: '36天'},
    {value: 'P-4Months', label: '4个月'},
    {value: 'P-15Months', label: '15个月'},
    {value: 'P-3Days', label: '3天'},
    {value: 'P-21Days', label: '21天'},
    {value: 'P-7Months', label: '7个月'},
    {value: 'P-15Days', label: '15天'},
    {value: 'P-5Months', label: '5个月'},
    {value: 'P-18Months', label: '18个月'},
    {value: 'P-2Months', label: '2个月'}];
  orderStatus: IAppState['orderStatus'] = [
    {value: 'CC00501', label:	'待支付'},
    {value: 'CC00502', label:	'待授信'},
    {value: 'CC00503', label:	'完成'},
    {value: 'CC00504', label:	'取消'},
  ];
  ossDict: IAppState['ossDict'] = [
    {value: 'CC00201', label:	'普通用户'},
    {value: 'CC00202', label:	'潜在用户'},
    {value: 'CC00203', label:	'特殊用户'},
    {value: 'CC00299', label:	'其他'},
    {value: 'CC00301', label:	'影视包时'},
    {value: 'CC00302', label:	'影视点播'},
    {value: 'CC00303', label:	'游戏下载'},
    {value: 'CC0030401', label:	'购买游戏道具'},
    {value: 'CC00305', label:	'游戏包时'},
    {value: 'CC00306', label:	'PC商城订单'},
    {value: 'CC00307', label:	'积分兑换'},
    {value: 'CC00308', label:	'多店铺TV商城'},
    {value: 'CC00309', label:	'酷开淘宝店'},
    {value: 'CC00310', label:	'导购员分销订单'},
    {value: 'CC00311', label:	'客服订单'},
    {value: 'CC00399', label:	'其他'},
    {value: 'CC00401', label:	'用户余额'},
    {value: 'CC00402', label:	'银行借记卡'},
    {value: 'CC00403', label:	'银行信用卡'},
    {value: 'CC00404', label:	'货到付款'},
    {value: 'CC00405', label:	'支付宝扫码'},
    {value: 'CC00406', label:	'银行卡电话'},
    {value: 'CC00407', label:	'微信'},
    {value: 'CC00408', label:	'支付宝授权'},
    {value: 'CC00409', label:	'支付宝'},
    {value: 'CC00410', label:	'短代支付'},
    {value: 'CC00411', label:	'影视支付宝'},
    {value: 'CC00412', label:	'影视快钱'},
    {value: 'CC00413', label:	'微信(pc)'},
    {value: 'CC00414', label:	'易宝银行卡网银(pc)'},
    {value: 'CC00415', label:	'支付宝(PC)'},
    {value: 'CC00416', label:	'支付宝(WAP)'},
    {value: 'CC00417', label:	'银联(PC)'},
    {value: 'CC00418', label:	'银联(WAP)'},
    {value: 'CC00419', label:	'支付宝免密支付'},
    {value: 'CC00420', label:	'微信免密支付'},
    {value: 'CC00422', label:	'QQ钱包支付'},
    {value: 'CC00423', label:	'微信小程序支付'},
    {value: 'CC00499', label:	'其他'},
    {value: 'CC00501', label:	'待支付'},
    {value: 'CC00502', label:	'待授信'},
    {value: 'CC00503', label:	'完成'},
    {value: 'CC00504', label:	'取消'},
    {value: 'CC00505', label:	'已发货'},
    {value: 'CC00601', label:	'酷开卡充值'},
    {value: 'CC00603', label:	'银行信用卡充值'},
    {value: 'CC00604', label:	'优朋13W旧卡充值'},
    {value: 'CC00605', label:	'支付宝扫码支付'},
    {value: 'CC00606', label:	'银行卡电话充值'},
    {value: 'CC00607', label:	'微信支付-充值'},
    {value: 'CC00608', label:	'支付宝一键支付(授权)'},
    {value: 'CC00609', label:	'影视支付宝'},
    {value: 'CC00610', label:	'影视快钱'},
    {value: 'CC00699', label:	'其他'},
    {value: 'CC00701', label:	'虚拟订单退款'},
    {value: 'CC00702', label:	'实体订单退款'},
    {value: 'CC00703', label:	'充值退款'},
    {value: 'CC00801', label:	'处理中'},
    {value: 'CC00802', label:	'完成'},
    {value: 'CC00803', label:	'服务关闭'},
    {value: 'CC00804', label:	'待业务审核'},
    {value: 'CC00805', label:	'业务审核不通过'},
    {value: 'CC00806', label:	'待财务审核'},
    {value: 'CC00807', label:	'财务审核不通过'},
    {value: 'CC00901', label:	'充值'},
    {value: 'CC00902', label:	'支付'},
    {value: 'CC00903', label:	'退款'},
    {value: 'CC00999', label:	'其他'},
    {value: 'CC01011', label:	'酷开卡充值'},
    {value: 'CC01012', label:	'银行借记卡充值'},
    {value: 'CC01013', label:	'银行信用卡充值'},
    {value: 'CC01021', label:	'账户余额支付'},
    {value: 'CC01022', label:	'银行借记卡支付'},
    {value: 'CC01023', label:	'银行信用卡支付'},
    {value: 'CC01024', label:	'积分支付'},
    {value: 'CC01025', label:	'现金支付'},
    {value: 'CC01031', label:	'虚拟订单退款'},
    {value: 'CC01032', label:	'实体订单退款'},
    {value: 'CC01033', label:	'酷开账户退款'},
    {value: 'CC01034', label:	'赠送余额'},
    {value: 'CC01035', label:	'二维码充值'},
    {value: 'CC01036', label:	'二维码充值支付'},
    {value: 'CC01037', label:	'交易编码优朋卡充值'},
    {value: 'CC01038', label:	'银行电话支付'},
    {value: 'CC01039', label:	'银行卡电话充值'},
    {value: 'CC01040', label:	'微信支付-交易编码'},
    {value: 'CC01041', label:	'微信充值-交易编码'},
    {value: 'CC01042', label:	'支付宝授权支付'},
    {value: 'CC01043', label:	'支付宝支付'},
    {value: 'CC01044', label:	'短代支付'},
    {value: 'CC01045', label:	'支付宝一键充值(授权)'},
    {value: 'CC01048', label:	'影视支付宝充值'},
    {value: 'CC01049', label:	'影视快钱充值'},
    {value: 'CC01050', label:	'支付宝(PC)'},
    {value: 'CC01051', label:	'支付宝(WAP)'},
    {value: 'CC01052', label:	'易宝银行卡网银(pc)'},
    {value: 'CC01053', label:	'微信(公众号)'},
    {value: 'CC01056', label:	'支付宝免密支付'},
    {value: 'CC01057', label:	'微信免密支付'},
    {value: 'CC01059', label:	'微信(小程序)'},
    {value: 'CC01071', label:	'QQ钱包支付'},
    {value: 'CC01099', label:	'其他'},
    {value: 'CC01101', label:	'易宝支付异常'},
    {value: 'CC01102', label:	'支付授信异常'},
    {value: 'CC01103', label:	'退款授信异常'},
    {value: 'CC01201', label:	'影视'},
    {value: 'CC01202', label:	'游戏'},
    {value: 'CC01203', label:	'PC商城'},
    {value: 'CC01204', label:	'购物'},
    {value: 'CC01205', label:	'教育'},
    {value: 'CC01206', label:	'其他'},
    {value: 'CC01207', label:	'旅游'},
    {value: 'CC01208', label:	'音乐'},
    {value: 'CC01209', label:	'广告'},
    {value: 'CC01210', label:	'体育'},
    {value: 'CC01211', label:	'系统增值'},
    {value: 'CC01212', label:	'应用圈'},
    {value: 'CC01213', label:	'运营商'},
    {value: 'CC01301', label:	'非法终端'},
    {value: 'CC01302', label:	'终端已绑定'},
    {value: 'CC01303', label:	'绑定终端数据过多'},
    {value: 'CC01401', label:	'产品分成比例设置到期提醒'},
    {value: 'CC01402', label:	'用户登录获取短信验证码'},
    {value: 'CC01403', label:	'快捷支付二次支付'},
    {value: 'CC01404', label:	'运营后台创建用户'},
    {value: 'CC01405', label:	'退款申请待处理提醒'},
    {value: 'CC01501', label:	'支付完成通知'},
    {value: 'CC01502', label:	'开通/关闭服务'},
    {value: 'CC01503', label:	'服务切换'},
    {value: 'CC01601', label:	'待支付'},
    {value: 'CC01602', label:	'完成'},
    {value: 'CC01603', label:	'关闭'},
    {value: 'CC01701', label:	'影视组'},
    {value: 'CC01702', label:	'应用组'},
    {value: 'CC01703', label:	'教育组'},
    {value: 'CC01704', label:	'购物组'},
    {value: 'CC01705', label:	'运营商'},
  ];
  @Mutation
  TOGGLE_SIDEBAR(withoutAnimation: boolean) {
    if (this.sidebar.opened) {
      Cookies.set('sidebarStatus', 'closed');
    } else {
      Cookies.set('sidebarStatus', 'opened');
    }
    this.sidebar.opened = !this.sidebar.opened;
    this.sidebar.withoutAnimation = withoutAnimation;
  }

  @Mutation
  CLOSE_SIDEBAR(withoutAnimation: boolean) {
    Cookies.set('sidebarStatus', 'closed');
    this.sidebar.opened = false;
    this.sidebar.withoutAnimation = withoutAnimation;
  }

  @Mutation
  TOGGLE_DEVICE(device: DeviceType) {
    this.device = device;
  }

  @Action({commit: 'TOGGLE_SIDEBAR'})
  ToggleSideBar(withoutAnimation: boolean) {
    return withoutAnimation;
  }

  @Action({commit: 'CLOSE_SIDEBAR'})
  CloseSideBar(withoutAnimation: boolean) {
    return withoutAnimation;
  }

  @Action({commit: 'TOGGLE_DEVICE'})
  ToggleDevice(device: DeviceType) {
    return device;
  }


  @MutationAction({mutate: ['formSize']})
  async SetFormSize(size: ElementUIComponentSize) {
    return {
      formSize: size,
    };
  }

  // @MutationAction({ mutate: [ 'companyOrderSource'] })
  @Mutation
  async GetCompanyOrderSource(refresh: boolean) {
    console.log('GetCompanyOrderSource');
    if (refresh || this.companyOrderSource == null || this.companyOrderSource.length === 0) {
      const {data} = await getCompanyOrderSource();
      if (data.data) {
        // return {
        //   companyOrderSource: data.data,
        // };
        this.companyOrderSource = data.data;
      } else {
        throw Error('GetAllValidRoles: data must be a non-null array!');
      }
    } else {
      // return {
      //   companyOrderSource: this.companyOrderSource,
      // };
    }
  }
}

export const AppModule = getModule(App.prototype);
