<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">
        OSS订单ID
        <el-input v-model="listQuery.orderId" size="mini" :clearable="true"></el-input>
        手机号
        <el-input v-model="listQuery.phoneNo" size="mini" :clearable="true"></el-input>
        订单号
        <el-input v-model="listQuery.orderNo" placeholder="查询多个可以用逗号分割" size="mini" style="width:190px;"></el-input>
        支付订单号
        <el-input v-model="listQuery.ybDealNo" placeholder="查询多个可以用逗号分割" size="mini" style="width:240px"></el-input>
        业务订单号
        <el-input v-model="listQuery.origiOrderNo" placeholder="查询多个可以用逗号分割" size="mini" style="width:220px"></el-input>
        支付流水号
        <el-input v-model="listQuery.serialNo" placeholder="查询多个可以用逗号分割" size="mini" style="width:200px"></el-input>
        appCode
        <el-input v-model="listQuery.appCode" size="mini" style="width:100px" :clearable="true"></el-input>
        mac地址
        <el-input v-model="listQuery.mac" size="mini"></el-input>
        订单状态
        <el-select size="mini" v-model="listQuery.orderStatus">
          <el-option value="" label="全部"/>
          <el-option v-for="item in orderStatus" :label="item.label" :value="item.value" :key="item.value"/>
        </el-select>
        订单创建时间
        <el-date-picker size="mini"
                        v-model="listQuery.orderTimes"
                        type="datetimerange"
                        range-separator="-"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00','23:59:59']"
                        :picker-options="pickerOptions"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
        订单支付时间
        <el-date-picker size="mini"
                        v-model="listQuery.payTimes"
                        type="datetimerange"
                        range-separator="-"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00','23:59:59']"
                        :picker-options="pickerOptions"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
      </search-pane>
      <el-table v-loading="listLoading" height="600" style="width: 100%"
                :data="data"
                element-loading-text="Loading"
                border
                fit
                size="mini"
                highlight-current-row>

        <el-table-column align="left" label="单号信息" width="360" fixed>
          <template slot-scope="scope">
            <div>
              <span>oss订单号：</span>{{ scope.row.orderNo}}
              <span class="order-refund-tip" v-if="haveRefundInfo(scope.row)">
                <el-button type="warning" size="mini"
                           @click="handleViewRefundInfo(scope.row.orderRefundInfos[0].dealNo)">
                  订单重复支付了
                </el-button>
              </span>
              <br/>
              <span>业务订单号：</span>{{ scope.row.origiOrderNo}}<br/>
              <span>支付单号：</span>{{ scope.row.ybDealNo}}<br/>
              <span>支付流水号：</span>{{ scope.row.serialNo}}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="订单状态" width="200">
          <template slot-scope="scope">
            <div>
              <span>支付账号：</span>{{ scope.row.phoneNo === '-1' ? '无账号' : scope.row.phoneNo }}<br/>
              <span>mac地址：</span>{{ scope.row.mac}}<br/>
              <span
                :class="tableRowClassName(scope.row.orderStatus)">订单状态：{{orderStatusToName(scope.row.orderStatus)}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单时间" width="240">
          <template slot-scope="scope">
            <div>
              <span>下单时间：</span>{{ scope.row.orderTime }}<br/>
              <span>支付时间：</span>{{ scope.row.payTime }}<br/>
              <span>完成时间：</span>{{scope.row.completedTime}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单信息" width="540">
          <template slot-scope="scope">
            <div>
              <span>订单名称：</span>{{ scope.row.prodName }}<br/>
              <span>订单金额：</span>{{ scope.row.actualAmount }} 元<br/>
              <span>供应商：</span>[{{scope.row.appCode}}]{{ scope.row.appName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="查看该订单详情">
              <el-button type="primary" size="mini" circle icon="el-icon-search"
                         @click="handleViewOrderInfoDetail(scope.$index, scope.row)"></el-button>
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
      <el-dialog title="oss订单详情" :visible.sync="dialogOrderInfoDetilVisible" :append-to-body="true"
                 :modal-append-to-body="false" width="80%" @close="editDomainInfo.editDomainId = 0">
        <order-info-detail :domain-id="editDomainInfo.editDomainId"/>
      </el-dialog>

    </list-table-pane>
  </div>
</template>


<script lang="ts">
// @ts-ignore
import qs from 'qs';
import {Component, Vue, Watch} from 'vue-property-decorator';
import SearchPane from '../../../components/SearchPane/index.vue';
import SearchPagePane from '../../../components/SearchPagePane/index.vue';
import {OrderInfo, OrderInfoListQuery, Pageable, ResponseResult} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {AxiosResponse} from 'axios';
import {getOrderInfoList, orderStatusClass, orderStatusName} from '../../../api/pay';
import {AppModule} from '../../../store/modules/app';
import OrderInfoDetail from './detail.vue';
import BaseList from '../../../components/BaseList';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import {addDateFormatString} from '../../../utils/format-utils';
import {anyNotEmpty, isNotEmpty} from '../../../utils/validate';

interface EditDomain {
  editDomainId: number | undefined;
}

@Component({
  components: {OrderInfoDetail, ListTablePane, SearchPane, SearchPagePane},
  filters: {},
  mixins: [BaseList],
})
export default class OrderInfoList extends Vue {
  dialogOrderInfoDetilVisible: boolean = false;
  editDomainInfo: EditDomain = {editDomainId: 0};

  data: OrderInfo[] = [];
  listQuery: OrderInfoListQuery = {
    page: 0, size: 50, total: 0,
    orderTimes: [addDateFormatString(-1, 'w'), addDateFormatString()],

  };

  tableRowClassName(orderStatus: string): string {
    return orderStatusClass(orderStatus);
  }

  onCreated() {
    // @ts-ignore
    this.needLoadOnCreate = false;
  }

  get orderStatus() {
    return AppModule.orderStatus;
  }

  handleViewRefundInfo(dealNo: string) {
      this.$router.push({path: 'order-refund-list', query: {dealNo}});
  }

  haveRefundInfo(row: OrderInfo) {
    return row.orderRefundInfos != null && row.orderRefundInfos.length > 0;
  }

  orderStatusToName(code: string) {
    return orderStatusName(code);
  }

  handleViewOrderInfoDetail(index: number, row: OrderInfo) {
    this.dialogOrderInfoDetilVisible = true;
    console.log('点击选择的订单id为' + row.orderId);
    this.$nextTick(() => this.editDomainInfo.editDomainId = row.orderId);
  }

  realFetchData() {
    return getOrderInfoList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<OrderInfo>>>) => {
      const responseData = response.data.data;
      this.data = responseData.content;
      this.listQuery.page = responseData.number;
      this.listQuery.size = responseData.size;
      this.listQuery.total = responseData.totalElements;
    }).catch(handlerCommonError);
  }

  validSearchCondition(): boolean {
    if (anyNotEmpty(this.listQuery.phoneNo, this.listQuery.orderNo, this.listQuery.mac, this.listQuery.origiOrderNo, this.listQuery.ybDealNo, this.listQuery.orderId, this.listQuery.serialNo)) {
      return true;
    }

    if (this.listQuery.orderTimes == null) {
      this.$message.error('必须指定订单日期');
      return false;
    }
    if (this.listQuery.orderTimes.length > 0) {
      const end = (+new Date(this.listQuery.orderTimes[1])) as number;
      const start = (+new Date(this.listQuery.orderTimes[0])) as number;
      if (end - start > 31 * 3 * 24 * 3600 * 1000) {
        this.$message.error('查询时间超过指定限制【可查询间隔3个月的订单】');
        return false;
      }
    }
    return true;
  }
}
</script>

<style scoped>
  .order-refund-tip {
    color: red;
  }
</style>

