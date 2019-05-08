<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">
        手机号/合同号
        <el-input v-model="listQuery.userCode" size="mini" :clearable="true"></el-input>
        机型
        <el-input v-model="listQuery.deviceModel" size="mini" :clearable="true"></el-input>
        barcode
        <el-input v-model="listQuery.deviceBarcode" size="mini" :clearable="true"></el-input>
      </search-pane>

      <el-table v-loading="listLoading" height="600" style="width: 100%"
                :data="data"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row>
        <el-table-column align="left" label="ID" width="100" fixed>
          <template slot-scope="scope">
             {{ scope.row.deviceActivityId}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="手机号/合同号" width="150">
          <template slot-scope="scope">
            {{ scope.row.userCode}}
          </template>
        </el-table-column>

        <el-table-column align="left" label="MAC" width="150">
          <template slot-scope="scope">
            {{scope.row.deviceMac}}
          </template>
        </el-table-column>
        <el-table-column label="barcode" width="260">
          <template slot-scope="scope">
            {{ scope.row.deviceBarcode }}
          </template>
        </el-table-column>
        <el-table-column label="机芯" width="100">
          <template slot-scope="scope">
            {{ scope.row.deviceChip }}
          </template>
        </el-table-column>
        <el-table-column label="机型" width="100">
          <template slot-scope="scope">
            {{ scope.row.deviceModel }}
          </template>
        </el-table-column>
        <el-table-column label="IP" width="200">
          <template slot-scope="scope">
            {{ scope.row.deviceIp }}
          </template>
        </el-table-column>
        <el-table-column label="激活时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.activeTime }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="修改时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.updateTime }}
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
  Pageable,
  ResponseResult,
  SearchHistoryModel, DeviceActivityInfo, DeviceActivityInfoListQuery,
} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {AxiosResponse} from 'axios';
import BaseList from '../../../components/BaseList';
import {handlerCommonError} from '../../../utils/auth-interceptor';

import {getDeviceActivePageList} from '@/api/deviceActive';

@Component({
  components: {ListTablePane, SearchPane, SearchPagePane},
  filters: {},
  mixins: [BaseList],
})
export default class DeviceActivityList extends Vue {


  data: DeviceActivityInfo[] = [];
  listQuery: DeviceActivityInfoListQuery = { page: 0, size: 50, total: 0};


  realFetchData() {
    return getDeviceActivePageList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<DeviceActivityInfo>>>) => {
      const responseData = response.data.data;
      this.data = responseData.content;
      this.listQuery.page = responseData.number;
      this.listQuery.size = responseData.size;
      this.listQuery.total = responseData.totalElements;
    }).catch(handlerCommonError);
  }


  validSearchCondition(): boolean {

    return true;
  }
}
</script>
