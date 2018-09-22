<template>
  <div class="app-container">
    <search-pane  @click="fetchData">
        账户名称
          <el-input v-model="listQuery.userName"></el-input>
        登录账号
          <el-input v-model="listQuery.nickName" ></el-input>
    </search-pane>
    <el-table v-loading="listLoading"
              :data="data"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row>
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
    </el-table>

    <search-page-pane  @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :page-info="listQuery"
    ></search-page-pane>
  </div>
</template>


<script lang="ts">
  import { getList } from '@/api/account';
  import { Component, Vue } from 'vue-property-decorator';
  import SearchPane from '@/components/SearchPane/index.vue';
  import SearchPagePane from '@/components/SearchPagePane/index.vue';
  import {Pageable, ResponseResult} from "../../api";

  @Component({
    components: {SearchPane, SearchPagePane},
    filters: {

    },
  })
  export default class AccountList extends Vue {
    data = null;
    listLoading = true;
    listQuery : {userName, nickName,page,size, total} = {userName:'', nickName:'', page: 0, size:50, total:0} ;

    created() {
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
