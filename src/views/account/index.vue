<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="fetchData">
        账户名称
        <el-input v-model="listQuery.userName" size="mini"></el-input>
        登录账号
        <el-input v-model="listQuery.nickName" size="mini"></el-input>
        状态
        <el-select size="mini" v-model="listQuery.accountStatus">
          <el-option value="" label="全部"/>
          <el-option v-for="item in accountStatus" :label="item.label" :value="item.value" :key="item.value"/>
        </el-select>
        账号创建时间
        <el-date-picker size="mini"
                        v-model="listQuery.createTime"
                        type="daterange"
                        range-separator="-"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
      </search-pane>
      <el-button-group slot="action" class="cc-action-button-group">
        <el-button type="success" icon="el-icon-circle-plus" size="mini" @click="handleNew">新增用户</el-button>
        <el-button type="danger" icon="el-icon-circle-close" size="mini" @click="handleNew">删除用户</el-button>
      </el-button-group>
      <el-table v-loading="listLoading"
                :data="data"
                element-loading-text="Loading"
                @select-change="handleSelectionChange"
                border
                fit
                highlight-current-row>
        <el-table-column type="selection" with="55">
        </el-table-column>
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index + ((listQuery.page) * listQuery.size)+ 1}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="ID" width="95">
          <template slot-scope="scope">
            {{ scope.row.accountId}}
          </template>
        </el-table-column>
        <el-table-column label="登录名">
          <template slot-scope="scope">
            {{ scope.row.nickName }}
          </template>
        </el-table-column>
        <el-table-column label="用户名">
          <template slot-scope="scope">
            {{ scope.row.userName }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <template v-if="scope.row.accountStatus == 1">
              启用
            </template>
            <template v-else>
              禁止登录
            </template>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            {{ scope.row.memo }}
          </template>
        </el-table-column>
        <el-table-column label="最后登录IP">
          <template slot-scope="scope">
            {{ scope.row.lastLoginIp }}
          </template>
        </el-table-column>
        <el-table-column label="部门">
          <template slot-scope="scope">
            {{ scope.row.department }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip content="编辑">
              <el-button type="primary" size="mini" circle icon="el-icon-edit"
                         @click="handleEdit(scope.$index, scope.row)"></el-button>
            </el-tooltip>

            <el-tooltip content="修改用户角色">
              <el-button type="info" circle size="mini" icon="el-icon-document"
                         @click="handleSetRoles(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="编辑" slot="reference">
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
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="600px">
      <account-edit @cancel="dialogFormVisible=false" :account-id="editDomain.accountId"
                    @save-success-then-new="saveThenNew"
                    @save-success="()=>{dialogFormVisible=false;fetchData();}"/>
    </el-dialog>
  </div>
</template>


<script lang="ts">
import {getList, deleteUser} from '@/api/account';
import {Component, Vue} from 'vue-property-decorator';
import SearchPane from '@/components/SearchPane/index.vue';
import SearchPagePane from '@/components/SearchPagePane/index.vue';
import {AccountInfo, AccountListQuery, IPageinfo, Pageable, ResponseResult} from '../../types/index';
import ListTablePane from '@/components/ListTablePane/index.vue';
import AccountEdit from './edit.vue';
import {AxiosResponse} from 'axios';
import {UserModule} from '../../store/modules/user';

@Component({
  components: {AccountEdit, ListTablePane, SearchPane, SearchPagePane},
  filters: {},
})
export default class AccountList extends Vue {
  dialogFormVisible: boolean = false;
  editDomain: AccountInfo = {accountStatus: 1};

  data: AccountInfo[] = [];
  listLoading: boolean = true;
  listQuery: AccountListQuery = {userName: '', nickName: '', page: 0, size: 50, total: 0, createTime: []};
  mutipleSelection: AccountInfo[] = [];

  get accountStatus() {
    return UserModule.accountStatus;
  }

  handleEdit(index: number, row: AccountInfo) {
    this.editDomain = row;
    this.dialogFormVisible = true;
  }

  handleNew() {
    // 创建新用户弹窗
    this.editDomain = {accountStatus: 1};
    this.dialogFormVisible = true;
  }

  created() {
    this.fetchData();
  }

  saveThenNew() {
    this.editDomain = {accountStatus: 1};
    this.fetchData();
  }

  handlePageInfoChange(pageInfo: IPageinfo) {
    if (null != pageInfo) {
      this.listQuery.size = pageInfo.size;
      this.listQuery.page = pageInfo.page;
      this.fetchData();
    }
  }

  handleSizeChange(size: number) {
    this.listQuery.size = size;
    this.fetchData();
  }

  handleCurrentChange(page: number) {
    this.listQuery.page = page - 1;
    this.fetchData();
  }

  handleSelectionChange(val: AccountInfo[]) {
    this.mutipleSelection = val;
  }

  handleDelete(index: number, row: AccountInfo) {
    this.$confirm('确认永久删除该用户信息吗?', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      // 删除
      const {data} = await deleteUser([row.accountId]);
      this.$message({
        type: 'success',
        message: '删除成功',
      });
      this.fetchData();

    }).catch(() => {
      // this.$message({
      //   type: 'info',
      //   message:'已取消删除'
      // })
    });
  }

  fetchData() {
    this.listLoading = true;
    try {
      getList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<AccountInfo>>>) => {
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
