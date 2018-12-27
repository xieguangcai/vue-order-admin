<template>
  <div>
    <list-table-pane>

      <el-button-group slot="action" class="cc-action-button-group">
        <el-button type="success" icon="el-icon-circle-plus" size="mini" @click="addActivity">新建</el-button>
        <el-button type="danger" icon="el-icon-circle-close" size="mini" @click="handleDel">删除</el-button>
      </el-button-group>

      <search-pane slot="searchpane" @click="refetchData">
        <el-input v-model="listQuery.searchValue" size="mini" placeholder="活动ID/活动名称"></el-input>
      </search-pane>

      <el-table v-loading="listLoading" :data="data" element-loading-text="Loading" @selection-change="handleSelectionChange" border fit highlight-current-row>
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column label="ID">
          <template slot-scope="scope">
            {{ scope.row.subsidyCode }}
          </template>
        </el-table-column>
        <el-table-column label="活动名称">
          <template slot-scope="scope">
            <a @click="handleViewActivityInfoDetail(scope.$index, scope.row)" style="color: cornflowerblue">{{ scope.row.name }}</a>
          </template>
        </el-table-column>
        <el-table-column label="活动状态" width="80px">
          <template slot-scope="scope">
            {{ scope.row.subsidyStatus | ActivityStatus }}
          </template>
        </el-table-column>
        <el-table-column label="活动时间" width="380px">
          <template slot-scope="scope">
            <div>
              <span>活动时间：</span>{{ scope.row.validStartTime }} ~ {{ scope.row.validEndTime }}<br/>
              <span>使用时间：</span>{{ scope.row.useStartTime }} ~ {{ scope.row.useEndTime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="津贴总额">
          <template slot-scope="scope">
            <div>
              <span>发放：</span>{{ scope.row.sendMoney | NumFormat }} 元<br/>
              <span>领取：</span>{{ scope.row.receiveMoney | NumFormat }} 元<br/>
              <span>使用：</span>{{ scope.row.useMoney | NumFormat }} 元
            </div>
          </template>
        </el-table-column>
        <el-table-column label="津贴数" width="70px">
          <template slot-scope="scope">
            <a style="color: cornflowerblue; text-decoration: underline;">{{ scope.row.subsidyNum }} 个</a>
          </template>
        </el-table-column>
        <el-table-column label="日志" width="340px">
          <template slot-scope="scope">
            <div>
              <span>创建时间：</span>{{ scope.row.createTime }}<span style="margin-left: 15px;">创建人：</span>{{ scope.row.createBy }}<br/>
              <span>修改时间：</span>{{ scope.row.modifyTime }}<span style="margin-left: 15px;">修改人：</span>{{ scope.row.modifyBy }}<br/>
              <span>审核时间：</span>{{ scope.row.auditTime }}<span style="margin-left: 15px;">审核人：</span>{{ scope.row.auditBy }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="90px">
          <template slot-scope="scope">
            <div>
              <!--未审核（0）、审核不通过（1）、上线（2）、下线（3）、审核中（4）-->
              <!--可进行 修改 操作的状态为：未审核（0）、审核不通过（1）、下线（3）-->
              <template v-if="scope.row.subsidyStatus === 0 || scope.row.subsidyStatus === 1 || scope.row.subsidyStatus === 3">
                <el-tooltip content="编辑活动">
                  <el-button type="primary" circle size="mini" icon="el-icon-edit" @click="editActivity([scope.row])"></el-button>
                </el-tooltip>
              </template>
              <!--可进行 提交审核 操作的状态为：未审核（0）-->
              <template v-if="scope.row.subsidyStatus === 0">
                <el-tooltip content="提交审核">
                  <el-button type="danger" circle size="mini" icon="el-icon-bell" @click="submitAuditActivity([scope.row])"></el-button>
                </el-tooltip>
              </template>
              <!--可进行 下线 操作的状态为：上线（2）-->
              <template v-if="scope.row.subsidyStatus === 2">
                <el-tooltip content="下线">
                  <el-button type="danger" circle size="mini" icon="el-icon-bell" @click="offlineActivity([scope.row])"></el-button>
                </el-tooltip>
              </template>
              <!--可进行 审核 操作的状态为：审核中（4）-->
              <template v-if="scope.row.subsidyStatus === 4">
                <el-tooltip content="审核">
                  <el-button type="danger" circle size="mini" icon="el-icon-bell" @click="auditActivity([scope.row])"></el-button>
                </el-tooltip>
              </template>
              <br/>
              <el-tooltip content="新增津贴" style="margin-top: 10px;">
                <el-button type="success" circle size="mini" icon="el-icon-plus" @click="addSubsidy([scope.row])"></el-button>
              </el-tooltip>
              <el-tooltip content="津贴流水" slot="reference">
                <el-button type="info" circle size="mini" icon="el-icon-info" @click="checkSubsidySerial([scope.row])"></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <search-page-pane @size-change="handleSizeChange"  @current-change="handleCurrentChange" :size="size" :page="page" :total="total" slot="page"></search-page-pane>

      <el-dialog :title="title" :visible.sync="dialogActivityInfoActionVisible" :append-to-body="true" :modal-append-to-body="false" width="80%" @close="editDomainInfo.editDomainId = 0; editDomainInfo.editDomainType = 0">
        <activity-info-action :domain-id="editDomainInfo.editDomainId" :domain-type="editDomainInfo.editDomainType"/>
      </el-dialog>

    </list-table-pane>
  </div>
</template>


<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import SearchPane from '../../../components/SearchPane/index.vue';
import SearchPagePane from '../../../components/SearchPagePane/index.vue';
import {ActivityListQuery, Pageable, ResponseResult, SubsidyActivityInfo} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {AxiosResponse} from 'axios';
import {getActivityList, getActivityDetail, deleteActivity} from '../../../api/subsidy';
import {AppModule} from '../../../store/modules/app';
import ActivityInfoAction from './action.vue';
// @ts-ignore
import qs from 'qs';
import BaseList from '../../../components/BaseList';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import BaseTableDelete from '@/components/BaseTableDelete';

interface EditDomain {
  editDomainId: number | undefined;
  editDomainType: number;
}

@Component({
  components: {ListTablePane, SearchPane, SearchPagePane, ActivityInfoAction},
  filters: {
    NumFormat(value: number) {
      return (value / 100).toFixed(2);
    },
    ActivityStatus(value: number) {
      if (value === 0) {
        return '未审核';
      } else if (value === 1) {
        return '审核不通过';
      } else if (value === 2) {
        return '上线';
      } else if (value === 3) {
        return '下线';
      } else if (value === 4) {
        return '审核中';
      }
    },
  },
  mixins: [BaseList, BaseTableDelete],
})

export default class ActivityInfoList extends Vue {
  dialogActivityInfoActionVisible: boolean = false;
  editDomainInfo: EditDomain = {editDomainId: 0, editDomainType: 0};
  title: string = '';
  data: SubsidyActivityInfo[] = [];
  listQuery: ActivityListQuery = {page: 0, size: 50, total: 0};

  // 新增活动 - 弹窗
  addActivity(): void {
    this.title = '新增活动';
    this.dialogActivityInfoActionVisible = true;
    this.editDomainInfo = {editDomainId: 0, editDomainType: 0};
  }

  // 编辑活动 - 弹窗
  editActivity(row: SubsidyActivityInfo): void {
    this.title = '编辑活动';
    this.dialogActivityInfoActionVisible = true;
    this.$nextTick(() => this.editDomainInfo = {editDomainId: row.subsidyActivityId, editDomainType: 1});
  }

  // 提交审核 - 弹窗
  submitAuditActivity(row: SubsidyActivityInfo): void {
    this.title = '提交审核';
    this.dialogActivityInfoActionVisible = true;
    this.$nextTick(() => this.editDomainInfo = {editDomainId: row.subsidyActivityId, editDomainType: 2});
  }

  // 下线活动 - 弹窗
  offlineActivity(row: SubsidyActivityInfo): void {
    this.title = '下线活动';
    this.dialogActivityInfoActionVisible = true;
    this.$nextTick(() => this.editDomainInfo = {editDomainId: row.subsidyActivityId, editDomainType: 3});
  }

  // 审核活动 - 弹窗
  auditActivity(row: SubsidyActivityInfo): void {
    this.title = '审核活动';
    this.dialogActivityInfoActionVisible = true;
    this.$nextTick(() => this.editDomainInfo = {editDomainId: row.subsidyActivityId, editDomainType: 4});
  }

  // 新增津贴 - 弹窗
  addSubsidy(row: SubsidyActivityInfo): void {
    this.title = '新增津贴';
    this.dialogActivityInfoActionVisible = true;
    this.$nextTick(() => this.editDomainInfo = {editDomainId: row.subsidyActivityId, editDomainType: 5});
  }

  // 津贴流水 - 弹窗
  checkSubsidySerial(row: SubsidyActivityInfo): void {
    this.title = '津贴流水';
    this.dialogActivityInfoActionVisible = true;
    this.$nextTick(() => this.editDomainInfo = {editDomainId: row.subsidyActivityId, editDomainType: 5});
  }

  saveThenNew() {
    this.title = '';
    this.editDomainInfo = {editDomainId: 0, editDomainType: 0};
    // @ts-ignore
    this.fetchData();
  }

  handleDelRows(row: SubsidyActivityInfo[]) {
    if (row.length === 0) {
      return;
    }
    const rowsId: Array<number | undefined> = [];
    row.forEach((item) => rowsId.push(item.subsidyActivityId));

    this.$confirm('确认永久删除该活动信息吗?', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      // 删除
      const {data} = await deleteActivity(rowsId);
      this.$message({
        type: 'success',
        message: '删除成功',
      });
      // @ts-ignore
      this.fetchData();

    }).catch(() => {
    });
  }

  handleViewActivityInfoDetail(index: number, row: SubsidyActivityInfo) {
    this.dialogActivityInfoActionVisible = true;
    console.log('点击选择的活动id为' + row.subsidyActivityId);
    this.$nextTick(() => this.editDomainInfo.editDomainId = row.subsidyActivityId);
  }

  realFetchData() {
    return getActivityList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<SubsidyActivityInfo>>>) => {
      const responseData = response.data.data;
      this.data = responseData.content;
      this.listQuery.page = responseData.number;
      this.listQuery.size = responseData.size;
      this.listQuery.total = responseData.totalElements;
    }).catch(handlerCommonError);
  }

}
</script>
