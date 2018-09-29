<template>
    <el-form :model="accountInfo" ref="editForm" :rules="rules" :size="formSize">
      <el-form-item label="部门" :label-width="formLabelWidth" prop="department">
        <el-input v-model="accountInfo.department"></el-input>
      </el-form-item>
      <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName">
        <el-input v-model="accountInfo.userName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="登录账号" :label-width="formLabelWidth" prop="nickName">
        <el-input v-model="accountInfo.nickName"></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input type="password" v-model="accountInfo.pwd" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Email" :label-width="formLabelWidth" prop="email">
        <el-input v-model="accountInfo.email" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="账号状态" :label-width="formLabelWidth">
        <el-select v-model="accountInfo.accountStatus" placeholder="请选择状态">
          <el-option v-for="item in accountStatus" :label="item.label" :value="item.value" :key="item.value"/>
        </el-select>
      </el-form-item>
      {{accountInfo}}
    </el-form>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
import {AccountInfo} from '../../types/index';
import {getAccountInfo, saveUser} from '../../api/account';
import {UserModule} from '../../store/modules/user';
import {newUser} from '../../api/account';
import EditFormPane from '../../components/EditFormPane/index.vue';
import BaseEdit from '../../components/BaseEdit';
import {AppModule} from '../../store/modules/app';

@Component({
  name: 'AccountEdit',
  components: {EditFormPane},
})
export default class AccountEdit extends BaseEdit {

  accountInfo: AccountInfo = {accountStatus: 1};

  @Prop({type: Number, default: 0})
  accountId: number = 0;

  formLabelWidth = '120px';
  rules = {
    userName: [{required: true, message: '请输入用户名', trigger: 'blur'}],
    nickName: [{required: true, message: '请输入登录账号', trigger: 'blur'}, {
      min: 3,
      max: 50,
      message: '长度在 3 到 50 个字符',
      trigger: 'blur',
    }],
    email: [{required: true, message: '请输入email', trigger: 'blur'}, {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change'],
    }],
    department: [{required: true, message: '请输入部门', trigger: 'blur'}],
  };

  get formSize() {
    return AppModule.formSize;
  }

  get accountStatus() {
    return UserModule.accountStatus;
  }

  @Watch('accountId', {immediate: true})
  handleAccountInfoChange(newVal: number | undefined, oldVal: number| undefined) {
    if ( null == newVal || newVal === 0) {
      this.accountInfo = {accountStatus: 1};
    } else {
      getAccountInfo(this.accountId).then((resolve) => {
        console.log()
        this.accountInfo = resolve.data.data;
      });
    }
  }

  @Watch('accountInfo', {immediate: true})
  handleInternalAccountInfoChange(newVal: AccountInfo, oldVal?: AccountInfo) {
    console.log(newVal);
    if(newVal.accountId != this.accountInfo.accountId){
      this.accountIdChange(newVal.accountId, this.accountInfo.accountId);
    }

  }

  @Emit('update:accountId')
  accountIdChange(accountId: number, accountId2: number) {
  }

  async saveFormData() {
    if (this.accountInfo.accountId != null) {
      await saveUser(this.accountInfo);
    } else {
      await newUser(this.accountInfo);
    }
  }

  // saveForm(cb: () => {}) {
  //   const form = this.$refs.editForm as ElForm;
  //   form.validate(async (valid) => {
  //     if (!valid) {
  //       return false;
  //     } else {
  //       if (this.accountInfo.accountId != null) {
  //         await saveUser(this.accountInfo);
  //       } else {
  //         await newUser(this.accountInfo);
  //       }
  //       this.$message.success('保存成功');
  //       form.resetFields();
  //       cb();
  //     }
  //   });
  // }
}
</script>

