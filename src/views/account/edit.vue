<template>
  <div class="cc-edit-form">
    <el-form :model="accountInfo" ref="editForm" :rules="rules">
      <el-form-item label="部门" :label-width="formLabelWidth" prop="department">
        <el-input v-model="accountInfo.department"></el-input>
      </el-form-item>
      <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName">
        <el-input v-model="accountInfo.userName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="登录账号" :label-width="formLabelWidth" prop="nickName">
        <el-input v-model="accountInfo.nickName" ></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input type="password" v-model="accountInfo.pwd" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Email" :label-width="formLabelWidth" prop="email">
        <el-input v-model="accountInfo.email" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="账号状态" :label-width="formLabelWidth">
        <el-select v-model="accountInfo.accountStatus" placeholder="请选择状态">
          <el-option v-for="item in getAccountStatus()" :label="item.label" :value="item.value" :key="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    {{accountInfo}}
    <div class="cc-edit-button">
        <el-button type="primary" icon="el-icon-edit" @click="save">保存</el-button>
        <el-button type="info" icon="el-icon-close" @click="cancel">取消</el-button>
        <el-button type="success" icon="el-icon-edit" @click="saveThenNew">保存并新增</el-button>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {AccountInfo} from "../../api";
  import {saveUser} from "../../api/account";
  import {UserModule } from '../../store/modules/user';
  import {ElForm} from "element-ui/types/form";
  import {newUser} from "../../api/account";

  @Component({
    name: 'AccountEdit'
  })
  export default class AccountEdit extends Vue {
    @Prop({default:{accountStatus:1}})
    accountInfo: AccountInfo;
    formLabelWidth = '120px';
    rules = {
      userName:[{ required: true, message: '请输入用户名', trigger: 'blur'}],
      nickName:[{ required: true, message: '请输入登录账号', trigger: 'blur'},{ min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }],
      email:[{ required: true, message: '请输入email', trigger: 'blur'}, { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
      department:[{ required: true, message: '请输入部门', trigger: 'blur'}],
    };

    getAccountStatus(){
      return UserModule.accountStatus;
    }

    saveThenNew(){
      this.saveForm(()=> this.$emit('save-success-then-new'));
    }

    cancel(){
      const form = this.$refs['editForm'] as ElForm;
      form.resetFields();
      this.$emit('cancel');
    }

    save(){
      this.saveForm(()=> this.$emit('save-success'));
    }

    saveForm(cb:()=>{}){
      const form = this.$refs['editForm'] as ElForm;
      form.validate(async (valid)=>{
        if(!valid){
          return false;
        }else{
          if(this.accountInfo.accountId !=null){
            await saveUser(this.accountInfo);
          }else{
            await newUser(this.accountInfo);
          }
          this.$message.success('保存成功');
          form.resetFields();
          cb();
        }
      });
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .cc-edit-button{
    margin-left:120px;
  }
  .cc-edit-form{
    margin:0px 30px 0px 0px;
  }
</style>
