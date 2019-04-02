<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">

        ID
        <el-input v-model="listQuery.giveId" size="mini" :clearable="true"></el-input>
        赠品名称
        <el-input v-model="listQuery.giveName" size="mini" :clearable="true"></el-input>
        赠品类型
        <el-select size="mini" v-model="listQuery.giveType">
          <el-option value="" label="全部"/>
          <el-option value="0" label="普通赠品"/>
          <el-option value="1" label="黄金VIP"/>
        </el-select>
        赠品状态
        <el-select size="mini" v-model="listQuery.giveFlag">
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
        <el-table-column align="left" label="ID" width="200" fixed>
          <template slot-scope="scope">
             {{ scope.row.giveId}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="赠品名称" width="400">
          <template slot-scope="scope">
            {{ scope.row.giveName}}
          </template>
        </el-table-column>

        <el-table-column align="left" label="赠品类型" width="200">
          <template slot-scope="scope">
            {{scope.row.giveType == 0 ? '普通赠品' : '黄金VIP'}}
          </template>
        </el-table-column>
        <el-table-column label="赠品状态" width="200">
          <template slot-scope="scope">
            {{ scope.row.giveFlag = 1 ? '已上架' : '已下架' }}
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
  GiveInfo,
  Pageable,
  ResponseResult,
  SearchHistoryModel,
} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {AxiosResponse} from 'axios';
import {getGiveInfoPageList} from '../../../api/authentication/giveInfo';
import BaseList from '../../../components/BaseList';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import {addDateFormatString} from '../../../utils/format-utils';
import {anyNotEmpty} from '../../../utils/validate';

@Component({
  components: {ListTablePane, SearchPane, SearchPagePane},
  filters: {},
  mixins: [BaseList],
})
export default class GiveInfoList extends Vue {


  data: GiveInfo[] = [];
  listQuery: GiveInfo = { page: 0, size: 50, total: 0};


  realFetchData() {
    return getGiveInfoPageList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<GiveInfo>>>) => {
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
