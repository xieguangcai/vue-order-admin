<template>
  <span v-if="mac">
    <el-button v-if="!loaded" v-loading="loadingData" type="warning" style="height:20px;padding:2px;" @click="handleGetPolicy()" size="mini">获取设备源</el-button>
    <span v-if="loaded" class="cc-policy-name">设备源：{{policyModel.source}}</span>
  </span>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
  .cc-policy-name{color:green;}
</style>
<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
  import {
    ResponseResult,
    V1MoviePolicyModel,
  } from '../../../types';
  import {movieV1Policy} from '../../../api/authentication';
  import {AxiosResponse} from 'axios';
  import {handlerCommonError} from '../../../utils/auth-interceptor';

  @Component({
    name: 'PolicyComponent',
    components: {},
    filters: {},
    mixins: [],
  })
  export default class PolicyComponent extends Vue {
    @Prop({})
      // @ts-ignore
    mac: string;
    policyModel: V1MoviePolicyModel = {};
    loadingData: boolean = false;
    loaded: boolean = false;

    @Watch('mac')
    macChange(newVal: string, oldVal: string) {
      this.loaded = false;
      this.loadingData = false;
    }

    /**
     * 获取设备源信息
     */
    handleGetPolicy() {
      this.loadingData = true;
      movieV1Policy(this.mac).then((response: AxiosResponse<ResponseResult<V1MoviePolicyModel>>) => {
        this.policyModel = response.data.data;
        this.loaded = true;
      }).catch(handlerCommonError).finally(() => {
        this.loadingData = false;
      });
    }
  }
</script>
