import {Component, Vue} from 'vue-property-decorator';
import {IPageinfo} from '@/types';
import {AxiosPromise} from 'axios';
import {getAppInfo} from '@/api/account';
import {pickerOptions} from '@/utils/validate';
import {setLocationToHisotry} from '@/utils/tools';
import NProgress from 'nprogress';
import {AppModule} from '@/store/modules/app';

@Component
export default class BaseList extends Vue {
  listLoading: boolean = false;
  needLoadOnCreate: boolean = true;

  listQuery: IPageinfo = {page: 0, size: 50, total: 0};

  get total(): number {
    return this.listQuery.total;
  }
  get size(): number {
    return this.listQuery.size;
  }
  get page(): number {
    return this.listQuery.page;
  }

  get pickerOptions(): any {
    return pickerOptions();
  }
  created() {
    this.onCreated();
    const pageInfo: IPageinfo = {page: 0, size: AppModule.pageSize, total: 0};
    if (this.$route.query.page) {
      pageInfo.page = parseInt(this.$route.query.page, 10);
    }
    if (this.$route.query.size) {
      pageInfo.size = parseInt(this.$route.query.size, 10);
    }
    if (this.$route.query.total) {
      pageInfo.total = parseInt(this.$route.query.total, 10);
    }
    // 添加响应式的属性，才能动态更新视图，否则一些组件无法更新，比如 select
    Object.keys(this.$route.query).forEach((key) => {
      Vue.set(this.listQuery, key, this.$route.query[key]);
    });
    // for (const i in  Object.keys(this.$route.query)) {
    //   Vue.set(this.listQuery, i, this.$route.query[i]);
    // }
    Object.keys(pageInfo).forEach((key) => {
      if (this.listQuery[key] === undefined) {
        Vue.set(this.listQuery, key, pageInfo[key]);
      }
    });
    // for (const i in  Object.keys(pageInfo)) {
    //   if (this.listQuery[i] === undefined) {
    //     Vue.set(this.listQuery, i, pageInfo[i]);
    //   }
    // }
    console.log('初始化之后的请求参数对象为：', this.listQuery);
    if (this.needLoadOnCreate) {
      this.fetchData();
    }
  }

  // 钩子函数的包装
  onCreated() {

  }

  handleSizeChange(size: number) {
    this.listQuery.size = size;
    this.fetchData();
  }

  handleCurrentChange(page: number) {
    console.log('当前页码为：' + page);
    this.listQuery.page = page;
    this.fetchData();
  }

  refetchData() {
    this.listQuery.page = 0;
    this.fetchData();
  }

  generateRoute() {
    if (this.$route.name) {
      return this.$route;
    }
    return false;
  }

  fetchData() {
    if (!this.validSearchCondition()) {
      return;
    }
    this.listLoading = true;
    this.realFetchData().then(() => {
      setLocationToHisotry(this, this.listQuery, '条件查询');
    }).finally(() => {
      this.listLoading = false;
    });
  }

  realFetchData(): AxiosPromise<any> {
    return getAppInfo(0);
  }

  /**
   * 校验输入对查询条件
   */
  validSearchCondition(): boolean {
    return true;
  }
}
