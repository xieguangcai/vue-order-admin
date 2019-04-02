<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">

        ID
        <el-input v-model="listQuery.sourceId" size="mini" :clearable="true"></el-input>
        分类名称
        <el-input v-model="listQuery.sourceName" size="mini" :clearable="true"></el-input>
        供应商
        <el-select size="mini" v-model="listQuery.company">
          <el-option value="" label="全部"/>
          <el-option v-for="item in this.companyList" :label="item.companyCnName" :key="item.company" :value="item.company" />
        </el-select>
        审核状态
        <el-select size="mini" v-model="listQuery.sourceStatus">
          <el-option value="" label="全部"/>
          <el-option v-for="item in productStatus" :label="item.label" :value="item.value" :key="item.value"/>
        </el-select>
        状态
        <el-select size="mini" v-model="listQuery.flag">
          <el-option value="" label="全部"/>
          <el-option value="0" label="已启用"/>
          <el-option value="1" label="已停用"/>
        </el-select>

      </search-pane>
      <el-table v-loading="listLoading" height="600" style="width: 100%"
                :data="data"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row>
        <el-table-column align="left" label="ID" width="300" fixed>
          <template slot-scope="scope">
             {{ scope.row.sourceId}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="分类名称" width="400">
          <template slot-scope="scope">
            {{ scope.row.sourceName}}
          </template>
        </el-table-column>

        <el-table-column align="left" label="供应商" width="200">
          <template slot-scope="scope">
            {{ scope.row.baseOrderCompany == null ? '' :  scope.row.baseOrderCompany.companyCnName}}
          </template>
        </el-table-column>
        <el-table-column label="权益标识" width="240">
          <template slot-scope="scope">
            {{ scope.row.sourceSign }}
          </template>
        </el-table-column>
        <el-table-column label="业务类型" width="240">
          <template slot-scope="scope">
            {{ businessTypeToName(scope.row.businessType) }}
          </template>
        </el-table-column>
        <el-table-column label="客户端显示排序" width="240">
          <template slot-scope="scope">
            {{ scope.row.clientSort }}
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="240">
          <template slot-scope="scope">
            {{ productStatusToName(scope.row.sourceStatus) }}
          </template>
        </el-table-column>
        <el-table-column label="尊享图片" width="240">
          <template slot-scope="scope">
            {{ scope.row.sourceImage }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="320">
          <template slot-scope="scope">
            {{ scope.row.createdDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" fixed="right">
          <!--<template slot-scope="scope">-->
            <!--<el-tooltip content="查看该订单详情">-->
              <!--<el-button type="primary" size="mini" circle icon="el-icon-search"-->
                         <!--@click=""></el-button>-->
            <!--</el-tooltip>-->
            <!--<el-tooltip content="尝试查看该订单支付详情">-->
              <!--<el-button type="success" size="mini" circle icon="el-icon-search"-->
                         <!--@click=""></el-button>-->
            <!--</el-tooltip>-->
          <!--</template>-->
        </el-table-column>
      </el-table>
     <search-page-pane @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :size="size"
                       :page="page"
                       :total="total"
                       slot="page">
      </search-page-pane>

    </list-table-pane>
  </div>
</template>


<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import SearchPane from '../../../components/SearchPane/index.vue';
import SearchPagePane from '../../../components/SearchPagePane/index.vue';
import {
  SourceListQuery,
  BaseOrderSource,
  Company,
  Pageable,
  ResponseResult,
  SearchHistoryModel,
} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {AxiosResponse} from 'axios';
import {getSourcePageList} from '../../../api/authentication/source';
import {getCompanyList} from '../../../api/authentication/company';
import BaseList from '../../../components/BaseList';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import {addDateFormatString} from '../../../utils/format-utils';
import {anyNotEmpty} from '../../../utils/validate';
import {AppModule, propertyToName} from '../../../store/modules/app';


@Component({
  components: {ListTablePane, SearchPane, SearchPagePane},
  filters: {},
  mixins: [BaseList],
})
export default class OrderSourceList extends Vue {

  data: BaseOrderSource[] = [];
  listQuery: SourceListQuery = { page: 0, size: 50, total: 0};
  companyList: Company[] = [];

  created() {
    getCompanyList().then((resolve) => {
      this.companyList = resolve.data.data;
    }).catch(handlerCommonError);
  }

  realFetchData() {
    return getSourcePageList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<BaseOrderSource>>>) => {
      const responseData = response.data.data;
      this.data = responseData.content;
      this.listQuery.page = responseData.number;
      this.listQuery.size = responseData.size;
      this.listQuery.total = responseData.totalElements;
    }).catch(handlerCommonError);
  }

  validSearchCondition(): boolean {

    return true;
  }

  get productStatus() {
    return AppModule.productStatus;
  }

  productStatusToName(code: string) {
    return propertyToName(code, AppModule.productStatus);
  }

  businessTypeToName(code: string) {
    return propertyToName(code, AppModule.businessType);
  }
}
</script>
