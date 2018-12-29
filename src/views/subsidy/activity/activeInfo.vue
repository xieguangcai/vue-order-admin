<template>
  <div class="activeInfo">
    <div class="title" >活动信息</div>
    <el-form :label-position="labelPosition" label-width="120px" :model="SubsidyActivityInfo">
      <el-form-item label="活动ID：">
        {{SubsidyActivityInfo.subsidyActivityId}}
      </el-form-item>
      <el-form-item label="活动标题：">
        {{SubsidyActivityInfo.name}}
      </el-form-item>
      <el-form-item label="活动时间：">
        {{SubsidyActivityInfo.validStartTime}} ~ {{SubsidyActivityInfo.validEndTime}}
      </el-form-item>
      <el-form-item label="津贴可用时间：">
        {{SubsidyActivityInfo.useStartTime}} ~ {{SubsidyActivityInfo.useEndTime}}
      </el-form-item>
      <el-form-item label="活动说明：">
        {{SubsidyActivityInfo.memo}}
      </el-form-item>
    </el-form>
    <div class="title" >津贴管理</div>
    <el-table label-width="120px" :model="SubsidyType">
      <el-table-column
        label="津贴ID"
        prop="subsidyTypeId">
      </el-table-column>
      <el-table-column
        label="津贴名称"
        prop="name">
      </el-table-column>
      <el-table-column>
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
          <el-button @click="delSubsidy(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="footBtn">
      <el-button  @click="$router.push({path: 'addSubsidy'})">新增津贴</el-button>
      <el-button type="primary" @click="$router.push({path: 'subsidy-activity-list'})">返回</el-button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "activeInfo",
        data(){
           return{
             SubsidyActivityInfo: [],
             SubsidyType: []

           }
        },
        methods:{
          delSubsidy(index,row) {
            this.$message("点击删除")
          }

        },
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
