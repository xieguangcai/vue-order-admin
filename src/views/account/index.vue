<template>
  <div>
    <list-table-pane>
      <search-pane slot = "searchpane"  @click="fetchData">
        账户名称
        <el-input v-model="listQuery.userName"></el-input>
        登录账号
        <el-input v-model="listQuery.nickName" ></el-input>
      </search-pane>
      <div slot="action">
        <el-button type="success" icon="el-icon-circle-plus" round @click="handleNew">新增用户</el-button>
      </div>
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
        <el-table-column label="操作" align="center" >
          <template slot-scope="scope">
            <el-tooltip content="编辑">
              <el-button type="primary"  size="mini" circle icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"></el-button>
            </el-tooltip>

            <el-tooltip content="修改用户角色">
              <el-button type="info" circle size="mini" icon="el-icon-document" @click="handleSetRoles(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="编辑"  slot="reference">
              <el-button  type="danger" circle size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <search-page-pane  @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :page-info="listQuery" slot="page">
      </search-page-pane>
    </list-table-pane>
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="600px">
      <account-edit :account-info="editDomain" @cancel="dialogFormVisible=false"
                    @save-success-then-new="saveThenNew"
                    @save-success="()=>{dialogFormVisible=false;fetchData();}"/>
    </el-dialog>
  </div>
</template>


<script lang="ts">
  import { getList, deleteUser} from '@/api/account';
  import { Component, Vue } from 'vue-property-decorator';
  import SearchPane from '@/components/SearchPane/index.vue';
  import SearchPagePane from '@/components/SearchPagePane/index.vue';
  import {AccountInfo, Pageable, ResponseResult} from "../../api";
  import ListTablePane from "../../components/ListTablePane/index";
  import AccountEdit from "./edit";

  @Component({
    components: {AccountEdit, ListTablePane, SearchPane, SearchPagePane, ListTablePane},
    filters: {

    },
  })
  export default class AccountList extends Vue {
    dialogFormVisible:boolean = false;
    editDomain:AccountInfo = {accountStatus: 1};

    data = null;
    listLoading: boolean = true;
    listQuery : {userName, nickName,page,size, total} = {userName:'', nickName:'', page: 0, size:50, total:0} ;
    mutipleSelection = [];

    handleEdit(index : number , row : AccountInfo){
      this.editDomain = row;
      this.dialogFormVisible = true;
    }

    handleNew(){
      //创建新用户弹窗
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

    handleSizeChange(size) {
      this.listQuery.size = size;
      this.fetchData();
    }
    handleCurrentChange(page){
      this.listQuery.page = page - 1;
      this.fetchData();
    }
    handleSelectionChange(val){
      this.mutipleSelection = val;
    }

    handleDelete(index, row: AccountInfo){
      this.$confirm('确认永久删除该用户信息吗?','提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async ()=>{
        //删除
        const { data } = await deleteUser([row.accountId]);
        this.$message({
         type:'success',
         message:'删除成功'
        });
        this.fetchData();

      }).catch(()=>{
        // this.$message({
        //   type: 'info',
        //   message:'已取消删除'
        // })
      })
    }
    fetchData() {
      this.listLoading = true;
      getList(this.listQuery).then((response: ResponseResult<Pageable>) => {
        this.data = response.data.content;
        this.listQuery.page = response.data.number;
        this.listQuery.size = response.data.size;
        this.listQuery.total = response.data.totalElements;
        this.listLoading = false;
      });
    }
  }
</script>
