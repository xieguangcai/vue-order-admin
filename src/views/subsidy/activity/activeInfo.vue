<template>
  <div class="activeInfo" :model="info">
    <div class="title" >活动信息</div>
    <el-form :label-position="labelPosition" label-width="120px">
      <el-form-item label="活动ID：">
        {{info.subsidyCode}}
      </el-form-item>
      <el-form-item label="活动标题：">
        {{info.name}}
      </el-form-item>
      <el-form-item label="活动时间：">
        {{info.validStartTime}} ~ {{info.validEndTime}}
      </el-form-item>
      <el-form-item label="津贴可用时间：">
        {{info.useStartTime}} ~ {{info.useEndTime}}
      </el-form-item>
      <el-form-item label="活动说明：">
        {{info.memo}}
      </el-form-item>
    </el-form>
    <div class="title" >津贴管理</div>
    <el-table label-width="120px" :data="info.subsidyInfoList">
      <el-table-column
        label="津贴ID"
        prop="subsidyTypeCode">
      </el-table-column>
      <el-table-column
        label="津贴名称"
        prop="typeName">
      </el-table-column>
      <el-table-column
        label="津贴金额"
        prop="money">
      </el-table-column>
      <el-table-column
        label="发放数量"
        prop="sendNum">
      </el-table-column>
      <el-table-column
        label="已领取数量"
        prop="sendNum">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button @click="editSubsidy(scope.$index,scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="footBtn">
      <el-button  @click="$router.push({path: 'addSubsidy', query: {id: '' + info.subsidyActivityId}})">新增津贴</el-button>
      <el-button type="primary" @click="$router.push({path: 'subsidy-activity-list'})">返回</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import {getActivityDetail} from '../../../api/subsidy';
import {SubsidyActivityInfo, ResponseResult, SubsidyType} from '../../../types';
import {AxiosResponse} from 'axios';
@Component({
  name: 'ActivityInfoDetail',
  components: {},
})
export default class ActivityInfoDetail extends Vue {
  labelPosition: string = 'right';

  // info: SubsidyActivityInfo = {subsidyActivityId: 1,
  //   subsidyInfoList:[]
  // };
  info: SubsidyActivityInfo = {subsidyActivityId: 0,
    subsidyInfoList: [],
  };

  editSubsidy(index: number, row: SubsidyType) {
    const subsidyId = row.subsidyTypeId;
    this.$message('点击修改');
  }

  created() {
    try {
      // @ts-ignore
      debugger;
      const x = parseInt(this.$route.query.id);
      if (x != null) {
        this.info.subsidyActivityId = x;
        getActivityDetail(x).then((response: AxiosResponse<ResponseResult<SubsidyActivityInfo>>) => {
          const responseData = response.data.data;
          console.log(responseData);
          this.info = responseData;
        });
      }
    } catch (e) {
    }
  }

  // realFetchData() {
  //   const id = this.$route.query.id;
  //   this.info.subsidyActivityId = id;
  //   return getActivityDetail(id).then((response: AxiosResponse<ResponseResult<SubsidyActivityInfo>>) => {
  //     const responseData = response.data.data;
  //     console.log(responseData);
  //     this.info = responseData;
  //
  //   })
  // }

}
</script>

<style scoped>
  .activeInfo{
    margin: 30px 50px;
    width: 50vw;
  }
  .title{
    margin-bottom: 20px;
  }
  .footBtn{
    margin: 30px;
    text-align: center;
  }

</style>
