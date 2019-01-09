<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">
        查询订单类型
        <el-select size="mini" v-model="listQuery.searchHistory">
          <el-option value="1" label="最新订单"/>
          <el-option value="0" label="历史支付订单"/>
          <el-option value="2" label="历史未支付订单"/>
        </el-select>
        酷开openId
        <el-input v-model="listQuery.coocaaOpenId" size="mini" :clearable="true"></el-input>
        影视订单号
        <el-input v-model="listQuery.orderNo" size="mini" style="width:180px;" :clearable="true"></el-input>
        第三openId
        <el-input v-model="listQuery.thirdOpenId" size="mini" style="width:220px" :clearable="true"></el-input>
        支付状态
        <el-select size="mini" v-model="listQuery.payFlag">
          <el-option value="" label="全部"/>
          <el-option value="0" label="未支付"/>
          <el-option value="1" label="已支付"/>
        </el-select>
        开通状态
        <el-select size="mini" v-model="listQuery.synFlag">
          <el-option value="" label="全部"/>
          <el-option value="0" label="未开通"/>
          <el-option value="1" label="已开通"/>
        </el-select>
        mac地址
        <el-input v-model="listQuery.mac" size="mini" :clearable="true"></el-input>
        激活ID
        <el-input v-model="listQuery.tvId" size="mini" :clearable="true"></el-input>
        订单创建时间
        <el-date-picker size="mini"
                        v-model="listQuery.createTimes"
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
                highlight-current-row>
        <el-table-column align="left" label="单号信息" width="300" fixed>
          <template slot-scope="scope">
            <div>
              <span>业务订单号：&nbsp;</span> {{ scope.row.orderNo}}<br >
              <span>第三方订单号：&nbsp;</span> {{ scope.row.synTradeNo}}<br >
              <span>机器信息：&nbsp;</span> {{ scope.row.mac}} <template v-if="scope.row.tvId">[{{ scope.row.tvId}} ]</template>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="订单状态" width="200">
          <template slot-scope="scope">
            <div>
              <span>支付状态：</span>{{ scope.row.payFlag === 1 ? '已支付' : '未支付'}}<br/>
              <span>开通状态：</span>{{ scope.row.synFlag === 1 ? '已开通' : '未开通'}}<br/>
              <span>支付说明：</span>{{ scope.row.payDesc }}<br/>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="left" label="账号信息" width="400">
          <template slot-scope="scope">
            <div>
              <span>酷开openId：&nbsp;</span> <span>{{scope.row.coocaaOpenId}}</span><br/>
              <span>第三方OpenId：&nbsp;</span> <span>{{ scope.row.thirdOpenId}}</span><br/>
              <span>微信vuserid：&nbsp;</span> <span>{{ scope.row.wxVuOpenId}}</span><br/>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单时间" width="240">
          <template slot-scope="scope">
            <div>
              <span>下单时间：</span>{{ scope.row.createTime }}<br/>
              <span>支付时间：</span>{{ scope.row.payTime }}<br/>
              <span>开通时间：</span>{{scope.row.synDatetime}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单信息" width="320">
          <template slot-scope="scope">
            <div>
              <span>订单名称：</span>{{ scope.row.title }}<br/>
              <span>订单金额：</span>{{ scope.row.totalPayFee / 100 }} 元<br/>
              <span>产品源：</span>{{scope.row.orderSource}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="权益信息" width="320">
          <template slot-scope="scope">
            <div>
              <span>开始时间：</span>{{ scope.row.beginTime }}<br/>
              <span>结束时间：</span>{{ scope.row.endTime}}<br/>
              <span>退单状态：</span>{{scope.row.serviceStatus === 1 ? '已退单': '正常'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="查看该订单详情">
              <el-button type="primary" size="mini" circle icon="el-icon-search"
                         @click="handleViewBaseMoviesIqiyiOrderBaseDetail(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="尝试查看该订单支付详情">
              <el-button type="success" size="mini" circle icon="el-icon-search"
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
      <el-dialog title="会员业务订单详情" :visible.sync="dialogBaseMoviesIqiyiOrderBaseDetilVisible"
                 :append-to-body="true" :modal-append-to-body="false" width="80%"
                 @close="editDomainInfo.editDomainId = 0">
        <base-movies-iqiyi-order-base-detail :domain-id="editDomainInfo.editDomainId" :search-history-model="editDomainInfo.searchHistoryModel"/>
      </el-dialog>

      <el-dialog title="oss订单详情" :visible.sync="dialogOrderInfoDetilVisible"
                 :append-to-body="true" :modal-append-to-body="false" width="80%" @close="editDomainInfo.orderNo = ''">
        <order-info-detail :origi-order-no="editDomainInfo.orderNo"/>
      </el-dialog>

    </list-table-pane>
  </div>
</template>


<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import SearchPane from '../../../components/SearchPane/index.vue';
import SearchPagePane from '../../../components/SearchPagePane/index.vue';
import {
  BaseMoviesIqiyiOrderBase,
  BaseMoviesIqiyiOrderBaseListQuery,
  Pageable,
  ResponseResult,
  SearchHistoryModel,
} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {AxiosResponse} from 'axios';
import {getBaseMoviesIqiyiOrderBaseList} from '../../../api/authentication';
import BaseMoviesIqiyiOrderBaseDetail from './detail.vue';
import BaseList from '../../../components/BaseList';
import OrderInfoDetail from '../../pay/orders/detail.vue';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import {addDateFormatString} from '../../../utils/format-utils';
import {anyNotEmpty} from '../../../utils/validate';

interface EditDomain {
  editDomainId: number | undefined;
  searchHistoryModel: SearchHistoryModel;
  orderNo: string | undefined;
}

@Component({
  components: {BaseMoviesIqiyiOrderBaseDetail, ListTablePane, SearchPane, SearchPagePane, OrderInfoDetail},
  filters: {},
  mixins: [BaseList],
})
export default class BaseMoviesIqiyiOrderList extends Vue {
  dialogBaseMoviesIqiyiOrderBaseDetilVisible: boolean = false;
  dialogOrderInfoDetilVisible: boolean = false;

  editDomainInfo: EditDomain = {editDomainId: 0, searchHistoryModel: '1', orderNo : ''};

  data: BaseMoviesIqiyiOrderBase[] = [];
  listQuery: BaseMoviesIqiyiOrderBaseListQuery = { page: 0, size: 50, total: 0, searchHistory: '1', payFlag: '1', synFlag: '',
    createTimes: [addDateFormatString(-1, 'w'), addDateFormatString()],
  };

  handleViewBaseMoviesIqiyiOrderBaseDetail(index: number, row: BaseMoviesIqiyiOrderBase) {
    this.dialogBaseMoviesIqiyiOrderBaseDetilVisible = true;
    console.log('点击选择的订单id为' + row.id);
    this.$nextTick(() => this.editDomainInfo.editDomainId = row.id);
  }

  handleViewOrderInfoDetail(index: number, row: BaseMoviesIqiyiOrderBase) {
    this.dialogOrderInfoDetilVisible = true;
    console.log('点击选择的订单id为' + row.id);
    this.$nextTick(() => this.editDomainInfo.orderNo = row.orderNo);
  }

  realFetchData() {
    return getBaseMoviesIqiyiOrderBaseList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<BaseMoviesIqiyiOrderBase>>>) => {
      const responseData = response.data.data;
      this.data = responseData.content;
      this.listQuery.page = responseData.number;
      this.listQuery.size = responseData.size;
      this.listQuery.total = responseData.totalElements;
    }).catch(handlerCommonError);
  }


  validSearchCondition(): boolean {
    if (anyNotEmpty(this.listQuery.orderNo, this.listQuery.coocaaOpenId, this.listQuery.tvId, this.listQuery.mac)) {
      return true;
    }

    if (this.listQuery.createTimes == null) {
      this.$message.error('必须指定订单日期');
      return false;
    }
    if (this.listQuery.createTimes.length > 0) {
      const end = (+ new Date(this.listQuery.createTimes[1])) as number;
      const start = (+ new Date(this.listQuery.createTimes[0])) as number;
      if (end - start > 31 * 3 * 24 * 3600 * 1000) {
        this.$message.error('查询时间超过指定限制【可查询间隔3个月的订单】');
        return false;
      }
    }
    return true;
  }
}
</script>
