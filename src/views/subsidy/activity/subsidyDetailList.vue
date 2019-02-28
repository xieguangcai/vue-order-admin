<template>
  <div class="subsidyDetailList">
    <div>津贴活动简报：</div>
    <el-form
      :model="subsidyDetail"
      :inline="true"
    >
      <el-form-item
        label="津贴发放总额">
        {{subsidyDetail.sendMoney}}
      </el-form-item>
      <el-form-item
        label="津贴领取总额">
        {{subsidyDetail.receiveMoney}}
      </el-form-item>
      <el-form-item
        label="津贴使用总额">
        {{subsidyDetail.useMoney}}
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
            <el-input placeholder="业务线" size="mini" v-model="listQuery.businessName"></el-input>
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
  SubsidyActivityInfo, SubsidyUserDetail,
  SubsidyUserDetailSearchQuery,
} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {AxiosResponse} from 'axios';
import {getActivityList, getActivityDetail, deleteActivity, getSubsidySerialList} from '../../../api/subsidy';
// @ts-ignore
import qs from 'qs';
import BaseList from '../../../components/BaseList';
import BaseTableDelete from '@/components/BaseTableDelete';
import {handlerCommonError} from '../../../utils/auth-interceptor';

@Component({
  components: {ListTablePane, SearchPane, SearchPagePane},
  filters: {},
  mixins: [BaseList, BaseTableDelete],
})

export default class SubsidyDetailList extends Vue {

  tabActiveName: string = 'receiveDetail';
  listQuery: SubsidyUserDetailSearchQuery = {
    activityId: 0,
    serialType: 1, page: 0, size: 50, total: 0,
  };
  subsidyDetail: SubsidyActivityInfo = {
    subsidyActivityId: 0,
  };
  subsidyContent: SubsidyUserDetail[] = [];

  fetchData() {
    const x = parseInt(this.$route.query.id, 0);
    if (x != null) {
      this.listQuery.activityId = x;
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
                item.statusStr = item.status === 1 ? "已使用" : item.status === 2 ? "锁定中" : item.status === 3 ? "已作废" : "";
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
    }
  }

  handleTabClick() {
    if (this.tabActiveName === 'receiveDetail') {
      this.listQuery.serialType = 1;
    } else if (this.tabActiveName === 'useDetail') {
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
          this.fetchData();
        }).catch(handlerCommonError);
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
</style>
