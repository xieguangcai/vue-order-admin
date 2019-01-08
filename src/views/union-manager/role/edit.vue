<template>
  <el-form :model="domainInfo" ref="editForm" :rules="rules" :size="formSize" class="cc-dialog-edit-form"
           v-loading="loadingData"
           :element-loading-text="loadingText"
           element-loading-spinner="el-icon-loading"
  >
    <el-form-item label="所属系统" :label-width="formLabelWidth">
      <el-select v-model="domainInfo.application.appId">
        <el-option v-for="app in apps" :value="app.appId" :label="app.name" :key="app.appId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name">
      <el-input v-model="domainInfo.name"></el-input>
    </el-form-item>
    <el-form-item label="roleKey" :label-width="formLabelWidth" prop="roleKey">
      <el-input v-model="domainInfo.roleKey" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="状态" :label-width="formLabelWidth">
      <el-select v-model="domainInfo.status" placeholder="请选择状态">
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
import {ApplicationInfo, Pageable, ResponseResult, RoleInfo} from '../../../types';
import {getAppList, getRoleInfo, newRole, saveRole} from '../../../api/account';
import BaseEdit from '../../../components/BaseEdit';
import {AxiosResponse} from 'axios';
import {handlerCommonError} from '../../../utils/auth-interceptor';

@Component({
  name: 'RoleEdit',
  components: {},
  mixins: [ BaseEdit ],
})
export default class RoleEdit extends Vue {
  domainInfo: RoleInfo = {roleId: 0, status: 1, application: {appId: 1}, name: '', roleKey: ''};
  @Prop({type: Number, default: 0})
  domainId: number = 0;
  apps: ApplicationInfo[] = [];

  rules = {
    name: [{required: true, message: '请输入应用名称', trigger: 'blur'}, {
      max: 50,
      message: '长度必须在50个字符内',
      trigger: 'blur',
    }],
    roleKey: [{required: true, message: '请输入roleKey', trigger: 'blur'}, {
      min: 3,
      max: 50,
      message: '长度在3-50个字符',
      trigger: 'blur',
    }],
    application: [{
      required: true, message: '请选择所属于系统', trigger: 'blur',
    }],
  };

  created() {
    getAppList({}).then((response: AxiosResponse<ResponseResult<Pageable<RoleInfo>>>) => {
      const responseData = response.data.data;
      this.apps = responseData.content;
    });
  }


  @Watch('domainId', {immediate: true})
  handleDomainIdChange(newVal: number | undefined, oldVal: number| undefined) {
    if ( null == newVal || newVal === 0) {
      this.domainInfo = {roleId: 0, status: 1, application: {appId: 1}};
    } else {
      // @ts-ignore
      this.showLoading();
      getRoleInfo(this.domainId).then((resolve) => {
        this.domainInfo = resolve.data.data;
      }).catch(handlerCommonError).finally(() => {
        // @ts-ignore
        this.hiddenLoading();
      });
    }
  }

  @Watch('domainInfo', {immediate: true})
  handleInternalDomainInfoChange(newVal: RoleInfo, oldVal?: RoleInfo): void {
    if (null == newVal && null == oldVal) {
      return;
    }
    if (newVal != null && oldVal != null) {
      this.domainIdChange(newVal.roleId, oldVal.roleId);
    } else if (oldVal != null) {
      this.domainIdChange(0, oldVal.roleId);
    } else if (newVal != null) {
      this.domainIdChange(newVal.roleId, 0);
    }
  }

  @Emit('update:domainId')
  domainIdChange(newVal: number | undefined, oldVal: number | undefined): void {
  }

  saveFormData(): Promise<any> {
    if (this.domainInfo.roleId !== 0) {
      return saveRole(this.domainInfo).catch(handlerCommonError);
    } else {
      return newRole(this.domainInfo).catch(handlerCommonError);
    }
  }
}
</script>
