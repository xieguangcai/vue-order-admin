<template>
  <div class="addActiveClass">
    <div class="title" >活动信息</div>
     <el-form :model="SubsidyActivityInfo" :rules="rules" ref="SubsidyActivityInfo" label-width="120px" >
       <el-form-item label="活动标题" prop="name">
         <el-input v-model="SubsidyActivityInfo.name"></el-input>
       </el-form-item>
       <el-form-item label="活动时间" required>
         <el-col :span="11">
           <el-form-item prop="validStartTime">
             <el-date-picker type="date" placeholder="选择活动起始日期" v-model="SubsidyActivityInfo.validStartTime" style="width: 100%;"></el-date-picker>
           </el-form-item>
         </el-col>
         <el-col class="line" :span="2">~</el-col>
         <el-col :span="11">
           <el-form-item prop="validEndTime">
             <el-date-picker type="date" placeholder="选择活动结束日期" v-model="SubsidyActivityInfo.validEndTime" style="width: 100%;"></el-date-picker>
           </el-form-item>
         </el-col>
       </el-form-item>
       <el-form-item label="津贴可用时间" required>
         <el-col :span="11">
           <el-form-item prop="useStartTime">
             <el-date-picker type="date" placeholder="选择津贴起始使用日期" v-model="SubsidyActivityInfo.useStartTime" style="width: 100%;"></el-date-picker>
           </el-form-item>
         </el-col>
         <el-col class="line" :span="2">~</el-col>
         <el-col :span="11">
           <el-form-item prop="useEndTime">
             <el-date-picker type="date" placeholder="选择津贴结束使用日期" v-model="SubsidyActivityInfo.useEndTime" style="width: 100%;"></el-date-picker>
           </el-form-item>
         </el-col>
       </el-form-item>
       <el-form-item label="活动说明" prop="memo">
         <el-input type="textarea" v-model="SubsidyActivityInfo.memo"></el-input>
       </el-form-item>
       <div class="title" >津贴管理</div>
         <el-form-item
           v-for="(subsidy, index) in SubsidyActivityInfo.subsidyInfos"
           :label="'津贴' + index"
           :key="subsidy.key"
           :rules="{
              // required: true, message: '不能为空', trigger: 'blur'
            }"
          >
             <el-col :span="8">
               <el-form-item prop="name">
                 <el-input placeholder="津贴名称(限8个字)" v-model="subsidy.name" style="width: 100%;"></el-input>
               </el-form-item>
             </el-col>
           <el-col :span="1">&nbsp;</el-col>
           <el-col :span="4">
             <el-form-item prop="money">
               <el-input placeholder="" v-model="subsidy.money" style="width: 100%;"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="2">元</el-col>
             <el-col :span="5">
               <el-form-item prop="count">
                 <el-input placeholder="" v-model="subsidy.count" style="width: 100%;"></el-input>
               </el-form-item>
             </el-col>
             <el-col class="line" :span="2">个</el-col>
           <el-col :span="2">
             <el-button @click.prevent="removeSubsidy(subsidy)">删除</el-button>
           </el-col>
          </el-form-item>
       <el-button class="addBtn" @click="addSubsidy">+ 添加</el-button>
       <el-form-item style="margin-top: 30px">
         <el-button type="primary" @click="submitForm('SubsidyActivityInfo')">保存</el-button>
         <el-button @click="$router.push({path: 'subsidy-activity-list'})">取消</el-button>
       </el-form-item>
     </el-form>
  </div>
</template>

<script>
    import {addActivity} from "../../../api/subsidy";

    export default {
      name: "addActive",
      data() {
        return {
          SubsidyActivityInfo: {
            name: '',
            validStartTime: '',
            validEndTime: '',
            useStartTime: '',
            useEndTime: '',
            memo: '',
            subsidyInfos: [{
              name:  '',
              money: '',
              count: ''
            }]
          },
          rules: {
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
          }
        };
      },
      methods: {
        addSubsidy () {
          this.SubsidyActivityInfo.subsidyInfos.push({
            name:  '',
            money: '',
            count: ''
          });
        },
        removeSubsidy(item) {
          var index = this.SubsidyActivityInfo.subsidyInfos.indexOf(item)
          if (index !== -1){
            this.SubsidyActivityInfo.subsidyInfos.splice(index,1)
          }
        },
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              addActivity(this.SubsidyActivityInfo);
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
      }
    }
</script>

<style scoped>
   .addActiveClass{
     margin: 30px 50px;
     width: 40vw;
   }
   .title{
      margin-bottom: 20px;
   }
  .line{
    text-align: center;
  }
  .addBtn{
    width: 40vw;
    border: 1px dashed #ccc;
    text-align: center;
  }
</style>
