<template>
  <div class="activeInfo" :model="info">
    <div class="title" >活动信息</div>
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
    <div class="title" >津贴管理</div>
    <el-table label-width="120px" :data="info.subsidyInfoList">
      <el-table-column
        label="津贴ID"
        prop="subsidyTypeCode">
      </el-table-column>
      <el-table-column
        label="津贴名称"
        prop="typeName">
      </el-table-column>
      <el-table-column
        label="津贴金额"
        prop="money">
      </el-table-column>
      <el-table-column
        label="发放数量"
        prop="sendNum">
      </el-table-column>
      <el-table-column
        label="已领取数量"
        prop="receiveNum">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button @click="handleEditSubsidy(info.subsidyActivityId, scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="footBtn">
      <el-button  @click="$router.push({path: 'addSubsidy', query: {id: '' + info.subsidyActivityId}})">新增津贴</el-button>
      <el-button type="primary" @click="$router.push({path: 'subsidy-activity-list'})">返回</el-button>
    </div>

    <el-dialog title="修改津贴" :visible.sync="dialogEditSubsidyVisible" :append-to-body="true"
               :modal-append-to-body="false" width="80%"
               @close="editDomainInfo.editDomainId = 0">
      <el-form :label-position="labelPosition" label-width="120px" :subsidy="info">
        <el-form-item label="津贴ID：" prop="subsidyTypeCode">
          <el-col :span="5">
            {{ subsidy.subsidyTypeCode }}
          </el-col>
        </el-form-item>
        <el-form-item label="津贴名称：" prop="name">
          <el-col :span="11">
            <el-input v-model="subsidy.typeName" :value="subsidy.typeName" placeholder="津贴名称(不超过8个字)"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="津贴金额：" prop="money">
          <el-col :span="5">
            {{ subsidy.money }} 元
          </el-col>
        </el-form-item>
        <el-form-item label="发放数量：" prop="sendNum">
          <el-col :span="11">
            <el-input v-model="subsidy.sendNum"></el-input> 个
          </el-col>
        </el-form-item>
        <el-form-item label="已领取数量：" prop="receiveNum">
          <el-col :span="5">
            {{ subsidy.receiveNum }} 个
          </el-col>
        </el-form-item>
        <el-form-item style="margin-top: 30px">
          <el-button @click="submitForm(info, subsidy)">保存并新增</el-button>
          <el-button type="primary" @click="submitForm(info, subsidy)">保存</el-button>
          <el-button @click="$router.push({path: 'subsidy-activity-list'})">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
  import {getActivityDetail, getSubsidDetail} from '../../../api/subsidy';
  import {SubsidyActivityInfo, ResponseResult, SubsidyType} from '../../../types';
  import {AxiosResponse} from 'axios';
  import {handlerCommonError} from '@/utils/auth-interceptor';

  interface EditDomain {
    editDomainId: number | undefined;
    editDomainType: number;
  }

  @Component({
    name: 'ActivityInfoDetail',
    components: {},
  })

  export default class ActivityInfoDetail extends Vue {
    labelPosition: string = 'right';

    dialogEditSubsidyVisible: boolean = false;

    editDomainInfo: EditDomain = {editDomainId: 0, editDomainType: 0};

    subsidy: SubsidyType = {subsidyTypeId: 0};

    info: SubsidyActivityInfo = {subsidyActivityId: 0,
      subsidyInfoList: [],
    };

    handleEditSubsidy(activityId: number, row: SubsidyType) {
      this.dialogEditSubsidyVisible = true;
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
            if (this.info && this.info.subsidyInfoList) {
              for (const subsidy of this.info.subsidyInfoList) {
                if (subsidy && subsidy.money) {
                  subsidy.money = parseFloat((subsidy.money / 100).toFixed(2));
                }
              }
            }
          }).catch(handlerCommonError);
        }
      } catch (e) {
      }
    }

  }


</script>

<style scoped>
  .activeInfo{
    margin: 30px 50px;
    width: 50vw;
  }
  .title{
    margin-bottom: 20px;
  }
  .footBtn{
    margin: 30px;
    text-align: center;
  }

</style>
