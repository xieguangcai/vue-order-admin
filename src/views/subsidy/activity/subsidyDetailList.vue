<template>
  <div >
    <div>津贴活动简报：</div>
    <el-form :model="subsidyDetail"
    >
      <el-form-item
        label="津贴发放总额">
        {{subsidyDetail.totalSend}}
      </el-form-item>
      <el-form-item
        label="津贴领取总额">
        {{subsidyDetail.totalReceive}}
      </el-form-item>
      <el-form-item
        label="津贴使用总额">
        {{subsidyDetail.totalUse}}
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary">津贴发放流水</el-button>
      <el-button>津贴使用流水</el-button>
    </div>
    <div v-show="showSendDetail">
      <search-pane slot="searchpane" @click="refetchData">
        <el-input v-model="listQuery.searchValue" size="mini" placeholder="活动ID/活动名称"></el-input>
      </search-pane>
      <el-table :data="subsidyContent">
        <el-table-column
          label="ID"
          prop="userDetailId"
        >
        </el-table-column>
        <el-table-column
          label="用户OpenId"
          prop="openId">
        </el-table-column>
        <el-table-column
          label="设备ID"
          prop="cudid">
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
          prop="money">
        </el-table-column>
        <el-table-column
          label="获得时间"
          prop="createTime">
        </el-table-column>
      </el-table>
    </div>
    <div v-show="!showSendDetail">
      <el-button>导出</el-button>
      <el-date-picker type="date" placeholder="选择日期" v-model="listQuery.createTime"></el-date-picker>
      <el-input placeholder="请填写业务线"></el-input>
      <search-pane slot="searchpane" @click="refetchData">
        <el-input v-model="listQuery.searchValue" size="mini" placeholder="活动ID/活动名称"></el-input>
      </search-pane>
      <el-table :data="subsidyContent">
        <el-table-column
          label="ID"
          prop="userDetailId"
        >
        </el-table-column>
        <el-table-column
          label="用户OpenId"
          prop="openId">
        </el-table-column>
        <el-table-column
          label="设备ID"
          prop="cudid">
        </el-table-column>
        <el-table-column
          label="用户昵称"
          prop="nickName">
        </el-table-column>
        <el-table-column
          label="业务线"
          prop="businessName">
        </el-table-column>
        <el-table-column
          label="订单号"
          prop="orderNo">
        </el-table-column>
        <el-table-column
          label="津贴使用额度"
          prop="money">
        </el-table-column>
        <el-table-column
          label="订单记账时间"
          prop="createTime">
        </el-table-column>
      </el-table>
      <search-page-pane @size-change="handleSizeChange" @current-change="handleCurrentChange" :size="size" :page="page"
                        :total="total" slot="page"></search-page-pane>
    </div>
  </div>
</template>


<script lang="ts">
  import 'babel-polyfill'
import {Component, Vue, Watch} from 'vue-property-decorator';
import SearchPane from '../../../components/SearchPane/index.vue';
import SearchPagePane from '../../../components/SearchPagePane/index.vue';
  import {
    ActivityListQuery,
    Pageable,
    ResponseResult,
    SubsidyActivityInfo, SubsidySerialInfoModel, SubsidyUserDetail,
    SubsidyUserDetailSearchQuery
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
  filters: {
  },
  mixins: [BaseList, BaseTableDelete],
})

export default class SubsidyDetailList extends Vue {

  showSendDetail: boolean = true;
  listQuery: SubsidyUserDetailSearchQuery = {
    activityId: 0,
    serialType: 1, page: 0, size: 50, total: 0
  };
  subsidyDetail: SubsidySerialInfoModel = {
    totalSend: 0, totalReceive: 0, totalUse: 0
  };
  subsidyContent: SubsidyUserDetail[] = [];

  created() {
    try {
      // @ts-ignore
      debugger;
      const x = parseInt(this.$route.query.id);
      if (x != null) {
        this.listQuery.activityId = x;
        getSubsidySerialList(this.listQuery).then((response: AxiosResponse<ResponseResult<SubsidySerialInfoModel>>) => {
          const responseData = response.data.data;
          if (responseData == null){
            alert("数据为空");
          }else {
          this.subsidyDetail = responseData;
          this.subsidyContent = responseData.subsidySerials.content;
          this.listQuery.page = responseData.subsidySerials.number;
          this.listQuery.size = responseData.subsidySerials.size;
          this.listQuery.total = responseData.subsidySerials.totalElements;
          console.log(responseData);
          }
        }).catch(handlerCommonError);
      }
    } catch (e){
       console.log(e);
    }
  }
}
</script>
