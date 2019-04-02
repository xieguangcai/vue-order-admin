<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">

        权益名称
        <el-input v-model="listQuery.rightsName" size="mini" :clearable="true"></el-input>
        权益标识
        <el-input v-model="listQuery.sourceSign" size="mini" :clearable="true"></el-input>
      </search-pane>
      <el-table v-loading="listLoading" height="600" style="width: 100%"
                :data="data"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row>
        <el-table-column align="left" label="ID" width="300" fixed>
          <template slot-scope="scope">
             {{ scope.row.rightsId}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="权益名称" width="400">
          <template slot-scope="scope">
            {{ scope.row.rightsName}}
          </template>
        </el-table-column>

        <el-table-column align="left" label="权益标识" width="200">
          <template slot-scope="scope">
            {{scope.row.sourceSign}}
          </template>
        </el-table-column>
        <el-table-column label="供应商" width="240">
          <template slot-scope="scope">
            {{ scope.row.baseOrderCompany.companyCnName }}
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
  RightsInfoListQuery,
  RightsInfo,
  Pageable,
  ResponseResult,
  SearchHistoryModel,
} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {AxiosResponse} from 'axios';
import {getRightsInfoList} from '../../../api/authentication/rightsInfo';
import BaseList from '../../../components/BaseList';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import {addDateFormatString} from '../../../utils/format-utils';
import {anyNotEmpty} from '../../../utils/validate';


@Component({
  components: {ListTablePane, SearchPane, SearchPagePane},
  filters: {},
  mixins: [BaseList],
})
export default class OrderRightsInfoList extends Vue {


  data: RightsInfo[] = [];
  listQuery: RightsInfoListQuery = { page: 0, size: 50, total: 0};


  realFetchData() {
    return getRightsInfoList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<RightsInfo>>>) => {
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
