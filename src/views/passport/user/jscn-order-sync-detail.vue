<template>
  <div v-loading="listLoading">
    <el-table style="width: 100%"
              :data="data"
              element-loading-text="Loading"
              border
              fit
              size="mini"
              @row-click="loadCoocaaUserInfo"
              highlight-current-row>
      <el-table-column align="left" label="ID" width="80" fixed>
        <template slot-scope="scope">
          <div>
            {{scope.row.id}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160">
        <template slot-scope="scope">
          <div>
            {{scope.row.createTime}}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="来源IP" width="120">
        <template slot-scope="scope">
          <div>
            {{scope.row.sourceIp}}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="来源操作" width="80">
        <template slot-scope="scope">
          <div>
            {{ scope.row.sourceAction === 'authorization' ? '订购' : '取消订购'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="用户编码" width="120">
        <template slot-scope="scope">
          <div>
            {{scope.row.userId}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="产品编码" width="120">
        <template slot-scope="scope">
          <div>
            {{scope.row.productCodes}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="参数" width="600">
        <template slot-scope="scope">
          <div>
            {{scope.row.params}}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="智能卡号" width="200">
        <template slot-scope="scope">
          <div>
            {{scope.row.smartCardId}}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="家庭编码" width="200">
        <template slot-scope="scope">
          <div>
            {{scope.row.customerCode}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="单号" width="120">
        <template slot-scope="scope">
          <div>
            {{scope.row.synTradeNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="sn" width="120">
        <template slot-scope="scope">
          <div>
            {{scope.row.sn}}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import {
  ExternalAccessRecords,
  ResponseResult,
} from '../../../types';

import {AxiosResponse} from 'axios';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import {externalAccessRecordsList} from '../../../api/passport';

@Component({
  name: 'JscnOrderSyncDetail',
  components: {},
})
export default class JscnOrderSyncDetail extends Vue {
  listLoading: boolean = false;
  data: ExternalAccessRecords[] = [];

  @Prop({type: String, default: ''})
    // @ts-ignore
  userId: string = '';

  @Watch('userId', {immediate: true})
  handleOpenIdhange(newVal: string | undefined, oldVal: string | undefined) {
    if (newVal != null && newVal !== '') {
      this.fetchData();
    }
  }

  fetchData() {
    this.listLoading = true;
    this.realFetchData().finally(() => {
      this.listLoading = false;
    });
  }

  realFetchData() {
    return externalAccessRecordsList(this.userId).then((response: AxiosResponse<ResponseResult<ExternalAccessRecords[]>>) => {
      const responseData = response.data.data;
      this.data = responseData;
    }).catch(handlerCommonError);
  }
}
</script>


<style scoped>

</style>

