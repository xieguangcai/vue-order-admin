<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">

        供应商名称
        <el-input v-model="listQuery.companyCnName" size="mini" :clearable="true"></el-input>
        供应商标识
        <el-input v-model="listQuery.company" size="mini" :clearable="true"></el-input>
        状态
        <el-select size="mini" v-model="listQuery.flag">
          <el-option value="" label="全部"/>
          <el-option value="1" label="已启用"/>
          <el-option value="0" label="已停用"/>
        </el-select>
      </search-pane>

      <el-table v-loading="listLoading" height="600" style="width: 100%"
                :data="data"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row>
        <el-table-column align="left" label="ID" width="200" fixed>
          <template slot-scope="scope">
             {{ scope.row.id}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="供应商名称" width="400">
          <template slot-scope="scope">
            {{ scope.row.companyCnName}}
          </template>
        </el-table-column>

        <el-table-column align="left" label="供应商标识" width="200">
          <template slot-scope="scope">
            {{scope.row.company}}
          </template>
        </el-table-column>
        <el-table-column label="OSS商户编码" width="200">
          <template slot-scope="scope">
            {{ scope.row.appcode }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="200">
          <template slot-scope="scope">
            {{ scope.row.flag = 1 ? '已启用' : '已停用' }}
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
  CompanyListQuery,
  Company,
  Pageable,
  ResponseResult,
  SearchHistoryModel,
} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {AxiosResponse} from 'axios';
import {getCompanyPageList} from '../../../api/authentication/company';
import BaseList from '../../../components/BaseList';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import {addDateFormatString} from '../../../utils/format-utils';
import {anyNotEmpty} from '../../../utils/validate';

@Component({
  components: {ListTablePane, SearchPane, SearchPagePane},
  filters: {},
  mixins: [BaseList],
})
export default class OrderCompanyList extends Vue {


  data: Company[] = [];
  listQuery: CompanyListQuery = { page: 0, size: 50, total: 0};


  realFetchData() {
    return getCompanyPageList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<Company>>>) => {
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
}
</script>
