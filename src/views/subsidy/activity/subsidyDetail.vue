<template>
  <div>
    <div>津贴活动简报：</div>
    <el-table
      :data="data">
      <el-table-column
        label="津贴发放总额"
       :prop="data.totalSend">
      </el-table-column>
      <el-table-column
        label="津贴领取总额"
        :prop="data.totalReceive">
      </el-table-column>
      <el-table-column
        label="津贴使用总额"
        :prop="data.totalUse">
      </el-table-column>
    </el-table>
    <div>
      <el-button type="primary">津贴发放流水</el-button>
      <el-button>津贴使用流水</el-button>
    </div>
    <div v-if="showSendDetail">
      <search-pane slot="searchpane" @click="refetchData">
        <el-input v-model="listQuery.searchValue" size="mini" placeholder="活动ID/活动名称"></el-input>
      </search-pane>
      <el-table :data="data.subsidySerials" >
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
    <div v-if="!showSendDetail">
      <el-button>导出</el-button>
      <el-date-picker type="date" placeholder="选择日期" v-model="listQuery.createTime"></el-date-picker>
      <el-input placeholder="请填写业务线"></el-input>
      <search-pane slot="searchpane" @click="refetchData">
        <el-input v-model="listQuery.searchValue" size="mini" placeholder="活动ID/活动名称"></el-input>
      </search-pane>
      <el-table :data="data.subsidySerials" >
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
    </div>

  </div>
</template>

<script type="ts">
  import SearchPane from '../../../components/SearchPane/index.vue';
  import SearchPagePane from '../../../components/SearchPagePane/index.vue';
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
  import {getSubsidySerialList} from '../../../api/subsidy';
  import {
    SubsidySerialInfoModel,
    ResponseResult,
    SubsidyUserDetailSearchQuery,
    SubsidyUserDetail
  } from '../../../types';
  import {AxiosResponse} from 'axios';

  @Component({
    name: 'subsidyDetail',
    components: {},
  })

  export default class subsidyDetail extends Vue {
    showSendDetail: boolean = true;

    // info: SubsidyActivityInfo = {subsidyActivityId: 1,
    //   subsidyInfoList:[]
    // };
    listQuery: SubsidyUserDetailSearchQuery = {activityId: 0, serialType:1, page: 0, size: 50, total: 0};
    data: SubsidySerialInfoModel = {totalSend: 0, totalReceive: 0, totalUse: 0,
    };

    editSubsidy(index, row) {
      const subsidyId = row.subsidyTypeId;
      this.$message("点击修改");
    };

    created() {
      try {
        // @ts-ignore
        debugger
        const x = parseInt(this.$route.query.id);
        if (x != null) {
          this.listQuery.activityId = x;
          getSubsidySerialList(this.listQuery).then((response: AxiosResponse<ResponseResult<SubsidySerialInfoModel>>) =>{
            const responseData = response.data;
            console.log(responseData);
           // this.data = responseData;
          })
        }
      } catch (e) {
      }
    }

  }
</script>

<style scoped>

</style>
