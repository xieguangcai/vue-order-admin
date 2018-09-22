<template>
  <div class="app-container">
    <el-row >
      <el-col span="2">
        <el-form-item label="账户名称">
          <el-input v-model="listQuery.userName"></el-input>
        </el-form-item>
      </el-col>
      <el-col span="2">
        <el-form-item label="登录账号">
          <el-input v-model="listQuery.nickName" ></el-input>
        </el-form-item>
      </el-col>
      <el-col>
        <el-button >查询</el-button>
      </el-col>
    </el-row>
    <div>
      <el-table v-loading="listLoading"
                :data="list"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row>
        <el-table-column align="center" label="ID" width="95">
          <template slot-scope="scope">
            {{ scope.$index }}
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
        last_login_ip
      </el-table>
    </div>
  </div>
</template>


<script lang="ts">
  import { getList } from '@/api/account';
  import { Component, Vue } from 'vue-property-decorator';

  @Component({
    filters: {

    },
  })
  export default class AppList extends Vue {
    list = null;
    listLoading = true;
    listQuery : {userName, nickName} = {} ;

    created() {
      this.fetchData();
    }

    fetchData() {
      this.listLoading = true;
      getList(this.listQuery).then((response) => {
        this.list = response.data;
        this.listLoading = false;
      });
    }
  }
</script>
