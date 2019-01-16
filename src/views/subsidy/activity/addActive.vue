<template>
  <div class="addActiveClass">
    <div class="title" >活动信息</div>
     <el-form :model="data" ref="AddActivityInfo" label-width="120px" >
       <el-form-item label="活动标题" prop="name" required>
         <el-input v-model="data.name" placeholder="活动标题最多12个字符"></el-input>
       </el-form-item>
       <el-form-item label="活动时间" required style="margin-bottom: 0px;">
         <el-col :span="11">
           <el-form-item prop="validStartTime">
             <el-date-picker type="date" placeholder="选择活动起始日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="data.validStartTime" style="width: 100%;"></el-date-picker>
           </el-form-item>
         </el-col>
         <el-col class="line" :span="2">~</el-col>
         <el-col :span="11">
           <el-form-item prop="validEndTime">
             <el-date-picker type="date" placeholder="选择活动结束日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="data.validEndTime" style="width: 100%;"></el-date-picker>
           </el-form-item>
         </el-col>
       </el-form-item>
       <el-form-item label="" prop="" style="margin-bottom: 0px;">
         <el-col style="color: #d3dce6;">
           注：从起始日期0时到结束日期24时
         </el-col>
       </el-form-item>
       <el-form-item label="津贴可用时间" required style="margin-bottom: 0px;">
         <el-col :span="11">
           <el-form-item prop="useStartTime">
             <el-date-picker type="date" placeholder="选择津贴起始使用日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="data.useStartTime" style="width: 100%;"></el-date-picker>
           </el-form-item>
         </el-col>
         <el-col class="line" :span="2">~</el-col>
         <el-col :span="11">
           <el-form-item prop="useEndTime">
             <el-date-picker type="date" placeholder="选择津贴结束使用日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="data.useEndTime" style="width: 100%;"></el-date-picker>
           </el-form-item>
         </el-col>
       </el-form-item>
       <el-form-item label="" prop="" style="margin-bottom: 0px;">
         <el-col style="color: #d3dce6;">
           注：从起始日期0时到结束日期24时；且不早于活动开始日期、不晚于活动结束日期
         </el-col>
       </el-form-item>
       <el-form-item label="活动说明" prop="memo">
         <el-input type="textarea" v-model="data.memo" placeholder="活动说明最多50个字符"></el-input>
       </el-form-item>
       <div class="title" >津贴管理</div>
         <el-form-item
           v-for="(subsidy, index) in data.subsidyInfoList"
           :label="'津贴' + index"
           :key="subsidy.key"
           :rules="{
              // required: true, message: '不能为空', trigger: 'blur'
            }"
          >
             <el-col :span="6">
               <el-form-item prop="typeName">
                 <el-input placeholder="津贴名称(限8个字)" v-model="subsidy.typeName" style="width: 100%;"></el-input>
               </el-form-item>
             </el-col>
           <el-col :span="1">&nbsp;</el-col>
           <el-col :span="6">
             <el-form-item prop="money">
               <el-input-number placeholder="" v-model="subsidy.money" :min="0" :step="0.01" style="width: 100%;"></el-input-number>
             </el-form-item>
           </el-col>
           <el-col :span="1">元</el-col>
             <el-col :span="6">
               <el-form-item prop="sendNum">
                 <el-input-number placeholder="" v-model="subsidy.sendNum" :min="0" :step="1" style="width: 100%;"></el-input-number>
               </el-form-item>
             </el-col>
             <el-col class="line" :span="1">个</el-col>
           <el-col :span="2">
             <el-button @click.prevent="removeSubsidy(subsidy)">删除</el-button>
           </el-col>
          </el-form-item>
       <el-button class="addBtn" @click="addSubsidy">+ 添加</el-button>
       <el-form-item style="margin-top: 30px">
         <el-button type="primary" @click="submitForm('SubsidyActivityInfo')" v-if="checkUserRole('SUBSIDY_ROLE_EDIT')">保存</el-button>
         <el-button @click="$router.push({path: 'subsidy-activity-list'})">取消</el-button>
       </el-form-item>
     </el-form>
  </div>
</template>

<script lang="ts">
import {addActivity} from '../../../api/subsidy';
import {Component, Vue, Watch} from 'vue-property-decorator';
import {ResponseResult, SubsidyActivityInfo, SubsidyType} from '../../../types';
import {AxiosResponse} from 'axios';
// @ts-ignore
import qs from 'qs';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import RightComponent from "@/components/RightComponent";

@Component({
  components: {},
  name: 'AddActivityInfo',
  filters: {},
  mixins: [RightComponent],
})
export default class AddActivityInfo extends Vue {
  name: string = 'addActive';
  data: SubsidyActivityInfo = {subsidyActivityId: 0, subsidyInfoList: []};
 /* rules: {
    name: [
      { required: true, message: '请输入活动名称', trigger: 'blur' },
      { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
      ],
    date1: [
      { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
      ],
    date2: [
      { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
      ],
    desc: [
      { message: '请填写活动形式', trigger: 'blur' }
      ]
  };*/

  addSubsidy() {
    if (this.data.subsidyInfoList) {
      this.data.subsidyInfoList.push({subsidyTypeId:  -1});
    }
  }

  removeSubsidy(item: SubsidyType) {
    if (this.data.subsidyInfoList) {
      const index = this.data.subsidyInfoList.indexOf(item);
      if (index !== -1) {
        this.data.subsidyInfoList.splice(index, 1);
      }
    }
  }

  submitForm(formName: SubsidyActivityInfo) {
  /* this.$refs[formName].validate((valid) => {
      if (valid) {*/
        const subsidyList = this.data.subsidyInfoList;
        if (subsidyList && subsidyList.length > 0) {
          for (const subsidy of subsidyList) {
            if (subsidy && subsidy.money) {
              subsidy.money = subsidy.money * 100;
            }
          }
        }
        this.data.subsidyInfoList = subsidyList;
        addActivity(this.data).then((response: AxiosResponse<ResponseResult<boolean>>) => {
          if (response.data.success && response.data.data) {
            this.$router.push({path: 'subsidy-activity-list'});
          }
        }).catch(handlerCommonError);
      /*} else {
        console.log('error submit!!');
        return false;
      }
    });*/
  }

}
</script>

<style scoped>
   .addActiveClass{
     margin: 30px 50px;
     width: 55vw;
   }
   .title{
      margin-bottom: 20px;
   }
  .line{
    text-align: center;
  }
  .addBtn{
    width: 55vw;
    border: 1px dashed #ccc;
    text-align: center;
  }
</style>
