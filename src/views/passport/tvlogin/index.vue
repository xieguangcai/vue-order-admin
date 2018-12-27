<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">
        名称
        <el-input v-model="listQuery.name" size="mini"></el-input>
        状态
        <el-select size="mini" v-model="listQuery.status">
          <el-option value="" label="全部"/>
          <el-option v-for="item in layoutStatus" :label="item.label" :value="item.value" :key="item.value"/>
        </el-select>
        有效时间
        <el-date-picker size="mini"
                        v-model="listQuery.validTime"
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
        <el-table-column type = "expand" fixed>
          <template slot-scope="scope">
            <table class="cc-order-table">
              <tr>
                <td>修改人</td><td>{{scope.row.editor}}</td>
                <td>创建时间</td><td>{{scope.row.createTime}}</td>
              </tr>
              <tr>
                <td>审核人</td><td>{{scope.row.auditor}}</td>
                <td>最后修改时间</td><td>{{scope.row.modifyTime}}</td>
              </tr>
              <tr>
                <td>推送mac地址</td><td colspan="3">{{scope.row.mac}}</td>
              </tr>
            </table>
          </template>
        </el-table-column>
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
        <el-table-column label="优先级" width="180">
          <template slot-scope="scope">
            <div v-if="(scope.row.status === 2 && checkUserRole('LAYOUT_ROLE_AUDIT'))">
              <el-input-number size="mini" v-model="scope.row.priority" :min="0"
                               @change="(newVal)=>{priorityChanged(scope.row, newVal)}" ></el-input-number>
            </div>
            <div v-else>
              {{ scope.row.priority }}
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
        <el-table-column label="创建人" width="120">
          <template slot-scope="scope">
            <div>
              {{ scope.row.creator }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="160">
          <template slot-scope="scope">
            <el-tooltip :content="getViewContentName(scope.row)">
              <el-button type="primary" size="mini" circle icon="el-icon-view"
                         @click="handleViewLayoutDetail(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="编辑" v-if="(scope.row.status === 0 || scope.row.status === 1 || scope.row.status === 3) && checkUserRole('LAYOUT_ROLE_EDIT')">
              <el-button type="warning" size="mini" circle icon="el-icon-edit"
                         @click="handleEditLayoutDetail(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="复制" v-if="checkUserRole('LAYOUT_ROLE_EDIT')">
              <el-button type="warning" size="mini" circle icon="el-icon-document"
                         @click="handleCopy(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="下线" v-if="scope.row.status === 2 && checkUserRole('LAYOUT_ROLE_AUDIT')">
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
import {adjustPriority, copyLoginLayout, getLoginLayoutList, offlineLoginLayout} from '../../../api/passport';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import {layoutStatusName} from '../../../api/pay';
import {AppModule} from '../../../store/modules/app';
import RightComponent from '../../../components/RightComponent';
import {checkRole} from '../../../utils/auth';

@Component({
  name: 'LoginLayoutList',
  filters: {},
  mixins: [BaseList, RightComponent],
  components: {ListTablePane, SearchPane, SearchPagePane},
})
export default class LoginLayoutList extends Vue {
  data: SysLoginLayoutModel[] = [];
  listQuery: SysLoginLayoutListQuery = {page: 0, size: 50, total: 0};

  getViewContentName(scope: SysLoginLayoutModel) {
    if ((scope.status === 1 || scope.status === 3) && checkRole('LAYOUT_ROLE_AUDIT')) {
      return '发布全网';
    } else {
      return '查看';
    }
  }
  get layoutStatus() {
    return AppModule.layoutStatus;
  }

  layoutStatusToName(code: number) {
    return layoutStatusName(code);
  }

  priorityChanged(layout: SysLoginLayoutModel, newVal: number) {
    if (layout.status === 1 || layout.status === 2) {
      // 更改优先级
      adjustPriority(layout.id, newVal).then((response) => {
        if (!response.data.success) {
          handlerCommonError(response.data);
        } else {
          this.$message({
            type: 'success',
            message: '成功调整优先级',
          });
          // @ts-ignore
          this.fetchData();
        }}).catch(handlerCommonError);
    }
  }

  handleViewLayoutDetail(index: number, row: SysLoginLayoutModel) {
    this.$router.push({path: 'view-login-layout', query: {viewModel: 'true', id: '' + row.id}});
  }

  handleEditLayoutDetail(index: number, row: SysLoginLayoutModel) {
    this.$router.push({path: 'edit-login-layout', query: {viewModel: 'false', id: '' + row.id}});
  }

  handleCopy(index: number, row: SysLoginLayoutModel) {
    this.$confirm('确定要复制当前布局吗？', '提示', {
      confirmButtonText: '复制',
      cancelButtonText: '取消',
      type: 'warning',
    }).then( () => {
      copyLoginLayout(row.id).then((response) => {
        if (!response.data.success) {
          handlerCommonError(response.data);
        } else {
          this.$message({
            type: 'success',
            message: '成功复制方案',
          });
          // @ts-ignore
          this.fetchData();
        }
      }).catch(handlerCommonError);
    });
  }

  handleOfflineLayout(index: number, row: SysLoginLayoutModel) {
    this.$confirm('确定要下线当前布局吗？', '警告', {
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
      }).catch(handlerCommonError);
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