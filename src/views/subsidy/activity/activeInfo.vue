<template>
  <div class="activeInfo" :model="info">
    <div class="title">活动信息</div>
    <el-form :label-position="labelPosition" label-width="120px">
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
    <div class="title">津贴管理</div>
    <el-table label-width="120px" :data="info.subsidyInfoList">
      <el-table-column label="津贴ID">
        <template slot-scope="scope">
          {{scope.row.subsidyTypeCode}}
        </template>
      </el-table-column>
      <el-table-column label="津贴名称">
        <template slot-scope="scope">
          {{scope.row.typeName}}
        </template>
      </el-table-column>
      <el-table-column label="津贴金额">
        <template slot-scope="scope">
          {{scope.row.money}} 元
        </template>
      </el-table-column>
      <el-table-column label="发放数量">
        <template slot-scope="scope">
          {{scope.row.sendNum}} 个
        </template>
      </el-table-column>
      <el-table-column label="已领取数量">
        <template slot-scope="scope">
          {{scope.row.receiveNum}} 个
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button @click="handleEditSubsidy(info.subsidyActivityId, scope.row)"
                     v-if="checkUserRole('SUBSIDY_ROLE_EDIT')">修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="footBtn">
      <!--可进行 提交审核 操作的状态为：未审核（0）-->
      <el-button type="danger" @click="submitAuditActivity(info)"
                 v-if="info.subsidyStatus === 0 && checkUserRole('SUBSIDY_ROLE_EDIT')">提交审核
      </el-button>
      <!--可进行 下线 操作的状态为：上线（2）-->
      <el-button type="danger" @click="offlineActivity(info)"
                 v-if="info.subsidyStatus === 2 && checkUserRole('SUBSIDY_ROLE_AUDIT')">下线
      </el-button>
      <!--可进行 审核 操作的状态为：审核中（4）-->
      <el-button type="danger" @click="auditActivity(info)"
                 v-if="info.subsidyStatus === 4 && checkUserRole('SUBSIDY_ROLE_AUDIT')">审核
      </el-button>
      <el-button @click="$router.push({path: 'addSubsidy', query: {id: '' + info.subsidyActivityId}})"
                 v-if="checkUserRole('SUBSIDY_ROLE_EDIT')">新增津贴
      </el-button>
      <el-button type="primary" @click="$router.push({path: 'subsidy-activity-list'})">返回</el-button>
    </div>

    <el-dialog :title="title" :visible.sync="dialogEditSubsidyVisible" :append-to-body="true"
               :modal-append-to-body="false" width="55%" @close="editDomainInfo.editDomainId = 0">
      <template v-if="this.editDomainInfo.editDomainType === 1">
        <el-form :label-position="labelPosition" label-width="120px" :subsidy="info">
          <el-form-item label="津贴ID：" prop="subsidyTypeCode">
            <el-col :span="5">
              {{ subsidy.subsidyTypeCode }}
            </el-col>
          </el-form-item>
          <el-form-item label="津贴名称：" prop="name">
            <el-col :span="11">
              <el-input v-model="subsidy.typeName" placeholder="津贴名称(不超过8个字)"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="津贴金额：" prop="money">
            <el-col :span="5">
              {{ subsidy.money }} 元
            </el-col>
          </el-form-item>
          <el-form-item label="发放数量：" prop="sendNum" style="margin-bottom: 0px;">
            <el-col :span="11">
              <el-input-number v-model="subsidy.sendNum" :min="subsidy.receiveNum" :step="1"
                               style="width: 50%;"></el-input-number>
              个
            </el-col>
          </el-form-item>
          <el-form-item label="" prop="" style="margin-bottom: 0px;">
            <el-col :span="11" style="color: #d3dce6;">
              注：发放数量不得小于已领取数量
            </el-col>
          </el-form-item>
          <el-form-item label="已领取数量：" prop="receiveNum">
            <el-col :span="5" style="color: red;">
              {{ subsidy.receiveNum }} 个
            </el-col>
          </el-form-item>
          <el-form-item style="margin-top: 30px">
            <el-button type="primary" @click="submitForm(info.subsidyActivityId, subsidy)" v-if="checkUserRole('SUBSIDY_ROLE_EDIT')">保存</el-button>
            <el-button @click="closeDialog">取消</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template v-if="this.editDomainInfo.editDomainType === 2">
        <el-form ref="AuditActivityInfo" label-width="120px">
          <div style="margin-left: 50px;">
            <label>同意 <input type="radio" v-model="isAgree" value="true"/></label>
            <label style="margin-left: 30px;">驳回 <input type="radio" v-model="isAgree" value="false"/></label>
          </div>
          <el-form-item style="text-align: center; margin-top: 30px;">
            <el-button type="primary" @click="doAuditActivityInfo(editDomainInfo.editDomainId, isAgree)"
                       v-if="checkUserRole('SUBSIDY_ROLE_AUDIT')">保存
            </el-button>
            <el-button @click="closeDialog()">取消</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>


  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import {
  auditActivity,
  editSubsidy,
  getActivityDetail,
  getSubsidDetail,
  offlineActivity,
  toAuditActivity,
} from '../../../api/subsidy';
import {SubsidyActivityInfo, ResponseResult, SubsidyType} from '../../../types';
import {AxiosResponse} from 'axios';
import {handlerCommonError} from '@/utils/auth-interceptor';
import RightComponent from '@/components/RightComponent';

interface EditDomain {
  editDomainId: number | undefined;
  editDomainType: number;
}

@Component({
  name: 'ActivityInfoDetail',
  components: {},
  mixins: [RightComponent],
})

export default class ActivityInfoDetail extends Vue {
  labelPosition: string = 'right';
  dialogEditSubsidyVisible: boolean = false;
  isAgree: boolean = true;
  editDomainInfo: EditDomain = {editDomainId: 0, editDomainType: 0};
  subsidy: SubsidyType = {subsidyTypeId: 0};
  info: SubsidyActivityInfo = {subsidyActivityId: 0, subsidyInfoList: []};
  title: string = '';

  closeDialog() {
    this.dialogEditSubsidyVisible = false;
    this.editDomainInfo = {editDomainId: 0, editDomainType: 0};
  }

  handleEditSubsidy(activityId: number, row: SubsidyType) {
    this.title = '修改津贴';
    this.dialogEditSubsidyVisible = true;
    this.editDomainInfo = {editDomainId: row.subsidyTypeId, editDomainType: 1};
    try {
      // @ts-ignore
      // debugger
      getSubsidDetail(activityId, row.subsidyTypeId).then((response: AxiosResponse<ResponseResult<SubsidyType>>) => {
        const responseData = response.data.data;
        console.log(responseData);
        this.subsidy = responseData;
        if (this.subsidy && this.subsidy.money) {
          this.subsidy.money = parseFloat((this.subsidy.money / 100).toFixed(2));
        }
      }).catch(handlerCommonError);
    } catch (e) {
    }
  }

  submitForm(activityId: number, row: SubsidyType) {
    // @ts-ignore
    editSubsidy(activityId, this.editDomainInfo.editDomainId, row.typeName, row.sendNum).then((response: AxiosResponse<ResponseResult<boolean>>) => {
      if (response.data.success && response.data.data) {
        this.dialogEditSubsidyVisible = false;
        this.realFetchData();
      }
    }).catch(handlerCommonError);
  }

  // 提交审核 - 弹窗
  submitAuditActivity(row: SubsidyActivityInfo): void {
    this.$confirm('确认提交审核吗?', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      // 提交审核
      const {data} = await toAuditActivity(row.subsidyActivityId);
      this.$message({
        type: 'success',
        message: '提交审核成功',
      });
      // @ts-ignore
      this.$router.push({path: 'subsidy-activity-list'});
    }, async () => {
    }).catch(handlerCommonError);
  }

  // 下线活动 - 弹窗
  offlineActivity(row: SubsidyActivityInfo): void {
    this.$confirm('确认下线该活动吗?', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      // 下线活动
      const {data} = await offlineActivity(row.subsidyActivityId);
      this.$message({
        type: 'success',
        message: '下线活动成功',
      });
      // @ts-ignore
      this.$router.push({path: 'subsidy-activity-list'});
    }, async () => {
    }).catch(handlerCommonError);
  }

  // 审核活动 - 弹窗
  auditActivity(row: SubsidyActivityInfo): void {
    this.title = '审核活动';
    this.dialogEditSubsidyVisible = true;
    this.editDomainInfo = {editDomainId: row.subsidyActivityId, editDomainType: 2};
  }

  doAuditActivityInfo(activityId: number, isAgree: boolean): void {
    auditActivity(activityId, isAgree).then((response: AxiosResponse<ResponseResult<boolean>>) => {
      if (response.data.success && response.data.data) {
        this.dialogEditSubsidyVisible = false;
        this.$router.push({path: 'subsidy-activity-list'});
      }
    }).catch(handlerCommonError);
  }

  realFetchData() {
    const x = parseInt(this.$route.query.id, 0);
    if (x != null) {
      this.info.subsidyActivityId = x;
      getActivityDetail(x).then((response: AxiosResponse<ResponseResult<SubsidyActivityInfo>>) => {
        const responseData = response.data.data;
        console.log(responseData);
        this.info = responseData;
        if (this.info && this.info.subsidyInfoList) {
          for (const subsidy of this.info.subsidyInfoList) {
            if (subsidy && subsidy.money) {
              subsidy.money = parseFloat((subsidy.money / 100).toFixed(2));
            }
          }
        }
      }).catch(handlerCommonError);
    }
  }

  created() {
    try {
      // @ts-ignore
      // debugger
      this.realFetchData();
    } catch (e) {
    }
  }

}
</script>

<style scoped>
  .activeInfo {
    margin: 30px 50px;
    width: 70vw;
  }

  .title {
    margin-bottom: 20px;
  }

  .footBtn {
    margin: 30px;
    text-align: center;
  }

</style>
