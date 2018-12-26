<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="fetchData">
        角色名称
        <el-input v-model="listQuery.name" size="mini"></el-input>
        roleKey
        <el-input v-model="listQuery.roleKey" size="mini"></el-input>
      </search-pane>
      <el-button-group slot="action" class="cc-action-button-group">
        <el-button type="success" icon="el-icon-circle-plus" size="mini" @click="handleNew">新增角色</el-button>
        <el-button type="danger" icon="el-icon-circle-close" size="mini" @click="handleDel">删除选中角色</el-button>
      </el-button-group>
      <el-table v-loading="listLoading"
                :data="data"
                element-loading-text="Loading"
                @selection-change="handleSelectionChange"
                border
                fit
                highlight-current-row>
        <el-table-column type="selection" with="55">
        </el-table-column>
        <el-table-column label="ID" with="80">
          <template slot-scope="scope">
            {{ scope.row.roleId }}
          </template>
        </el-table-column>
        <el-table-column label="所属系统">
          <template slot-scope="scope">
            {{ scope.row.application.name }}
          </template>
        </el-table-column>
        <el-table-column label="角色名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="roleKey">
          <template slot-scope="scope">
            {{ scope.row.roleKey }}
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
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip content="编辑">
              <el-button type="primary" size="mini" circle icon="el-icon-edit"
                         @click="handleEdit(scope.$index, scope.row)"></el-button>
            </el-tooltip>

            <el-tooltip content="删除" slot="reference">
              <el-button type="danger" circle size="mini" icon="el-icon-delete"
                         @click="handleDelRows([scope.row])"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <search-page-pane @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :size="size"
                        :total="total"
                        :page="page"
                        slot="page">
      </search-page-pane>
    </list-table-pane>

    <el-dialog title="编辑角色" :visible.sync="dialogEditFormVisible" :close-on-click-modal="false" width="600px">
      <role-edit @cancel="dialogEditFormVisible=false; editDomainInfo.editDomainId = 0;" :domain-id="editDomainInfo.editDomainId"
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
import RoleEdit from './edit.vue';
import {AxiosResponse} from 'axios';
import {Pageable, ResponseResult, RoleInfo, RoleListQuery} from '../../../types';
import {deleteRole, getRoleList} from '../../../api/account';
import BaseList from '../../../components/BaseList';
import BaseTableDelete from '../../../components/BaseTableDelete';
import {handlerCommonError} from '../../../utils/auth-interceptor';

interface EditDomain {
  editDomainId: number | undefined;
}

@Component({
  filters: {},
  mixins: [BaseList, BaseTableDelete],
  components: {RoleEdit, ListTablePane, SearchPane, SearchPagePane},
})
export default class RoleList extends Vue {
  dialogEditFormVisible: boolean = false;
  editDomainInfo: EditDomain = {editDomainId: 0};
  data: RoleInfo[] = [];
  listQuery: RoleListQuery = {name: '', roleKey: '', page: 0, size: 50, total: 0};


  handleEdit(index: number, row: RoleInfo): void {
    this.dialogEditFormVisible = true;
    this.$nextTick(() => this.editDomainInfo.editDomainId = row.roleId);
  }

  handleNew() {
    // 创建新用户弹窗
    this.dialogEditFormVisible = true;
    this.editDomainInfo.editDomainId = 0;
  }

  saveThenNew() {
    this.editDomainInfo.editDomainId = 0;
    // @ts-ignore
    this.fetchData();
  }

  handleDelRows(row: RoleInfo[]) {
    if (row.length === 0) {
      return;
    }

    const rowsId: number[] = [];
    row.forEach((item) => rowsId.push(item.roleId));

    this.$confirm('确认永久删除该系统角色信息吗?', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      // 删除
      const {data} = await deleteRole(rowsId);
      this.$message({
        type: 'success',
        message: '删除成功',
      });
      // @ts-ignore
      this.fetchData();

    }).catch(handlerCommonError);
  }

  realFetchData() {
    return getRoleList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<RoleInfo>>>) => {
      const responseData = response.data.data;
      this.data = responseData.content;
      this.listQuery.page = responseData.number;
      this.listQuery.size = responseData.size;
      this.listQuery.total = responseData.totalElements;
    });
  }
}
</script>
