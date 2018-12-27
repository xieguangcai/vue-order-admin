<template>
  <div>
    <list-table-pane>

      <el-button-group slot="action" class="cc-action-button-group">
        <el-button type="success" icon="el-icon-circle-plus" size="mini" @click="addActivity">新建</el-button>
        <el-button type="primary" icon="el-icon-circle-edit" size="mini" @click="editActivity">编辑</el-button>
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
            <a @mouseover="handleViewActivityInfoDetail(scope.$index, scope.row)" @mouseout="closePane" style="color: cornflowerblue; text-decoration: underline;">{{ scope.row.subsidyNum }} 个</a>
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

            <el-tooltip content="新增津贴">
              <el-button type="success" circle size="mini" icon="el-icon-plus" @click="aaa(scope.$index, scope.row)"></el-button>
            </el-tooltip>

            <el-tooltip content="新增津贴">
              <el-button type="success" circle size="mini" icon="el-icon-plus" @click="aaa(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="津贴流水" slot="reference">
              <el-button type="info" circle size="mini" icon="el-icon-info" @click="aaa([scope.row])"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <search-page-pane @size-change="handleSizeChange"  @current-change="handleCurrentChange" :size="size" :page="page" :total="total" slot="page"></search-page-pane>

      <el-dialog title="新增活动" :visible.sync="dialogActivityInfoAddVisible" :append-to-body="true" :modal-append-to-body="false" width="80%" @close="editDomainInfo.editDomainId = 0">
        <activity-info-add :domain-id="editDomainInfo.editDomainId"/>
      </el-dialog>

      <el-dialog title="修改活动" :visible.sync="dialogActivityInfoEditVisible" :append-to-body="true" :modal-append-to-body="false" width="80%" @close="editDomainInfo.editDomainId = 0">
        <activity-info-edit :domain-id="editDomainInfo.editDomainId"/>
      </el-dialog>

      <el-dialog title="查看活动" :visible.sync="dialogActivityInfoDetilVisible" :append-to-body="true" :modal-append-to-body="false" width="80%" @close="editDomainInfo.editDomainId = 0">
        <activity-info-detail :domain-id="editDomainInfo.editDomainId"/>
      </el-dialog>

      <el-dialog title="新增津贴" :visible.sync="dialogSubsidyInfoAddVisible" :append-to-body="true" :modal-append-to-body="false" width="80%" @close="editDomainInfo.editDomainId = 0">
        <subsidy-info-add :domain-id="editDomainInfo.editDomainId"/>
      </el-dialog>

      <el-dialog title="津贴流水" :visible.sync="dialogSubsidyInfoSerialVisible" :append-to-body="true" :modal-append-to-body="false" width="80%" @close="editDomainInfo.editDomainId = 0">
        <subsidy-info-serial :domain-id="editDomainInfo.editDomainId"/>
      </el-dialog>

      <el-dialog title="错误提示" :visible.sync="dialogErrorVisible" :append-to-body="true" :modal-append-to-body="false" width="80%" @close="editDomainInfo.editDomainId = 0">
        <error-info-show :domain-id="editDomainInfo.editDomainId"/>
        cuowu
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
  import ActivityInfoAdd from './add.vue';
  // @ts-ignore
  import qs from 'qs';
  import BaseList from '../../../components/BaseList';
  import {handlerCommonError} from '../../../utils/auth-interceptor';
  import BaseTableDelete from "@/components/BaseTableDelete";

  interface EditDomain {
    editDomainId: number | undefined;
  }

  @Component({
    components: {ListTablePane, SearchPane, SearchPagePane},
    filters: {'NumFormat':function(value){return (value / 100).toFixed(2)}, 'ActivityStatus':function(value){if (value == 0) {return '未审核'} else if (value == 1) {return '审核不通过'} else if (value == 2) {return '上线'} else if (value == 3) {return '下线'}}},
    mixins: [BaseList, BaseTableDelete],
  })
  export default class ActivityInfoList extends Vue {
    dialogActivityInfoAddVisible: boolean = false;
    dialogActivityInfoEditVisible: boolean = false;
    dialogActivityInfoDetilVisible: boolean = false;
    dialogSubsidyInfoAddVisible: boolean = false;
    dialogSubsidyInfoSerialVisible: boolean = false;
    dialogErrorVisible: boolean = false;

    editDomainInfo: EditDomain = {editDomainId: 0};

    data: SubsidyActivityInfo[] = [];
    listQuery: ActivityListQuery = {page: 0, size: 50, total: 0};

    realFetchData() {
      return getActivityList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<SubsidyActivityInfo>>>) => {
        const responseData = response.data.data;
        this.data = responseData.content;
        this.listQuery.page = responseData.number;
        this.listQuery.size = responseData.size;
        this.listQuery.total = responseData.totalElements;
      }).catch(handlerCommonError);
    }

    // 新增活动 - 弹窗
    addActivity() {
      this.dialogActivityInfoAddVisible = true;
      this.dialogActivityInfoEditVisible = false;
      this.dialogActivityInfoDetilVisible = false;
      this.dialogSubsidyInfoAddVisible = false;
      this.dialogSubsidyInfoSerialVisible = false;
      this.dialogErrorVisible = false;
      this.editDomainInfo.editDomainId = 0;
    }

    // 编辑活动 - 弹窗
    editActivity(row: SubsidyActivityInfo[]) {

      getSelectedRows


      this.dialogActivityInfoAddVisible = false;
      this.dialogActivityInfoEditVisible = true;
      this.dialogActivityInfoDetilVisible = false;
      this.dialogSubsidyInfoAddVisible = false;
      this.dialogSubsidyInfoSerialVisible = false;
      this.dialogErrorVisible = false;



      this.editDomainInfo.editDomainId = 0;
    }




    closePane() {
      // 关闭新活动弹窗
      this.dialogActivityInfoDetilVisible = false;
      this.editDomainInfo.editDomainId = 0;
    }



    handleEdit(index: number, row: SubsidyActivityInfo): void {
      this.dialogActivityInfoDetilVisible = true;
      this.$nextTick(() => this.editDomainInfo.editDomainId = row.subsidyActivityId);
    }

    saveThenNew() {
      this.editDomainInfo.editDomainId = 0;
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
      this.dialogActivityInfoDetilVisible = true;
      console.log('点击选择的活动id为' + row.subsidyActivityId);
      this.$nextTick(() => this.editDomainInfo.editDomainId = row.subsidyActivityId);
    }

  }
</script>
