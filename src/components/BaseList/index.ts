import {Component, Vue} from 'vue-property-decorator';
import {IPageinfo} from '@/types';
// @ts-ignore
import qs from 'qs';
import {AxiosPromise} from 'axios';
import {getAppInfo} from '@/api/account';

@Component
export default class BaseList extends Vue {
  listLoading: boolean = true;

  listQuery: IPageinfo = {page: 0, size: 50, total: 0};

  get total(){
    return this.listQuery.total;
  }
  get size(){
    return this.listQuery.size;
  }
  get page(){
    return this.listQuery.page;
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
    this.fetchData();
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

  fetchData() {
    this.listLoading = true;
    this.realFetchData().then(() => {
      const path = this.$route.path;
      history.pushState(null, '条件查询', path + '?' + qs.stringify(this.listQuery, {arrayFormat: 'repeat'}));
    }).finally(() => {
      this.listLoading = false;
    });
  }

  realFetchData(): AxiosPromise<any> {
    return getAppInfo(0);
  }
}
