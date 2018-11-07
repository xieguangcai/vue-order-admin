<template>
  <el-form :model="domainInfo" ref="editForm" :rules="rules" :size="formSize">
    <el-form-item label="接入系统名称" :label-width="formLabelWidth" prop="name">
      <el-input v-model="domainInfo.name"></el-input>
    </el-form-item>
    <el-form-item label="appKey" :label-width="formLabelWidth" prop="appKey">
      <el-input v-model="domainInfo.appKey" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="appSecret" :label-width="formLabelWidth" prop="appSecret">
      <el-input v-model="domainInfo.appSecret"></el-input>
    </el-form-item>
    <el-form-item label="状态" :label-width="formLabelWidth">
      <el-select v-model="domainInfo.status" placeholder="请选择状态">
        <el-option v-for="item in recordeStatus" :label="item.label" :value="item.value" :key="item.value"/>
      </el-select>
    </el-form-item>
    <el-form-item label="备注" :label-width="formLabelWidth">
      <el-input  v-model="domainInfo.memo" auto-complete="off"></el-input>
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
import {ApplicationInfo} from '../../types/index';
import {getAppInfo, newApp, newUser, saveApp} from '../../api/account';
import EditFormPane from '../../components/EditFormPane/index.vue';
import BaseEdit from '../../components/BaseEdit';
import {AxiosPromise} from 'axios';
import {handlerCommonError} from '../../utils/auth-interceptor';

@Component({
  name: 'ApplicationEdit',
  components: {EditFormPane},
  mixins: [ BaseEdit ],
})
export default class ApplicationEdit extends Vue {
  domainInfo: ApplicationInfo = {status: 1};
  @Prop({type: Number, default: 0})
  domainId: number = 0;

  rules = {
    name: [{required: true, message: '请输入应用名称', trigger: 'blur'}, {
      max: 50,
      message: '长度必须在50个字符内',
      trigger: 'blur',
    }],
    appKey: [{required: true, message: '请输入appKey', trigger: 'blur'}, {
      min: 16,
      max: 16,
      message: '长度必须是16个字符',
      trigger: 'blur',
    }],
    appSecret: [{required: true, message: '请输入appSecret', trigger: 'blur'}, {
      min: 32,
      max: 32,
      message: '长度必须是32个字符',
      trigger: 'blur',
    }],
    memo: [{
      max: 200,
      message: '长度不能超过200个字符',
      trigger: ['blur', 'change'],
    }],
  };


  @Watch('domainId', {immediate: true})
  handleDomainIdChange(newVal: number | undefined, oldVal: number| undefined) {
    if ( null == newVal || newVal === 0) {
      this.domainInfo = {status: 1};
    } else {
      getAppInfo(this.domainId).then((resolve) => {
        this.domainInfo = resolve.data.data;
      }).catch(handlerCommonError);
    }
  }

  @Watch('domainInfo', {immediate: true})
  handleInternalDomainInfoChange(newVal: ApplicationInfo, oldVal?: ApplicationInfo): void {
    if (null == newVal && null == oldVal) {
      return;
    }
    if (newVal != null && oldVal != null) {
      this.domainIdChange(newVal.appId, oldVal.appId);
    } else if (oldVal != null) {
      this.domainIdChange(0, oldVal.appId);
    } else if (newVal != null) {
      this.domainIdChange(newVal.appId, 0);
    }
  }

  @Emit('update:domainId')
  domainIdChange(newVal: number | undefined, oldVal: number | undefined): void {
  }

  saveFormData(): Promise<any> {
    if (this.domainInfo.appId != null && this.domainInfo.appId !== 0) {
      return saveApp(this.domainInfo).catch(handlerCommonError);
    } else {
      return newApp(this.domainInfo).catch(handlerCommonError);
    }
  }
}
</script>
