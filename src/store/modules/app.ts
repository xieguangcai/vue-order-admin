import Cookies from 'js-cookie';
import {VuexModule, Module, Mutation, Action, getModule, MutationAction} from 'vuex-module-decorators';
import store from '@/store';
import {ElementUIComponentSize} from 'element-ui/types/component';
import {getToken, removeToken} from '@/utils/auth';
import {logout} from '@/api/login';
import {StatusInfo} from '@/types';
import {ElDatePicker} from "element-ui/types/date-picker";

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
  appTypeCodeStatus: StatusInfo[];
  ossOrderSource: StatusInfo[];
}

@Module({dynamic: true, store, name: 'app'})
class App extends VuexModule {
  sidebar: IAppState['sidebar'] = {
    opened: Cookies.get('sidebarStatus') !== 'closed',
    withoutAnimation: false,
  };
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
    {value: 1, label: 'tv端'},
    {value: 2, label: 'pc端'},
    {value: 3, label: '自动续费'},
    {value: 4, label: '移动端'},
    {value: 5, label: 'v1版支付'},
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
}

export const AppModule = getModule(App.prototype);
