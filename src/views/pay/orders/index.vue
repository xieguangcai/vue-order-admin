<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="fetchData">
        手机号
        <el-input v-model="listQuery.phoneNo" size="mini"></el-input>
        订单号
        <el-input v-model="listQuery.orderNo" size="mini"></el-input>
        支付订单号
        <el-input v-model="listQuery.ybDealNo" size="mini"></el-input>
        业务订单号
        <el-input v-model="listQuery.origiOrderNo" size="mini"></el-input>
        支付流水号
        <el-input v-model="listQuery.serialNo" size="mini"></el-input>
        appCode
        <el-input v-model="listQuery.appCode" size="mini"></el-input>
        mac地址
        <el-input v-model="listQuery.mac" size="mini"></el-input>
        <!--订单状态-->
        <!--<el-select size="mini" v-model="listQuery.orderStatus">-->
          <!--<el-option value="" label="全部"/>-->
          <!--<el-option v-for="item in orderStatus" :label="item.label" :value="item.value" :key="item.value"/>-->
        <!--</el-select>-->
        订单创建时间
        <el-date-picker size="mini"
                        v-model="listQuery.orderTime"
                        type="daterange"
                        range-separator="-"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
        订单支付时间
        <el-date-picker size="mini"
                        v-model="listQuery.payTime"
                        type="daterange"
                        range-separator="-"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
      </search-pane>
      <el-table v-loading="listLoading" height="600"  style="width: 100%"
                :data="data"
                element-loading-text="Loading"
                @selection-change="handleSelectionChange"
                border
                fit
                highlight-current-row>

        <el-table-column align="left" label="单号信息" width="300" fixed>
          <template slot-scope="scope">
            <div>
              <span>oss订单号：</span>{{ scope.row.orderNo}}<br/>
              <span>业务订单号：</span>{{ scope.row.origiOrderNo}}<br/>
              <span>支付单号：</span>{{ scope.row.ybDealNo}}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="订单状态" width="200" >
          <template slot-scope="scope">
            <div>
              <span>支付账号：</span>{{ scope.row.phoneNo}}<br/>
              <span>mac地址：</span>{{ scope.row.mac}}<br/>
              <span :class="tableRowClassName(scope.row.orderStatus)">订单状态：{{orderStatusName(scope.row.orderStatus)}}</span>
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
                         @click="handleEdit(scope.$index, scope.row)"></el-button>
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
  </div>
</template>


<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import SearchPane from '../../../components/SearchPane/index.vue';
import SearchPagePane from '../../../components/SearchPagePane/index.vue';
import {OrderInfo, IPageinfo, OrderInfoListQuery, Pageable, ResponseResult} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {AxiosResponse} from 'axios';
import {getOrderInfoList} from '../../../api/pay';
import {AppModule} from '../../../store/modules/app';

interface EditDomain {
  editRoleAccountId: number | undefined;
  editAccountId: number | undefined;
}

@Component({
  components: {ListTablePane, SearchPane, SearchPagePane},
  filters: {},
})
export default class AccountList extends Vue {
  dialogEditFormVisible: boolean = false;
  dialogEditUserRoleFormVisible: boolean = false;
  editDomainInfo: EditDomain = {editAccountId: 0, editRoleAccountId: 0};

  data: OrderInfo[] = [];
  listLoading: boolean = true;
  listQuery: OrderInfoListQuery = {mac: '', page: 0, size: 50, total: 0};
  mutipleSelection: OrderInfo[] = [];

  tableRowClassName(orderStatus: string) {
    if (orderStatus === 'CC00502') {
      return 'warning-row';
    } else if (orderStatus === 'CC00503') {
      return 'success-row';
    }
    return '';
  }


  get orderStatus() {
    return AppModule.orderStatus;
  }
  created() {
    this.fetchData();
  }
  orderStatusName(code: string) {
    let name = code;
    this.orderStatus.forEach((item) => {if (item.value === code) {name = item.label; return false; }});
    return name;
  }
  saveThenNew() {
    this.editDomainInfo.editAccountId = 0;
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

  handleSelectionChange(val: OrderInfo[]) {
    this.mutipleSelection = val;
  }

  fetchData() {
    this.listLoading = true;
    try {
      getOrderInfoList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<OrderInfo>>>) => {
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
