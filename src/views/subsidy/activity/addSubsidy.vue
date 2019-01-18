<template>
  <div class="addSubsidy">
    <div class="title">活动信息</div>
    <el-form :label-position="labelPosition" label-width="120px" :model="info">
      <el-form-item label="活动ID：">
        {{info.subsidyCode}}
      </el-form-item>
      <el-form-item label="活动标题：">
        {{info.name}}
      </el-form-item>
      <el-form-item label="活动时间：">
        {{info.validStartTime}} ~ {{info.validEndTime}}
      </el-form-item>
      <el-form-item label="津贴可用时间：">
        {{info.useStartTime}} ~ {{info.useEndTime}}
      </el-form-item>
      <el-form-item label="活动说明：">
        {{info.memo}}
      </el-form-item>
    </el-form>
    <div class="border"></div>
    <div class="title">津贴管理</div>
    <el-form :label-position="labelPosition" :rules="rules" label-width="120px">
      <el-form-item label="津贴名称：" prop="name">
        <el-col :span="11">
          <el-input v-model="subsidy.typeName" placeholder="津贴名称(限8个字)"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="津贴金额：" prop="money">
        <el-col :span="11">
          <el-input-number v-model="subsidy.money" :min="0" :step="0.01" style="width: 90%;"></el-input-number> 元
        </el-col>
      </el-form-item>
      <el-form-item label="发放数量：" prop="sendNum">
        <el-col :span="11">
          <el-input-number v-model="subsidy.sendNum" :min="0" :step="1" style="width: 90%;"></el-input-number> 个
        </el-col>
      </el-form-item>
      <el-form-item style="margin-top: 30px">
        <el-button @click="submitForm(info, subsidy, 1)" v-if="checkUserRole('SUBSIDY_ROLE_EDIT')">保存并新增</el-button>
        <el-button type="primary" @click="submitForm(info, subsidy, 2)" v-if="checkUserRole('SUBSIDY_ROLE_EDIT')">保存</el-button>
        <el-button @click="$router.push({path: 'subsidy-activity-list'})">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import {addSubsidy, getActivityDetail} from '../../../api/subsidy';
import {SubsidyActivityInfo, ResponseResult, SubsidyType} from '../../../types';
import {AxiosResponse} from 'axios';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import RightComponent from '@/components/RightComponent';

@Component({
  name: 'SubsidyAdd',
  components: {},
  mixins: [RightComponent],
})
export default class SubsidyAdd extends Vue {
  labelPosition: string = 'right';
  name: string = 'addSubsidy';

  // info: SubsidyActivityInfo = {subsidyActivityId: 1,
  //   subsidyInfoList:[]
  // };
  info: SubsidyActivityInfo = {
    subsidyActivityId: 0,
    subsidyInfoList: [],
  };

  subsidy: SubsidyType = {subsidyTypeId: 0};

  submitForm(params: SubsidyActivityInfo, row: SubsidyType, type: number) {
    if (row && row.money) {
      row.money = row.money * 100;
    }
    addSubsidy(params.subsidyActivityId, row.typeName, row.money, row.sendNum).then((response: AxiosResponse<ResponseResult<boolean>>) => {
      if (response.data.success && response.data.data) {
        if (type === 1) {
          this.subsidy = {subsidyTypeId: 0};
        } else if (type === 2) {
          this.$router.push({path: 'activeInfo', query: {id: '' + params.subsidyActivityId}});
        }
      }
    }).catch(handlerCommonError);
  }

  created() {
    try {
      // @ts-ignore
      // debugger
      const x = parseInt(this.$route.query.id, 0);
      if (x != null) {
        this.info.subsidyActivityId = x;
        getActivityDetail(x).then((response: AxiosResponse<ResponseResult<SubsidyActivityInfo>>) => {
          const responseData = response.data.data;
          console.log(responseData);
          this.info = responseData;
        }).catch(handlerCommonError);
      }
    } catch (e) {
    }
  }

  domainId: number = 0;
  activated() {
    if (this.domainId !== 0) {
      this.domainId = 0;
    }
  }
}
</script>

<style scoped>
  .border {
    width: 40vw;
    height: 1px;
    border-bottom: 1px dashed #000;
    margin-bottom: 30px;
  }

  .addSubsidy {
    margin: 30px 50px;
    width: 40vw;
  }

</style>
