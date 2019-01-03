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

      <el-table v-loading="listLoading" :data="data" element-loading-text="Loading"
                @selection-change="handleSelectionChange" border fit highlight-current-row>
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column label="ID">
          <template slot-scope="scope">
            {{ scope.row.subsidyCode }}
          </template>
        </el-table-column>
        <el-table-column label="活动名称">
          <template slot-scope="scope">
            <a @click="detailActivity(scope.$index, scope.row)" style="color: cornflowerblue">{{
              scope.row.name }}</a>
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
              <span>创建时间：</span>{{ scope.row.createTime }}<span style="margin-left: 15px;">创建人：</span>{{
              scope.row.createBy }}<br/>
              <span>修改时间：</span>{{ scope.row.modifyTime }}<span style="margin-left: 15px;">修改人：</span>{{
              scope.row.modifyBy }}<br/>
              <span>审核时间：</span>{{ scope.row.auditTime }}<span style="margin-left: 15px;">审核人：</span>{{
              scope.row.auditBy }}
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
                  <el-button type="primary" circle size="mini" icon="el-icon-edit" @click="editActivity(scope.row)"></el-button>
                </el-tooltip>
              </template>
              <!--可进行 提交审核 操作的状态为：未审核（0）-->
              <template v-if="scope.row.subsidyStatus === 0">
                <el-tooltip content="提交审核">
                  <el-button type="danger" circle size="mini" icon="el-icon-bell" @click="submitAuditActivity(scope.row)"></el-button>
                </el-tooltip>
              </template>
              <!--可进行 下线 操作的状态为：上线（2）-->
              <template v-if="scope.row.subsidyStatus === 2">
                <el-tooltip content="下线">
                  <el-button type="danger" circle size="mini" icon="el-icon-bell" @click="offlineActivity(scope.row)"></el-button>
                </el-tooltip>
              </template>
              <!--可进行 审核 操作的状态为：审核中（4）-->
              <template v-if="scope.row.subsidyStatus === 4">
                <el-tooltip content="审核">
                  <el-button type="danger" circle size="mini" icon="el-icon-bell" @click="auditActivity(scope.row)"></el-button>
                </el-tooltip>
              </template>
              <br/>
              <el-tooltip content="新增津贴" style="margin-top: 10px;">
                <el-button type="success" circle size="mini" icon="el-icon-plus" @click="openAddSubsidy(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip content="津贴流水" slot="reference">
                <el-button type="info" circle size="mini" icon="el-icon-info" @click="checkSubsidySerial(scope.row)"></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <search-page-pane @size-change="handleSizeChange" @current-change="handleCurrentChange" :size="size" :page="page" :total="total" slot="page"></search-page-pane>

      <el-dialog :title="title" :visible.sync="dialogActivityInfoActionVisible" :append-to-body="true" :modal-append-to-body="false" width="80%"
                 @close="editDomainInfo.editDomainId = 0; editDomainInfo.editDomainType = 0">
        <template v-if="this.editDomainInfo.editDomainType === 1">
          <div class="addActiveClass">
            <div class="title" >活动信息</div>
            <el-form :model="data" ref="AddActivityInfo" label-width="120px" >
              <el-form-item label="活动标题" prop="name" required>
                <el-input v-model="info.name"></el-input>
              </el-form-item>
              <el-form-item label="活动时间" required>
                <el-col :span="11">
                  <el-form-item prop="validStartTime">
                    <el-date-picker type="date" placeholder="选择活动起始日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="info.validStartTime" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="2">~</el-col>
                <el-col :span="11">
                  <el-form-item prop="validEndTime">
                    <el-date-picker type="date" placeholder="选择活动结束日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="info.validEndTime" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item label="津贴可用时间" required>
                <el-col :span="11">
                  <el-form-item prop="useStartTime">
                    <el-date-picker type="date" placeholder="选择津贴起始使用日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="info.useStartTime" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="2">~</el-col>
                <el-col :span="11">
                  <el-form-item prop="useEndTime">
                    <el-date-picker type="date" placeholder="选择津贴结束使用日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="info.useEndTime" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item label="活动说明" prop="memo">
                <el-input type="textarea" v-model="info.memo"></el-input>
              </el-form-item>
              <el-form-item style="margin-top: 30px">
                <el-button type="primary" @click="submitForm(info)">保存</el-button>
                <el-button @click="closeDialog()">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </template>
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
  import {
    getActivityList,
    getActivityDetail,
    deleteActivity,
    editActivity,
    toAuditActivity, offlineActivity
  } from '../../../api/subsidy';
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
    components: {ListTablePane, SearchPane, SearchPagePane},
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
    info: SubsidyActivityInfo = {subsidyActivityId: 0};

    detailActivity(index: number, row: SubsidyActivityInfo) {
      this.$router.push({path: 'activeInfo', query: {id: '' + row.subsidyActivityId}});
    }

    // 新增活动 - 页面
    addActivity(): void {
      this.$router.push({path: 'addActive'});
    }

    // 编辑活动 - 弹窗
    editActivity(row: SubsidyActivityInfo): void {
      this.title = '编辑活动';
      this.dialogActivityInfoActionVisible = true;
      this.editDomainInfo = {editDomainId: row.subsidyActivityId, editDomainType: 1};
      try {
        getActivityDetail(row.subsidyActivityId).then((response: AxiosResponse<ResponseResult<SubsidyActivityInfo>>) => {
          const responseData = response.data.data;
          this.info = responseData;
        }).catch(handlerCommonError);
      } catch (e) {
      }
    }

    closeDialog() {
      this.dialogActivityInfoActionVisible = false;
      this.editDomainInfo = {editDomainId: 0, editDomainType: 0};
    }

    submitForm(info: SubsidyActivityInfo) {
      editActivity(this.info).then((response: AxiosResponse<ResponseResult<boolean>>) => {
        if (response.data.success && response.data.data) {
          this.dialogActivityInfoActionVisible = false;
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
        this.fetchData();
      },async () => {
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
        this.fetchData();
      },async () => {
      }).catch(handlerCommonError);
    }

    // 审核活动 - 弹窗
    auditActivity(row: SubsidyActivityInfo): void {
      this.title = '审核活动';
      this.dialogActivityInfoActionVisible = true;
      this.$nextTick(() => this.editDomainInfo = {editDomainId: row.subsidyActivityId, editDomainType: 4});
    }

    // 新增津贴 - 弹窗
    openAddSubsidy(row: SubsidyActivityInfo): void {
      this.$router.push({path: 'addSubsidy', query: {id: '' + row.subsidyActivityId}});
    }

    // 津贴流水
    checkSubsidySerial(row: SubsidyActivityInfo): void {
      this.$router.push({path: 'subsidyDetailList', query: {id: '' + row.subsidyActivityId}});
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
      },async () => {
      }).catch(handlerCommonError);
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

<style scoped>
  .addActiveClass{
    margin: 30px 50px;
    width: 40vw;
  }
  .title{
    margin-bottom: 20px;
  }
  .line{
    text-align: center;
  }
</style>
