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
  orderStatus: StatusInfo[];
  productStatus: StatusInfo[];
  businessType: StatusInfo[];
  schemeStatus: StatusInfo[];
  schemeScene: StatusInfo[];
  productType: StatusInfo[];
  appTypeCodeStatus: StatusInfo[];
  ossOrderSource: StatusInfo[];
  clientType: StatusInfo[];
  orderType: StatusInfo[];
  cardInfoStatus: StatusInfo[];
  cardBatchStatus: StatusInfo[];
  layoutStatus: StatusInfo[];
  expStatus: StatusInfo[];
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
  orderStatus: IAppState['orderStatus'] = [
    {value: 'CC00501', label: '待支付'},
    {value: 'CC00502', label: '待授信'},
    {value: 'CC00503', label: '完成'},
    {value: 'CC00504', label: '取消	'},
    {value: 'CC00505', label: '已发货'},
    {value: 'CC00506', label: '支付中'}];
  appTypeCodeStatus: IAppState['orderStatus'] = [
    {value: 'CC01201', label: '影视'},
    {value: 'CC01202', label: '游戏'},
    {value: 'CC01203', label: 'PC商城'},
    {value: 'CC01204', label: '购物'},
    {value: 'CC01205', label: '教育'},
    {value: 'CC01206', label: '其他'},
    {value: 'CC01207', label: '旅游'},
    {value: 'CC01208', label: '音乐'},
    {value: 'CC01209', label: '广告'},
    {value: 'CC01210', label: '体育'},
  ];
  ossOrderSource: IAppState['orderStatus'] = [
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

  @MutationAction({ mutate: [ 'companyOrderSource'] })
  async GetCompanyOrderSource(refresh: boolean) {
    if (refresh || this.companyOrderSource == null || this.companyOrderSource.length === 0) {
      const {data} = await getCompanyOrderSource();
      if (data.data) {
        return {
          companyOrderSource: data.data,
        };
      } else {
        throw Error('GetAllValidRoles: data must be a non-null array!');
      }
    } else {
      return {
        companyOrderSource: this.companyOrderSource,
      };
    }
  }
}

export const AppModule = getModule(App.prototype);
