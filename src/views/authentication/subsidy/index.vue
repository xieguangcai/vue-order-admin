<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">

        ID
        <el-input v-model="listQuery.allowanceActId" size="mini" :clearable="true"></el-input>
        津贴活动名称
        <el-input v-model="listQuery.allowanceActName" size="mini" :clearable="true"></el-input>
        津贴活动码
        <el-input v-model="listQuery.subsidyCode" size="mini" :clearable="true"></el-input>
        状态
        <el-select size="mini" v-model="listQuery.actFlag">
          <el-option value="" label="全部"/>
          <el-option value="1" label="上架"/>
          <el-option value="0" label="下架"/>
        </el-select>
      </search-pane>

      <el-table v-loading="listLoading" height="600" style="width: 100%"
                :data="data"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row>
        <el-table-column align="left" label="ID" width="100" fixed>
          <template slot-scope="scope">
             {{ scope.row.allowanceActId}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="津贴活动名称" width="400">
          <template slot-scope="scope">
            {{ scope.row.allowanceActName}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="津贴活动码" width="200">
          <template slot-scope="scope">
            {{ scope.row.subsidyCode}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="津贴活动时间" width="300">
          <template slot-scope="scope">
            <div>
              <span>开始时间：</span>{{ scope.row.activityStartTime }}<br/>
              <span>结束时间：</span>{{ scope.row.activityEndTime }}<br/>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="津贴使用时间" width="300">
          <template slot-scope="scope">
            <div>
              <span>开始时间：</span>{{ scope.row.startUseTime }}<br/>
              <span>结束时间：</span>{{ scope.row.endUseTime }}<br/>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="200">
          <template slot-scope="scope">
            {{ scope.row.actFlag = 1 ? '已上架' : '已下架' }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="320">
          <template slot-scope="scope">
            {{ scope.row.createdDate }}
          </template>
        </el-table-column>
        <el-table-column label="最后更新时间" width="320">
          <template slot-scope="scope">
            {{ scope.row.lastUpdateDate }}
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
  AllowanceActivityInfo,
  Pageable,
  ResponseResult,
  SearchHistoryModel,
} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {AxiosResponse} from 'axios';
import {getSubsidyPageList} from '../../../api/authentication/subsidy';
import BaseList from '../../../components/BaseList';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import {addDateFormatString} from '../../../utils/format-utils';
import {anyNotEmpty} from '../../../utils/validate';

@Component({
  components: {ListTablePane, SearchPane, SearchPagePane},
  filters: {},
  mixins: [BaseList],
})
export default class AllowanceActivityInfoList extends Vue {


  data: AllowanceActivityInfo[] = [];
  listQuery: AllowanceActivityInfo = { page: 0, size: 50, total: 0};


  realFetchData() {
    return getSubsidyPageList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<AllowanceActivityInfo>>>) => {
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
