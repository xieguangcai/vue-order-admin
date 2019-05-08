<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">
        手机号
        <el-input v-model="listQuery.phoneNo" size="mini"></el-input>
        mac地址
        <el-input v-model="listQuery.mac" size="mini" style="width:180px;"></el-input>
      </search-pane>
      <el-table v-loading="listLoading" height="600" style="width: 100%"
                :data="data"
                element-loading-text="Loading"
                border
                fit
                size="mini"
                highlight-current-row>

        <el-table-column align="left" label="手机账号" width="120" fixed>
          <template slot-scope="scope">
            <div>
              {{ scope.row.userInfo.phoneNo}}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="mac地址" width="120">
          <template slot-scope="scope">
            <div>
              {{ scope.row.mac}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="终端序列号" width="160">
          <template slot-scope="scope">
            <div>
              {{ scope.row.terminalNo}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="机型" width="80">
          <template slot-scope="scope">
            <div>
              {{ scope.row.terminalModel}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="机芯" width="80">
          <template slot-scope="scope">
            <div>
              {{ scope.row.chipsetCode}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <div>
              {{ scope.row.bindingStatus === '1' ? '绑定': '解绑'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="绑定时间" width="150">
          <template slot-scope="scope">
            <div>
              {{ scope.row.bindingTime}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="60" align="center">
          <template slot-scope="scope">
            <div>
              <el-tooltip content="解绑终端" v-if="scope.row.bindingStatus === '1'">
                <el-button type="primary" size="mini" circle icon="el-icon-edit"
                           @click="handleUnbind(scope.$index, scope.row)"></el-button>
              </el-tooltip>
            </div>
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
import SearchPane from '../../../components/SearchPane/index.vue';
import SearchPagePane from '../../../components/SearchPagePane/index.vue';
import {
  BindUserTerminal,
  BindUserTerminalListQuery,
  Pageable,
  ResponseResult,
} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {AxiosResponse} from 'axios';
import {getBindUserTerminal, unBindUserTerminal} from '../../../api/pay';
import OrderInfoDetail from '../orders/detail.vue';
// @ts-ignore
import qs from 'qs';
import BaseList from '../../../components/BaseList';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import {AppModule} from '../../../store/modules/app';

interface EditDomain {
  editDomainId: number | undefined;
}

@Component({
  components: {OrderInfoDetail, ListTablePane, SearchPane, SearchPagePane},
  filters: {},
  mixins: [BaseList],
})
export default class OrderRefundInfoList extends Vue {
  editDomainInfo: EditDomain = {editDomainId: 0};

  data: BindUserTerminal[] = [];
  listQuery: BindUserTerminalListQuery = {page: 0, size: AppModule.pageTotal, total: 0};

  handleUnbind(index: number, row: BindUserTerminal) {
    this.$confirm('确认解除该设备账号绑定关系吗?', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      // 下线活动
      unBindUserTerminal(row.bindUserTerminalId, row.userInfo.userId).then(() => {
        this.$notify({
          title: '成功解除设备绑定',
          message: '用户[' + row.userInfo.phoneNo + ']与设备[' + row.mac + ']成功解绑。',
          type: 'success',
        });
        // @ts-ignore
        this.fetchData();
      }).catch(handlerCommonError);

    }, () => {
    }).catch(handlerCommonError);
  }

  realFetchData() {
    return getBindUserTerminal(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<BindUserTerminal>>>) => {
      const responseData = response.data.data;
      this.data = responseData.content;
      this.listQuery.page = responseData.number;
      this.listQuery.size = responseData.size;
      this.listQuery.total = responseData.totalElements;
    }).catch(handlerCommonError);
  }
}
</script>
