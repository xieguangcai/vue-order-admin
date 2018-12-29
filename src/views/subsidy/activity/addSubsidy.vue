<template>
    <div class="addSubsidy">
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
        <div class="border"></div>
      <el-form :label-position="labelPosition" :rules="rules" label-width="120px" :model="SubsidyType">
        <el-form-item label="津贴名称：" prop="name">
          <el-col :span="11">
            <el-input v-model="SubsidyType.name" placeholder="津贴名称(不超过8个字)"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="津贴金额：" prop="money">
          <el-col :span="5">
            <el-input v-model="SubsidyType.money"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="发放数量：" prop="sendNum">
          <el-col :span="5">
            <el-input v-model="SubsidyType.sendNum"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item style="margin-top: 30px">
          <el-button @click="submitForm('SubsidyActivityInfo')">保存并新增</el-button>
          <el-button type="primary" @click="submitForm('SubsidyActivityInfo')">保存</el-button>
          <el-button @click="$router.push({path: 'subsidy-activity-list'})">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
    export default {
        name: "addSubsidy",
      data() {
          return {
            labelPosition: 'right',
            SubsidyActivityInfo: [],
            SubsidyType: {
              name: '',
              money: '',
              sendNum: ''
            },
            rules: {
              name: [
                { required: true, message: '请输入活动名称', trigger: 'blur' },
                { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
              ]
            }
          }

      }
    }
</script>

<style scoped>
  .border{
    width: 40vw;
    height: 1px;
    border-bottom: 1px dashed #000;
    margin-bottom: 30px;
  }
  .addSubsidy{
    margin: 30px 50px;
    width: 40vw;
  }

</style>
