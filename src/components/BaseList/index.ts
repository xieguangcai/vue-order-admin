import {Component, Vue} from 'vue-property-decorator';
import {IPageinfo} from '@/types';
// @ts-ignore
import qs from 'qs';
import {AxiosPromise} from 'axios';
import {getAppInfo} from '@/api/account';
import {pickerOptions} from '@/utils/validate';
import {RawLocation} from 'vue-router';

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
    const pageInfo: IPageinfo = {page: 0, size: 50, total: 0};
    if (this.$route.query.page) {
      pageInfo.page = parseInt(this.$route.query.page, 10);
    }
    if (this.$route.query.size) {
      pageInfo.size = parseInt(this.$route.query.size, 10);
    }
    if (this.$route.query.total) {
      pageInfo.total = parseInt(this.$route.query.total, 10);
    }

    this.listQuery = Object.assign(this.listQuery, this.$route.query, pageInfo);
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
      const path = this.$route.path;
      // history.pushState(null, '条件查询', path + '?' + qs.stringify(this.listQuery, {arrayFormat: 'repeat'}));
      const newLocation: RawLocation = {} ;
      const oldRoute = this.$route;
      newLocation.path = oldRoute.path;
      newLocation.query = this.listQuery;
      newLocation.name = oldRoute.name;
      newLocation.params = oldRoute.params;
      newLocation.hash = oldRoute.hash;
      history.pushState(null, '条件查询', path + '?' + qs.stringify(this.listQuery, {arrayFormat: 'repeat'}));
      // this.$router.push(newLocation, () => {
      this.$store.dispatch('addVisitedViews', newLocation);
      // });
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
