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
    <el-tabs v-model="tabActiveName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="津贴发放流水" name="sendDetail">
        <div class="table_class">
          <search-pane slot="searchpane" @click="refetchData">
            <el-input v-model="listQuery.searchValue" size="mini" placeholder="openID/mac/激活ID"></el-input>
          </search-pane>
          <el-table :data="subsidyContent">
            <el-table-column
              label="ID"
              prop="userDetailId"
              width="50px"
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
          <search-page-pane @size-change="handleSizeChange" @current-change="handleCurrentChange" :size="size" :page="page"
                            :total="total" slot="page"></search-page-pane>
        </div>
      </el-tab-pane>
      <el-tab-pane label="津贴使用流水" name="useDetail">
        <div class="table_class">
          <!--<el-button>导出</el-button>-->
          <el-date-picker type="date" placeholder="选择日期" v-model="listQuery.createTime"></el-date-picker>
          <el-input placeholder="请填写业务线" class="inputClass"></el-input>
          <search-pane slot="searchpane" @click="refetchData">
            <el-input v-model="listQuery.searchValue" size="mini" placeholder="openID/mac/激活ID"></el-input>
          </search-pane>
          <el-table :data="subsidyContent">
            <el-table-column
              label="ID"
              prop="userDetailId"
              width="50px"
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

    tabActiveName: string = 'sendDetail';
    listQuery: SubsidyUserDetailSearchQuery = {
      activityId: 0,
      serialType: 1, page: 0, size: 50, total: 0,
    };
    subsidyDetail: SubsidyActivityInfo = {
      subsidyActivityId: 0
    };
    subsidyContent: SubsidyUserDetail[] = [];

    fetchData(){
      const x = parseInt(this.$route.query.id, 0);
      if( x!= null){
      this.listQuery.activityId = x;
      getSubsidySerialList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<SubsidyUserDetail>>>) => {
        const responseData = response.data.data;
        this.subsidyContent = responseData.content;
        if (responseData) {
          this.listQuery.page = responseData.number;
          this.listQuery.size = responseData.size;
          this.listQuery.total = responseData.totalElements;
        }
      }).catch(handlerCommonError);
      }
    }

    handleTabClick(tab,event) {
      console.log(tab, event);
      console.log(tab.name);
      if(tab.name == "sendDetail" ){
        this.listQuery.serialType = 1;
      }else if(tab.name == "useDetail"){
        this.listQuery.serialType =2;
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
  .subsidyDetailList{
    margin: 30px 50px;
  }
  .table_class{

  }
  .inputClass{
    width: 250px;
    margin: 0 15px;
  }
</style>
