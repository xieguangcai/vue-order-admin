<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">
        名称
        <el-input v-model="listQuery.phoneNo" size="mini"></el-input>
        状态
        <el-select size="mini" v-model="listQuery.orderStatus">
          <el-option value="" label="全部"/>
          <el-option v-for="item in layoutStatus" :label="item.label" :value="item.value" :key="item.value"/>
        </el-select>
        有效时间
        <el-date-picker size="mini"
                        v-model="listQuery.orderTimes"
                        type="datetimerange"
                        range-separator="-"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00','23:59:59']"
                        :picker-options="pickerOptions"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间">
        </el-date-picker>
      </search-pane>
      <el-table v-loading="listLoading" height="600" style="width: 100%"
                :data="data"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row>
        <el-table-column align="left" label="ID" width="60" fixed>
          <template slot-scope="scope">
            <div>
              {{scope.row.id}}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="名称" width="300" fixed>
          <template slot-scope="scope">
            <div>
              {{scope.row.name}}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="状态" width="100">
          <template slot-scope="scope">
            <div>
              {{ layoutStatusToName(scope.row.status) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="优先级" width="80">
          <template slot-scope="scope">
            <div>
              {{ scope.row.priority }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="推送mac地址">
          <template slot-scope="scope">
            <div>
              {{ scope.row.mac }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="有效期" width="320">
          <template slot-scope="scope">
            <div>
              {{ scope.row.startTime }}-{{ scope.row.endTime }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" fixed="right" width="160">
          <template slot-scope="scope">
            <el-tooltip content="查看">
              <el-button type="primary" size="mini" circle icon="el-icon-view"
                         @click="handleViewLayoutDetail(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="编辑" v-if="scope.row.status === 0 || scope.row.status === 1 || scope.row.status === 3 ">
              <el-button type="warning" size="mini" circle icon="el-icon-edit"
                         @click="handleEditLayoutDetail(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="下线" v-if="scope.row.status === 2 ">
              <el-button type="danger" size="mini" circle icon="el-icon-download"
                         @click="handleOfflineLayout(scope.$index, scope.row)"></el-button>
            </el-tooltip>
          </template>
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
import BaseList from '../../../components/BaseList';
import SearchPane from '../../../components/SearchPane/index.vue';
import SearchPagePane from '../../../components/SearchPagePane/index.vue';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {Pageable, ResponseResult, SysLoginLayoutListQuery, SysLoginLayoutModel} from '../../../types';
import {AxiosResponse} from 'axios';
import {getLoginLayoutList, offlineLoginLayout} from '../../../api/passport';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import {layoutStatusName} from '../../../api/pay';
import {AppModule} from '../../../store/modules/app';

@Component({
  name: 'LoginLayoutList',
  filters: {},
  mixins: [BaseList],
  components: {ListTablePane, SearchPane, SearchPagePane},
})
export default class LoginLayoutList extends Vue {
  data: SysLoginLayoutModel[] = [];
  listQuery: SysLoginLayoutListQuery = {page: 0, size: 50, total: 0};

  get layoutStatus() {
    return AppModule.layoutStatus;
  }

  layoutStatusToName(code: number) {
    return layoutStatusName(code);
  }

  handleViewLayoutDetail(index: number, row: SysLoginLayoutModel) {
    this.$router.push({path: 'view-login-layout', query: {viewModel: 'true', id: '' + row.id}});
  }

  handleEditLayoutDetail(index: number, row: SysLoginLayoutModel) {
    this.$router.push({path: 'edit-login-layout', query: {viewModel: 'false', id: '' + row.id}});
  }

  handleOfflineLayout(index: number, row: SysLoginLayoutModel) {
    this.$confirm('确定要下线当前策略吗？', '警告', {
      confirmButtonText: '下线',
      cancelButtonText: '取消',
      type: 'warning',
    }).then( () => {
      offlineLoginLayout(row.id).then((response) => {
        if (!response.data.success) {
          handlerCommonError(response.data);
        } else {
          this.$message({
            type: 'success',
            message: '成功下线',
          });
          // @ts-ignore
          this.fetchData();
        }
      });
    });
  }

  realFetchData() {
    return getLoginLayoutList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<SysLoginLayoutModel>>>) => {
      const responseData = response.data.data;
      this.data = responseData.content;
      this.listQuery.page = responseData.number;
      this.listQuery.size = responseData.size;
      this.listQuery.total = responseData.totalElements;
    }).catch(handlerCommonError);
  }

}
</script>
