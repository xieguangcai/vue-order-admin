import {IAppState} from './modules/app';
import {Store, StoreOptions} from 'vuex';
import {IRootState} from '@/store/index';

const getters = {
  sidebar: (state: IRootState) => state.app.sidebar,
};
export default getters;
