<template>
  <div>
    <el-table v-loading="listLoading" height="600" style="width: 100%"
              :data="data"
              element-loading-text="Loading"
              :row-class-name="tableRowClassName"
              border
              fit
              size="mini"
              highlight-current-row>
      <el-table-column align="left" label="影片ID" width="180" v-if="listQuery.permissionsType == '2'">
        <template slot-scope="scope">
          <div>
            {{ scope.row.movieId }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="权益名称" width="180">
        <template slot-scope="scope">
          <div>
            {{ scope.row.sourceName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="权益标识" width="100">
        <template slot-scope="scope">
          <div>
            {{ scope.row.sourceSign }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="权益开始时间" width="160">
        <template slot-scope="scope">
          <div>
            {{ scope.row.beginDate}}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="权益结束时间" width="160">
        <template slot-scope="scope">
          <div>
            {{ scope.row.endDate}}
          </div>
        </template>
      </el-table-column>

      <el-table-column align="left" label="权益说明" width="200">
        <template slot-scope="scope">
          <div>
            {{ scope.row.description }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="200">
        <template slot-scope="scope">
          <div>
            {{ scope.row.createdDate}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="最后修改时间" width="200">
        <template slot-scope="scope">
          <div>
            {{ scope.row.lastUpdateDate}}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>


<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import SearchPane from '../../../components/SearchPane/index.vue';
import SearchPagePane from '../../../components/SearchPagePane/index.vue';
import {
  CascaderDataType,
  OrderPermissionListQuery, OrderPermissionsInfo,
  ResponseResult,
} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {AxiosResponse} from 'axios';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import {getOrderPermissionsInfo} from '../../../api/authentication';
import {AppModule} from '../../../store/modules/app';

export interface PermissionQueryDomain {
  coocaaOpenId: string;
  thirdOpenId: string;
  permissionsType: string;

}
@Component({
  name: 'OrderPermissionsDetail',
  components: {ListTablePane, SearchPane, SearchPagePane},
  filters: {},
  mixins: [],
})
export default class OrderPermissionsDetail extends Vue {
  @Prop({})
  // @ts-ignore
  queryDomain: PermissionQueryDomain;
  loadingData: boolean = false;
  // @Prop({default: '', type: String})
  //   // @ts-ignore
  // coocaaOpenId: string;
  // @Prop({default: '', type: String})
  //   // @ts-ignore
  // thirdOpenId: string;
  // @Prop({default: 0, type: Number})
  //   // @ts-ignore
  // permissionsType: string;

  data: OrderPermissionsInfo[] = [];

  listQuery: OrderPermissionListQuery = {
    sourceType: '1',
    accountType: '1',
    permissionsType: '1',
    productType: '1',
    page: 0,
    size: 50,
    total: 0,
  };

  get orderSources(): CascaderDataType[] {
    return AppModule.companyOrderSource;
  }

  tableRowClassName({row, rowIndex}: { row: OrderPermissionsInfo, rowIndex: number }) {
    if (row.endDate !== undefined) {
      if (new Date(row.endDate) < new Date()) {
        return 'warning-row';
      }
    }
  }

  @Watch('queryDomain')
  queryDomainChange(newVal: PermissionQueryDomain, oldVal: PermissionQueryDomain) {
    if (this.loadingData) {
      return;
    }
    if (newVal.coocaaOpenId == null && newVal.thirdOpenId == null) {
      return;
    }
    if (newVal.coocaaOpenId === oldVal.coocaaOpenId && newVal.thirdOpenId === oldVal.thirdOpenId) {
      return;
    }
    this.loadingData = true;
    this.listQuery = {
      sourceType: '1',
      thirdOpenId: this.queryDomain.thirdOpenId,
      openId: this.queryDomain.coocaaOpenId,
      permissionsType: this.queryDomain.permissionsType,
      accountType: '0',
      page: 0,
      size: 50,
      total: 0,
    };
    this.realFetchData().finally(() => {
      this.loadingData = false;
    });
  }

  realFetchData() {
    return getOrderPermissionsInfo(this.listQuery).then((response: AxiosResponse<ResponseResult<OrderPermissionsInfo[]>>) => {
      this.data = response.data.data;
    }).catch(handlerCommonError);
  }
}
</script>
