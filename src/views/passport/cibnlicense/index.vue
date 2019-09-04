<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">
        酷开账号ID
        <el-input v-model="listQuery.accountId" size="mini" :clearable="true"></el-input>
        牌照商标识
        <el-input v-model="listQuery.license" size="mini" :clearable="true"></el-input>
        内容源
        <el-input v-model="listQuery.source" size="mini" :clearable="true"></el-input>
      </search-pane>

      <el-table v-loading="listLoading" height="600" style="width: 100%"
                :data="data"
                element-loading-text="Loading"
                @selection-change="handleSelectionChange"
                border
                fit
                highlight-current-row>
        <el-table-column align="left" label="ID" width="80" fixed>
          <template slot-scope="scope">
            {{ scope.row.bindId}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="酷开帐号ID" width="100">
          <template slot-scope="scope">
            {{ scope.row.accountId}}
          </template>
        </el-table-column>

        <el-table-column align="left" label="牌照商标识" width="100">
          <template slot-scope="scope">
            {{scope.row.license}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="内容源" width="80">
          <template slot-scope="scope">
            {{scope.row.source}}
          </template>
        </el-table-column>
        <el-table-column label="牌照方帐号ID" width="200">
          <template slot-scope="scope">
            {{ scope.row.licenseAccountId }}
          </template>
        </el-table-column>
        <el-table-column label="MAC" width="120">
          <template slot-scope="scope">
            {{ scope.row.mac }}
          </template>
        </el-table-column>
        <el-table-column label="激活ID" width="100">
          <template slot-scope="scope">
            {{ scope.row.deviceId }}
          </template>
        </el-table-column>
        <el-table-column label="机型" width="80">
          <template slot-scope="scope">
            {{ scope.row.model}}
          </template>
        </el-table-column>
        <el-table-column label="机芯" width="80">
          <template slot-scope="scope">
            {{ scope.row.chip}}
          </template>
        </el-table-column>
        <el-table-column label="品牌标识" width="100">
          <template slot-scope="scope">
            {{ scope.row.brand}}
          </template>
        </el-table-column>
        <el-table-column label="IP" width="120">
          <template slot-scope="scope">
            {{ scope.row.ip}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.createTime}}
          </template>
        </el-table-column>
        <el-table-column label="最后登录时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.loginTime}}
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
  import {Component, Vue} from 'vue-property-decorator';
  import SearchPane from '../../../components/SearchPane/index.vue';
  import SearchPagePane from '../../../components/SearchPagePane/index.vue';
  import {BindLicenseAccountListQuery, BindLicenseAccount, Pageable, ResponseResult} from '../../../types';
  import ListTablePane from '../../../components/ListTablePane/index.vue';
  import {AxiosResponse} from 'axios';
  import {getCibnAccountPageList} from '../../../api/passport';
  import BaseList from '../../../components/BaseList';
  import {handlerCommonError} from '../../../utils/auth-interceptor';
  interface EditDomain {
    editDomainId: number | undefined;
  }

  @Component({
    components: { ListTablePane, SearchPane, SearchPagePane},
    filters: {},
    mixins: [BaseList],
  })
  export default class BindLicenseAccountList extends Vue {

    dialogEditFormVisible: boolean = false;
    editDomainInfo: EditDomain = {editDomainId: 0};
    data: BindLicenseAccount[] = [];
    listQuery: BindLicenseAccountListQuery = { page: 0, size: 50, total: 0};

    handleNew() {
      // 创建新用户弹窗
      this.dialogEditFormVisible = true;
      this.editDomainInfo.editDomainId = 0;
    }

    handleEdit(index: number, row: BindLicenseAccount): void {
      this.dialogEditFormVisible = true;
      this.$nextTick(() => this.editDomainInfo.editDomainId = row.bindId);
    }
    saveThenNew() {
      this.editDomainInfo.editDomainId = 0;
      // @ts-ignore
      this.fetchData();
    }

    realFetchData() {
      return getCibnAccountPageList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<BindLicenseAccount>>>) => {
        const responseData = response.data.data;
        this.data = responseData.content;
        this.listQuery.page = responseData.number;
        this.listQuery.size = responseData.size;
        this.listQuery.total = responseData.totalElements;
      }).catch(handlerCommonError);
    }

  }
</script>
