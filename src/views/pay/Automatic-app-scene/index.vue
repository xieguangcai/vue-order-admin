<template>
    <div class="windowsList">
      <list-table-pane>

        <el-button-group slot="action" class="cc-action-button-group">
          <el-button type="success" icon="el-icon-circle-plus" size="mini" @click="addAppScene"
                     v-if="checkUserRole('DEDUCTION_ROLE_EDIT')" >新建
          </el-button>
          <el-button type="danger" icon="el-icon-circle-close" size="mini" @click="handleDel"
                     v-if="checkUserRole('DEDUCTION_ROLE_AUDIT')" >删除
          </el-button>
        </el-button-group>

        <search-pane slot="searchpane" @click="refetchData">
          <el-input v-model="listQuery.appCode" size="mini" placeholder="请输入appCode"></el-input>
          <el-input v-model="listQuery.scene" size="mini" placeholder="请输入scene"></el-input>
          <el-input v-model="listQuery.prodName" size="mini" placeholder="请输入产品包名称"></el-input>
          <el-input v-model="listQuery.status" size="mini" placeholder="请输入状态值"></el-input>
          <el-input v-model="listQuery.payTypeUnit" size="mini" placeholder="请输入产品包类型"></el-input>
        </search-pane>

      <el-table v-loading="listLoading" :data="data"
                @selection-change="handleSelectionChange"
                size="mini"
                border fit highlight-current-row>
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column label="id">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="appCode">
          <template slot-scope="scope">
            {{ scope.row.appCode }}
          </template>
        </el-table-column>
        <el-table-column label="scene">
          <template slot-scope="scope">
            {{ scope.row.scene }}
          </template>
        </el-table-column>
        <el-table-column label="产品包名称">
          <template slot-scope="scope">
            {{ scope.row.prodName }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{ scope.row.status | windowsStatus }}
          </template>
        </el-table-column>
        <el-table-column label="限制金额">
          <template slot-scope="scope">
            {{ scope.row.payLimit }}
          </template>
        </el-table-column>
        <el-table-column label="产品类型">
          <template slot-scope="scope">
            {{ scope.row.payTypeUnit }}
          </template>
        </el-table-column>
        <el-table-column label="创建人员">
          <template slot-scope="scope">
            {{ scope.row.createBy }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="修改人员">
          <template slot-scope="scope">
            {{ scope.row.modifyBy }}
          </template>
        </el-table-column>
        <el-table-column label="最后修改时间">
          <template slot-scope="scope">
            {{ scope.row.modifyTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120px">
          <template slot-scope="scope">
            <!--<el-tooltip content="编辑" v-if="(scope.row.status === 0) && checkUserRole('DEDUCTION_ROLE_EDIT')">-->
            <el-tooltip content="编辑" v-if="(scope.row.status === 0)">
              <el-button type="warning" size="mini" circle icon="el-icon-edit"
                         @click="handleEditLayoutDetail(scope.$index, scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

        <search-page-pane @size-change="handleSizeChange" @current-change="handleCurrentChange" :size="size" :page="page"
                          :total="total" slot="page"></search-page-pane>

      </list-table-pane>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import SearchPane from '../../../components/SearchPane/index.vue';
import SearchPagePane from '../../../components/SearchPagePane/index.vue';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {
  AutomaticDeductionAppScene,
  Pageable,
  ResponseResult,
  SearchAppSceneModel
} from '../../../types';
import {AxiosResponse} from 'axios';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import BaseList from '../../../components/BaseList';
import {
  deleteAutomaticDeductionAppScene,
  getAutomaticDeductionAppSceneList,
  //deleteAutomaticDeductionAppScene,
} from '../../../api/pay';

import RightComponent from '../../../components/RightComponent';
import BaseTableDelete from '@/components/BaseTableDelete';
@Component({
  name: 'autimaticDeductionAppSceneList',
  components: {ListTablePane, SearchPane, SearchPagePane},
  filters: {
    windowsStatus(value: number) {
      if (value === 0) {
        return '未使用';
      } else if (value === 1) {
        return '使用中';
      }
    },
  },
  mixins: [BaseList, BaseTableDelete, RightComponent],
})
export default class AutomaticDeductionAppSceneList extends Vue {
  data: AutomaticDeductionAppScene[] = [];
  listQuery: SearchAppSceneModel = {page: 0, size: 50, total: 0};

  addAppScene() {
    this.$router.push({path: 'add-autimatic-app-scene', query: {viewModel: 'add'}});
  }

  handleDelRows(row: AutomaticDeductionAppScene[]) {
      if (row.length === 0) {
      return;
    }
      const rowsId: any[] = [];
      row.forEach((item) => rowsId.push(item.id));
      this.$confirm('确认永久删除该第三方自动续费信息吗?', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      // 删除
      const {data} = await deleteAutomaticDeductionAppScene(rowsId);
      this.$message({
        type: 'success',
        message: '删除成功',
      });
      // @ts-ignore
      this.realFetchData();
    }, async () => {
    }).catch(handlerCommonError);
  }

  // handleViewWindowsDetail(index: number, row: AutomaticDeductionAppScene) {
  //   this.$router.push({path: 'automatic-deduction-app-scene-detail', query: {id: '' + row.id}});
  // }

  handleEditLayoutDetail(index: number, row: AutomaticDeductionAppScene) {
    this.$router.push({path: 'add-autimatic-app-scene', query: {viewModel: 'edit', id: '' + row.id}});
  }

  realFetchData() {
    return getAutomaticDeductionAppSceneList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<AutomaticDeductionAppScene>>>) => {
      const responseData = response.data.data;
      this.data = responseData.content;
      console.log(this.data);
      this.listQuery.page = responseData.number;
      this.listQuery.size = responseData.size;
      this.listQuery.total = responseData.totalElements;
    }).catch(handlerCommonError);
  }
  }
</script>

<style scoped>
  .windowsList .img {
    width: 80px;
  }

</style>
