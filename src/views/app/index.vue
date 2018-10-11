<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="fetchData">
        系统名称
        <el-input v-model="listQuery.name" size="mini"></el-input>
        appKey
        <el-input v-model="listQuery.appKey" size="mini"></el-input>
      </search-pane>
      <el-button-group slot="action" class="cc-action-button-group">
        <el-button type="success" icon="el-icon-circle-plus" size="mini" @click="handleNew">新增系统</el-button>
        <el-button type="danger" icon="el-icon-circle-close" size="mini" @click="handleDel">删除系统</el-button>
      </el-button-group>
      <el-table v-loading="listLoading"
                :data="data"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row>
        <el-table-column label="ID">
          <template slot-scope="scope">
            {{ scope.row.appId }}
          </template>
        </el-table-column>
        <el-table-column label="登录名">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="appKey">
          <template slot-scope="scope">
            {{ scope.row.appKey }}
          </template>
        </el-table-column>
        <el-table-column label="appSecret">
          <template slot-scope="scope">
            {{ scope.row.appSecret }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <template v-if="scope.row.status == 1">
              启用
            </template>
            <template v-else>
              禁用
            </template>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            {{ scope.row.memo }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip content="编辑">
              <el-button type="primary" size="mini" circle icon="el-icon-edit"
                         @click="handleEdit(scope.$index, scope.row)"></el-button>
            </el-tooltip>

            <el-tooltip content="删除" slot="reference">
              <el-button type="danger" circle size="mini" icon="el-icon-delete"
                         @click="handleDelete(scope.$index, scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <search-page-pane @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :size="listQuery.size"
                        :total="listQuery.total"
                        :page="listQuery.page + 1"
                        slot="page">
      </search-page-pane>
    </list-table-pane>

    <el-dialog title="编辑接入系统" :visible.sync="dialogEditFormVisible" :close-on-click-modal="false" width="600px">
      <application-edit @cancel="dialogEditFormVisible=false" :domain-id="editDomainInfo.editDomainId"
                        @save-success-then-new="saveThenNew"
                        @save-success="()=>{this.dialogEditFormVisible=false;fetchData();this.editDomainInfo.editDomainId = 0;}"/>
    </el-dialog>
  </div>
</template>


<script lang="ts">
import {getList, deleteApp} from '@/api/account';
import {Component, Vue, Watch} from 'vue-property-decorator';
import SearchPane from '@/components/SearchPane/index.vue';
import SearchPagePane from '@/components/SearchPagePane/index.vue';
import ListTablePane from '@/components/ListTablePane/index.vue';
import ApplicationEdit from './edit.vue';
import {AxiosResponse} from 'axios';
import {ApplicationInfo, ApplicationListQuery, Pageable, ResponseResult} from '../../types';
import {getAppList} from '../../api/account';


interface EditDomain {
  editDomainId: number | undefined;
}

@Component({
  filters: {},
  components: {ApplicationEdit, ListTablePane, SearchPane, SearchPagePane},
})
export default class ApplicationList extends Vue {
  dialogEditFormVisible: boolean = false;
  editDomainInfo: EditDomain = {editDomainId: 0};
  data: ApplicationInfo[] = [];
  listLoading: boolean = true;
  listQuery: ApplicationListQuery = {name: '', appKey: '', page: 0, size: 50, total: 0};
  mutipleSelection: ApplicationInfo[] = [];


  handleEdit(index: number, row: ApplicationInfo): void {
    this.dialogEditFormVisible = true;
    this.$nextTick(() => this.editDomainInfo.editDomainId = row.appId);
  }

  handleNew() {
    // 创建新用户弹窗
    this.dialogEditFormVisible = true;
    this.editDomainInfo.editDomainId = 0;
  }

  created() {
    this.fetchData();
  }

  saveThenNew() {
    this.editDomainInfo.editDomainId = 0;
    this.fetchData();
  }

  handleSizeChange(size: number) {
    this.listQuery.size = size;
    this.fetchData();
  }

  handleCurrentChange(page: number) {
    this.listQuery.page = page - 1;
    this.fetchData();
  }

  handleSelectionChange(val: ApplicationInfo[]) {
    this.mutipleSelection = val;
  }

  handleDelete(index: number, row: ApplicationInfo) {
    this.$confirm('确认永久删除该系统应用信息吗?', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      // 删除
      const {data} = await deleteApp([row.appId]);
      this.$message({
        type: 'success',
        message: '删除成功',
      });
      this.fetchData();

    }).catch(() => {
    });
  }

  fetchData() {
    this.listLoading = true;
    try {
      getAppList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<ApplicationInfo>>>) => {
        const responseData = response.data.data;
        this.data = responseData.content;
        this.listQuery.page = responseData.number;
        this.listQuery.size = responseData.size;
        this.listQuery.total = responseData.totalElements;
        this.listLoading = false;
      }, (reason: any) => {
        this.listLoading = false;
      });
    } catch (e) {
      this.listLoading = false;
    }
  }

}
</script>
