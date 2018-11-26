<template>
  <div class="cc-form">
    <h3 class="cc-form-title">查询用户短信验证码信息</h3>
    <el-form ref="editForm" :model="editFrom"  :rules="rules">
      <el-form-item label="请输入查询手机号" label-width="140px"  prop="phoneNo">
        <el-input v-model="editFrom.phoneNo" ></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="search()">查询</el-button>
    <el-button type="danger"  @click="delMobileCheckNum()">清除发送限制</el-button>
    <div style="padding-top:20px;">
      {{message}}
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
  import {
    RedisValueInfo,
    ResponseResult,
    SysAccount, SysUser,
    UserInfoFull,
  } from '../../../types/index';
  import {delMobileCheck, getMoblieCode, getSysAccountInfoDetail} from '../../../api/passport';
  import {getUserInfoFullByOpenId} from '../../../api/pay';
  import {handlerCommonError} from '../../../utils/auth-interceptor';
  import {ElForm} from "element-ui/types/form";
  import {validPhoneNoRule} from "../../../utils/validate";
  import {AxiosResponse} from "axios";

  @Component({
    name: 'UserIndex',
    components: {},
  })
  export default class UserIndex extends Vue {
    editFrom = {phoneNo:''};
    message: string = '';

    rules = {
      phoneNo: [{required: true, message: '请输入手机号', trigger: 'blur'}, {
        validator: validPhoneNoRule,
        trigger: 'blur',
      }]
    };

    getEditForm(): ElForm {
      return this.$refs.editForm as ElForm;
    }

    delMobileCheckNum ():void {
        this.getEditForm().validate(async (valid) => {
        if (valid) {
          await delMobileCheck(this.editFrom.phoneNo).then((response: AxiosResponse<ResponseResult<String>>) => {
            this.message = '成功清除短信限制';
          });
        } else {
          return false;
        }
      });
    }

    search():void{
      this.getEditForm().validate(async (valid) => {
        if (valid) {
          await getMoblieCode(this.editFrom.phoneNo).then((response: AxiosResponse<ResponseResult<RedisValueInfo>>) => {
            this.message = '验证码为：' + response.data.data.value + '，' + response.data.data.ttlTime + ' 秒后过期';
          }).catch((response:any)=>{
            this.message = '没有查找到验证码';
          });
        } else {
          return false;
        }
      });
    }
  }
</script>


<style scoped>

</style>

