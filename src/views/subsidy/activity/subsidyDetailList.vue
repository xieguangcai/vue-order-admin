<template>
  <div class="subsidyDetailList">
    <div>津贴活动简报：</div>
    <el-form class="activityInfo" :model="subsidyDetail" :inline="true">
      <el-form-item
        label="津贴发放总额:">
        <span>{{subsidyDetail.sendMoney}}</span> 元&nbsp;&nbsp;&nbsp;&nbsp;
      </el-form-item>
      <el-form-item
        label="津贴领取总额:">
        <span>{{subsidyDetail.receiveMoney}}</span> 元&nbsp;&nbsp;&nbsp;&nbsp;
      </el-form-item>
      <el-form-item
        label="津贴使用总额:">
        <span>{{subsidyDetail.useMoney}}</span> 元
      </el-form-item>
    </el-form>
    <el-tabs v-model="tabActiveName" type="border-card" @tab-click="handleTabClick()">
      <el-tab-pane label="津贴领取流水" name="receiveDetail">
        <div class="table_class">
          <search-pane slot="searchpane" @click="refetchData">
            <el-input v-model="listQuery.searchValue" size="mini" placeholder="openID/mac/激活ID"></el-input>
          </search-pane>
          <el-table :data="subsidyContent">
            <el-table-column
              label="ID"
              prop="userDetailId">
            </el-table-column>
            <el-table-column
              label="用户OpenId"
              prop="openId" width="300px">
            </el-table-column>
            <el-table-column
              label="设备ID"
              prop="driver" width="280px">
            </el-table-column>
            <el-table-column
              label="用户昵称"
              prop="nickName">
            </el-table-column>
            <el-table-column
              label="津贴名称"
              prop="subsidyName">
            </el-table-column>
            <el-table-column
              label="津贴面额"
              prop="moneyStr" width="100px">
            </el-table-column>
            <el-table-column
              label="获得时间"
              prop="createTime" width="160px">
            </el-table-column>
          </el-table>
          <search-page-pane @size-change="handleSizeChange" @current-change="handleCurrentChange" :size="size"
                            :page="page"
                            :total="total" slot="page"></search-page-pane>
        </div>
      </el-tab-pane>
      <el-tab-pane label="津贴使用流水" name="useDetail">
        <div class="table_class">
          <!--<el-button>导出</el-button>-->
          <search-pane slot="searchpane" @click="refetchData">
            <el-date-picker size="mini"
                            v-model="listQuery.createTime"
                            type="datetimerange"
                            range-separator="-"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :default-time="['00:00:00','23:59:59']"
                            :picker-options="pickerOptions"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
            </el-date-picker>
            <!--<el-date-picker type="date" placeholder="选择日期" v-model="listQuery.createTime"></el-date-picker>-->
            <!--<el-input placeholder="业务线" size="mini" v-model="listQuery.businessName"></el-input>-->
            <el-select placeholder="业务线" size="mini" v-model="listQuery.businessName">
              <el-option v-for="item in businessList"
                         :label="item.text"
                         :key="item.value"
                         :value="item.value">
              </el-option>
            </el-select>
            <el-input v-model="listQuery.searchValue" size="mini" placeholder="openID/mac/激活ID/订单号"></el-input>
          </search-pane>
          <el-table :data="subsidyContent">
            <el-table-column
              label="ID" fixed="left"
              prop="userDetailId">
            </el-table-column>
            <el-table-column
              label="用户OpenId" fixed="left"
              prop="openId" width="280px">
            </el-table-column>
            <el-table-column
              label="设备ID"
              prop="driver" width="250px">
            </el-table-column>
            <el-table-column
              label="用户昵称" min-width="150px"
              prop="nickName">
            </el-table-column>
            <el-table-column width="110px"
              label="业务线"
              prop="businessName">
            </el-table-column>
            <el-table-column
              label="订单号"
              prop="orderNo" width="210px">
            </el-table-column>
            <el-table-column
              label="使用额度"
              prop="moneyStr" width="100px">
            </el-table-column>
            <el-table-column
              label="订单记账时间"
              prop="createTime" width="160px">
            </el-table-column>
            <el-table-column
              label="状态"
              prop="statusStr" width="80px">
            </el-table-column>
          </el-table>
          <search-page-pane @size-change="handleSizeChange" @current-change="handleCurrentChange" :size="size"
                            :page="page"
                            :total="total" slot="page"></search-page-pane>
        </div>
      </el-tab-pane>
      <el-tab-pane label="使用流水报表" name="useDetailReport">
        <div class="table_class">
          <search-pane slot="searchpane" @click="refetchData">
            <el-select placeholder="业务线" size="mini" v-model="listQuery.businessName">
              <el-option v-for="item in businessList"
                         :label="item.text"
                         :key="item.value"
                         :value="item.value">
              </el-option>
            </el-select>
          </search-pane>
          <table class="reportTable">
            <tr>
              <th>业务线</th>
              <th>总订单数</th>
              <th>津贴总金额</th>
              <th width="20%">津贴额度</th>
              <th width="20%">订单数</th>
            </tr>
            <tr v-for="row in reportData">
              <td class="td">{{ row.businessName }}</td>
              <td class="td">{{ row.orderNum }}</td>
              <td class="td">{{ row.money | NumFormat }} 元</td>
              <td colspan="2">
                <table class="reportInnerTable">
                  <tr v-for="item in row.items">
                    <td class="td1">{{ item.money | NumFormat }} 元</td>
                    <td class="td2">{{ item.orderNum }}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import SearchPane from '../../../components/SearchPane/index.vue';
import SearchPagePane from '../../../components/SearchPagePane/index.vue';
import {
  Pageable,
  ResponseResult,
  SubsidyActivityInfo, SubsidySerialReport, SubsidySerialReportItem, SubsidyUserDetail,
  SubsidyUserDetailSearchQuery,
} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {AxiosResponse} from 'axios';
import {
  getActivityList,
  getActivityDetail,
  deleteActivity,
  getSubsidySerialList,
  getBusinessList, getSubsidySerialReport,
} from '../../../api/subsidy';
// @ts-ignore
import qs from 'qs';
import BaseList from '../../../components/BaseList';
import BaseTableDelete from '@/components/BaseTableDelete';
import {handlerCommonError} from '../../../utils/auth-interceptor';

@Component({
  components: {ListTablePane, SearchPane, SearchPagePane},
  filters: {
    NumFormat(value: number) {
      return (value / 100).toFixed(2);
    },
  },
  mixins: [BaseList, BaseTableDelete],
})

export default class SubsidyDetailList extends Vue {

  businessList = [{value: '', text: '全部'}];
  reportData: SubsidySerialReport[] = [];
  reportDataitems: SubsidySerialReportItem[] = [];
  tabActiveName: string = 'receiveDetail';
  listQuery: SubsidyUserDetailSearchQuery = {activityId: 0, serialType: 1, page: 0, size: 50, total: 0};
  subsidyDetail: SubsidyActivityInfo = {subsidyActivityId: 0};
  subsidyContent: SubsidyUserDetail[] = [];

  fetchData() {
    const x = parseInt(this.$route.query.id, 0);
    if (x != null) {
      this.listQuery.activityId = x;
      if (this.tabActiveName === 'useDetail' || this.tabActiveName === 'useDetailReport') {
        getBusinessList(this.listQuery.activityId, this.listQuery.serialType).then((response: AxiosResponse<ResponseResult<string[]>>) => {
          const responseData = response.data.data;
          console.log(responseData);
          if (responseData && responseData.length !== 0) {
            this.businessList = [{value: '', text: '全部'}];
            for (const item of responseData) {
              if (item) {
                this.businessList.push({value: item, text: item});
              }
            }
          }
        }).catch(handlerCommonError);
      }
      if (this.tabActiveName === 'receiveDetail' || this.tabActiveName === 'useDetail') {
        getSubsidySerialList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<SubsidyUserDetail>>>) => {
          const responseData = response.data.data;
          this.subsidyContent = responseData.content;
          if (this.subsidyContent && this.subsidyContent.length > 0) {
            for (const item of this.subsidyContent) {
              if (item) {
                if (item.money) {
                  if (item.type === 2) {
                    item.money = - item.money;
                  }
                  item.money = parseFloat((item.money / 100).toFixed(2));
                  item.moneyStr = item.money + ' 元';
                }
                item.driver = 'Mac:' + item.mac + ',cudid:' + item.cudid;
                if (item.status) {
                  item.statusStr = item.status === 1 ? '已使用' : item.status === 2 ? '锁定中' : item.status === 3 ? '已作废' : '';
                }
              }
            }
          }
          if (responseData) {
            this.listQuery.page = responseData.number;
            this.listQuery.size = responseData.size;
            this.listQuery.total = responseData.totalElements;
          }
        }).catch(handlerCommonError);
      } else if (this.tabActiveName === 'useDetailReport') {
        getSubsidySerialReport(this.listQuery.activityId, this.listQuery.businessName).then((response: AxiosResponse<ResponseResult<SubsidySerialReport[]>>) => {
          const responseData = response.data.data;
          console.log(responseData);
          if (responseData && responseData.length !== 0) {
            this.reportData = [];
            for (const item of responseData) {
              if (item) {
                this.reportDataitems = [];
                if (item.items && item.items.length !== 0) {
                  for (const y of item.items) {
                    if (y) {
                      this.reportDataitems.push({orderNum: y.orderNum, money: y.money});
                    }
                  }
                }
                this.reportData.push({businessName: item.businessName, orderNum: item.orderNum, money: item.money, items: this.reportDataitems});
              }
            }
          }
        }).catch(handlerCommonError);
      }
    }
  }

  handleTabClick() {
    this.listQuery = {activityId: this.listQuery.activityId, serialType: this.listQuery.serialType, page: 0, size: 50, total: 0};
    if (this.tabActiveName === 'receiveDetail') {
      this.listQuery.serialType = 1;
    } else if (this.tabActiveName === 'useDetail') {
      this.listQuery.serialType = 2;
    } else if (this.tabActiveName === 'useDetailReport') {
      this.listQuery.serialType = 2;
    }
    this.fetchData();
  }

  created() {
    try {
      // @ts-ignore
      // debugger;
      const x = parseInt(this.$route.query.id, 0);
      if (x != null) {
        this.listQuery.activityId = x;
        getActivityDetail(x).then((response: AxiosResponse<ResponseResult<SubsidyActivityInfo>>) => {
          const responseData = response.data.data;
          console.log(responseData);
          this.subsidyDetail = responseData;
        }).catch(handlerCommonError);
        this.fetchData();
      }
    } catch (e) {
      console.log(e);
    }
  }
}
</script>

<style scoped>
  .subsidyDetailList {
    margin: 30px 50px;
  }

  .table_class {

  }

  .activityInfo span {
    color: blue;
  }

  .reportTable, .reportInnerTable {
    width: 100%;
    border-spacing: 0;
  }

  .reportTable, .reportTable th, .reportTable td, .reportInnerTable, .reportInnerTable th, .reportInnerTable td {
    padding: 0;
  }

  .reportTable, .reportTable th, .reportTable td, .reportInnerTable td{
    border: 1px solid #ebeef5;
  }

  .reportTable th {
    color: #909399;
  }

  .reportTable td, .reportInnerTable td {
    color: #606266;
  }

  .reportTable th, .reportTable .td, .reportInnerTable td {
    font-family: Helvetica Neue, Helvetica, PingFang;
    font-size: 14px;
    font-width: 700;
    text-align: left;
    padding-left: 10px;
  }

  .reportTable tr {
    height: 50px;
  }

  .reportInnerTable tr {
    height: 40px;
  }

  .reportInnerTable .td1 {
    border-left: 0;
    width: 50%;
  }

  .reportInnerTable .td2 {
    border-right: 0;
  }

  .reportInnerTable tr:first-child td{
    border-top: 0;
  }

  .reportInnerTable tr:last-child td{
    border-bottom: 0;
  }

</style>
