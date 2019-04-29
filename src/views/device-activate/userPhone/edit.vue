<template>
  <el-form :model="domainInfo" ref="editForm" :rules="rules" :size="formSize">
    <el-form-item label="测试手机号码" :label-width="formLabelWidth" prop="mobile">
      <el-input v-model="domainInfo.mobile"></el-input>
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
import {UserPhone} from '../../../types/index';
import {getUserInfoInfo, updateUserPhone, saveUserPhone} from '../../../api/userPhone';
import BaseEdit from '../../../components/BaseEdit';
import {handlerCommonError} from '../../../utils/auth-interceptor';

@Component({
  name: 'UserPhoneEdit',
  components: {},
  mixins: [ BaseEdit ],
})
export default class UserPhoneEdit extends Vue {
  domainInfo: UserPhone = {states: 0};
  @Prop({type: Number, default: 0})
  domainId: number = 0;

  rules = {
    mobile: [{required: true, message: '请输入手机号', trigger: 'blur'}, {
      min: 11,
      max: 11,
      message: '长度必须是11个字符',
      trigger: 'blur',
    }],
  };


  @Watch('domainId', {immediate: true})
  handleDomainIdChange(newVal: number | undefined, oldVal: number| undefined) {
    if ( null == newVal || newVal === 0) {
      this.domainInfo = {states: 1};
    } else {
      // @ts-ignore
      this.showLoading();
      getUserInfoInfo(this.domainId).then((resolve) => {
        this.domainInfo = resolve.data.data;
      }).catch(handlerCommonError).finally(() => {
        // @ts-ignore
        this.hiddenLoading();
      });
    }
  }

  @Watch('domainInfo', {immediate: true})
  handleInternalDomainInfoChange(newVal: UserPhone, oldVal?: UserPhone): void {
    if (null == newVal && null == oldVal) {
      return;
    }
    if (newVal != null && oldVal != null) {
      this.domainIdChange(newVal.id, oldVal.id);
    } else if (oldVal != null) {
      this.domainIdChange(0, oldVal.id);
    } else if (newVal != null) {
      this.domainIdChange(newVal.id, 0);
    }
  }

  @Emit('update:domainId')
  domainIdChange(newVal: number | undefined, oldVal: number | undefined): void {
  }

  saveFormData(): Promise<any> {
    if (this.domainInfo.id != null && this.domainInfo.id !== 0) {
      return updateUserPhone(this.domainInfo).catch(handlerCommonError);
    } else {
      return saveUserPhone(this.domainInfo).catch(handlerCommonError);
    }
  }
}
</script>
