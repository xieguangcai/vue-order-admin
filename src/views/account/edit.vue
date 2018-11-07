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
          <el-option v-for="item in recordeStatus" :label="item.label" :value="item.value" :key="item.value"/>
        </el-select>
      </el-form-item>
      <div class="cc-edit-button">
          <el-button type="primary" icon="el-icon-edit" @click="save">保存</el-button>
          <el-button type="info" icon="el-icon-close" @click="cancel">取消</el-button>
          <el-button type="success" icon="el-icon-edit" @click="saveThenNew">保存并新增</el-button>
      </div>
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
import {AxiosPromise} from 'axios';
import {handlerCommonError} from "../../utils/auth-interceptor";

@Component({
  name: 'AccountEdit',
  components: {EditFormPane},
  mixins: [ BaseEdit ],
})
export default class AccountEdit extends Vue {

  accountInfo: AccountInfo = {accountStatus: 1};

  @Prop({type: Number, default: 0})
  accountId: number = 0;

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


  @Watch('accountId', {immediate: true})
  handleAccountInfoChange(newVal: number | undefined, oldVal: number| undefined) {
    if ( null == newVal || newVal === 0) {
      this.accountInfo = {accountStatus: 1};
    } else {
      getAccountInfo(this.accountId).then((resolve) => {
        this.accountInfo = resolve.data.data;
      }).catch(handlerCommonError);
    }
  }

  @Watch('accountInfo', {immediate: true})
  handleInternalDomainInfoChange(newVal: AccountInfo, oldVal?: AccountInfo): void {
    if (null == newVal && null == oldVal) {
      return;
    }
    if (newVal != null && oldVal != null) {
      this.domainIdChange(newVal.accountId, oldVal.accountId);
    } else if (oldVal != null) {
      this.domainIdChange(0, oldVal.accountId);
    } else if (newVal != null) {
      this.domainIdChange(newVal.accountId, 0);
    }
  }

  @Emit('update:accountId')
  domainIdChange(accountId: number | undefined, accountId2: number | undefined): void {
  }

  saveFormData(): AxiosPromise {
    if (this.accountInfo.accountId != null) {
      return saveUser(this.accountInfo).catch(handlerCommonError);
    } else {
      return newUser(this.accountInfo).catch(handlerCommonError);
    }
  }
}
</script>

