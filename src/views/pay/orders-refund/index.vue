<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">
        手机号
        <el-input v-model="listQuery.phoneNo" size="mini"></el-input>
        订单号
        <el-input v-model="listQuery.transactionId" size="mini" style="width:180px;"></el-input>
        支付订单号
        <el-input v-model="listQuery.dealNo" size="mini" style="width:220px"></el-input>
        业务订单号
        <el-input v-model="listQuery.origiOrderNo" size="mini" style="width:220px"></el-input>
        支付流水号
        <el-input v-model="listQuery.serialNo" size="mini" style="width:220px"></el-input>
      </search-pane>
      <el-table v-loading="listLoading" height="600" style="width: 100%"
                :data="data"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row>

        <el-table-column align="left" label="oss订单号" width="300" fixed>
          <template slot-scope="scope">
            <div>
              {{ scope.row.transactionId}}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="业务订单号" width="200">
          <template slot-scope="scope">
            <div>
              {{ scope.row.origiOrderNo}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="支付单号" width="240">
          <template slot-scope="scope">
            <div>
              {{ scope.row.dealNo}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="流水号" width="540">
          <template slot-scope="scope">
            <div>
              {{ scope.row.serialNo}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="540">
          <template slot-scope="scope">
            <div>
              {{ scope.row.refundDate}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="查看该订单详情">
              <el-button type="primary" size="mini" circle icon="el-icon-search"
                         @click="handleViewOrderRefundInfoDetail(scope.$index, scope.row)"></el-button>
            </el-tooltip>
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
      <el-dialog title="oss订单详情" :visible.sync="dialogOrderRefundInfoDetilVisible" :append-to-body="true"
                 :modal-append-to-body="false" width="80%" @close="editDomainInfo.editDomainId = 0">
        <order-info-detail :domain-id="editDomainInfo.editDomainId"/>
      </el-dialog>

    </list-table-pane>
  </div>
</template>


<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import SearchPane from '../../../components/SearchPane/index.vue';
  import SearchPagePane from '../../../components/SearchPagePane/index.vue';
  import {OrderRefundInfo, OrderRefundInfoListQuery, Pageable, ResponseResult} from '../../../types';
  import ListTablePane from '../../../components/ListTablePane/index.vue';
  import {AxiosResponse} from 'axios';
  import {getOrderRefundInfoList} from '../../../api/pay';
  import OrderInfoDetail from '../orders/detail.vue';
  // @ts-ignore
  import qs from 'qs';
  import BaseList from '../../../components/BaseList';
  import {Message} from 'element-ui';
  import {handlerCommonError} from '../../../utils/auth-interceptor';

  interface EditDomain {
    editDomainId: number | undefined;
  }

  @Component({
    components: {OrderInfoDetail, ListTablePane, SearchPane, SearchPagePane},
    filters: {},
    mixins: [BaseList],
  })
  export default class OrderRefundInfoList extends Vue {
    dialogOrderRefundInfoDetilVisible: boolean = false;
    editDomainInfo: EditDomain = {editDomainId: 0};

    data: OrderRefundInfo[] = [];
    listQuery: OrderRefundInfoListQuery = {page: 0, size: 50, total: 0};

    handleViewOrderRefundInfoDetail(index: number, row: OrderRefundInfo) {
      this.dialogOrderRefundInfoDetilVisible = true;
      console.log('点击选择的订单id为' + row.orderId);
      this.$nextTick(() => this.editDomainInfo.editDomainId = row.orderId);
    }

    realFetchData() {
      return getOrderRefundInfoList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<OrderRefundInfo>>>) => {
        const responseData = response.data.data;
        this.data = responseData.content;
        this.listQuery.page = responseData.number;
        this.listQuery.size = responseData.size;
        this.listQuery.total = responseData.totalElements;
      }).catch(handlerCommonError);
    }
  }
</script>
