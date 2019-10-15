<template>
    <el-form :model="source" ref="editForm" :rules="rules" :size="formSize">
      <el-form-item label="ID" :label-width="formLabelWidth" style="display: none">
        <el-input v-model="source.sourceId"></el-input>
      </el-form-item>
      <el-form-item label="分类名称" :label-width="formLabelWidth" >
        <span>{{ source.sourceName }}</span>
      </el-form-item>
      <el-form-item label="权益标识" :label-width="formLabelWidth" >
        <span>{{ source.sourceSign }}</span>
      </el-form-item>
      <el-form-item label="业务类型" :label-width="formLabelWidth" >
        <span>{{ businessTypeToName(source.businessType) }}</span>
      </el-form-item>
      <el-form-item label="供应商" :label-width="formLabelWidth" >
        <span>{{ source.baseOrderCompany.companyCnName }}</span>
      </el-form-item>
      <el-form-item label="鉴权方式" :label-width="formLabelWidth" prop="sourceType">
        <el-select v-model="source.sourceType">
            <el-option :value="1" label="自有鉴权"></el-option>
            <el-option :value="0" label="第三方鉴权"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="推送类型" :label-width="formLabelWidth" prop="pushType">
        <el-select v-model="source.pushType">
          <el-option :value="1" label="默认"></el-option>
          <el-option :value="3" label="不推送电视端"></el-option>
          <el-option :value="10" label="卡密"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="级别" :label-width="formLabelWidth" prop="sourceModel">
        <el-radio-group v-model="source.sourceModel">
          <el-radio :label="0">基础权益</el-radio>
          <el-radio :label="1">超级权益</el-radio>
          <el-radio :label="2">套餐权益</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="关联权益分类" :label-width="formLabelWidth">

      </el-form-item>
      <el-form-item label="权益描述" :label-width="formLabelWidth">
        <el-input type="textarea" v-model="source.description"></el-input>
      </el-form-item>
      <span style="font-size: 18px;">属性</span>
      <el-form-item label="VIP徽章图标" :label-width="formLabelWidth">

      </el-form-item>
      <div class="cc-edit-button">
          <el-button type="primary" @click="save">保存</el-button>
      </div>
    </el-form>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
import {BaseOrderSource} from '../../../types/index';
import {querySource, saveSource} from '../../../api/authentication/source';
import BaseEdit from '../../../components/BaseEdit';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import {AppModule, propertyToName} from '../../../store/modules/app';

@Component({
  name: 'SourceEdit',
  components: {},
  mixins: [ BaseEdit ],
})
export default class SourceEdit extends Vue {

  source: BaseOrderSource = {};

  @Prop({type: Number, default: 0})
  sourceId: number = 0;

  rules = {
    sourceType: [{required: true, message: '请选择鉴权方式', trigger: 'blur'}],
    pushType: [{required: true, message: '请选择推送类型', trigger: 'blur'}],
    sourceModel: [{required: true, message: '请选择级别', trigger: 'blur'}],
    department: [{required: true, message: '请输入部门', trigger: 'blur'}],
  };


  @Watch('sourceId', {immediate: true})
  handleSourceIdChange(newVal: number | undefined, oldVal: number| undefined) {
      if (newVal == 0) {
          return;
      }
    // @ts-ignore
    this.showLoading();
    querySource(this.sourceId).then((resolve) => {
      this.source = resolve.data.data;
    }).catch(handlerCommonError).finally(() => {
      // @ts-ignore
      this.hiddenLoading();
    });
  }

  saveFormData(): Promise<any> {
    return saveSource(this.source).catch(handlerCommonError);
  }

  businessTypeToName(code: string) {
    return propertyToName(code, AppModule.businessType);
  }

}
</script>

