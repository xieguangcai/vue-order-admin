import Cookies from 'js-cookie';
import {VuexModule, Module, Mutation, Action, getModule, MutationAction} from 'vuex-module-decorators';
import store from '@/store';
import {ElementUIComponentSize} from 'element-ui/types/component';
import {getToken, removeToken} from '@/utils/auth';
import {logout} from '@/api/login';
import {StatusInfo} from '@/types';

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
}

@Module({ dynamic: true, store, name: 'app' })
class App extends VuexModule {
  sidebar: IAppState['sidebar'] = {
    opened: Cookies.get('sidebarStatus') !== 'closed',
    withoutAnimation: false,
  };
  device: IAppState['device'] = DeviceType.Desktop;
  formSize: IAppState['formSize'] = 'small';
  formLabelWidth: IAppState['formLabelWidth'] = '120px';
  recordeStatus: IAppState['recordeStatus'] = [{value: 1, label: '正常'}, {value: 2, label: '禁用'}];

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

  @Action({ commit: 'TOGGLE_SIDEBAR' })
  ToggleSideBar(withoutAnimation: boolean) {
    return withoutAnimation;
  }
  @Action({ commit: 'CLOSE_SIDEBAR' })
  CloseSideBar(withoutAnimation: boolean) {
    return withoutAnimation;
  }
  @Action({ commit: 'TOGGLE_DEVICE' })
  ToggleDevice(device: DeviceType) {
    return device;
  }


  @MutationAction({ mutate: [ 'formSize' ] })
  async SetFormSize(size: ElementUIComponentSize) {
    return {
      formSize: size,
    };
  }
}

export const AppModule = getModule(App.prototype);
