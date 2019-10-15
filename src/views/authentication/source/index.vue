<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">

        ID
        <el-input v-model="listQuery.sourceId" size="mini" :clearable="true"></el-input>
        分类名称
        <el-input v-model="listQuery.sourceName" size="mini" :clearable="true"></el-input>
        供应商
        <el-select size="mini" v-model="listQuery.company" :clearable="true">
          <el-option v-for="item in this.companyList" :label="item.companyCnName" :key="item.company" :value="item.company" />
        </el-select>
        审核状态
        <el-select size="mini" v-model="listQuery.sourceStatus" :clearable="true">
          <el-option v-for="item in productStatus" :label="item.label" :value="item.value" :key="item.value"/>
        </el-select>
        状态
        <el-select size="mini" v-model="listQuery.flag" :clearable="true">
          <el-option value="0" label="已启用"/>
          <el-option value="1" label="已停用"/>
        </el-select>

      </search-pane>
      <el-table v-loading="listLoading" height="600" style="width: 100%"
                :data="data"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row>
        <el-table-column align="left" label="ID" width="80" fixed>
          <template slot-scope="scope">
             {{ scope.row.sourceId}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="分类名称" width="200">
          <template slot-scope="scope">
            <a style="color: cornflowerblue">{{ scope.row.sourceName}}</a>
          </template>
        </el-table-column>
        <el-table-column label="权益标识" width="150">
          <template slot-scope="scope">
            {{ scope.row.sourceSign }}
          </template>
        </el-table-column>
        <el-table-column label="业务类型" width="150">
          <template slot-scope="scope">
            {{ businessTypeToName(scope.row.businessType) }}
          </template>
        </el-table-column>
        <el-table-column align="left" label="供应商" width="200">
          <template slot-scope="scope">
            {{ scope.row.baseOrderCompany == null ? '' :  scope.row.baseOrderCompany.companyCnName}}
          </template>
        </el-table-column>
        <el-table-column label="客户端显示排序" width="150">
          <template slot-scope="scope">
            <el-input-number size="small" precision="0" v-model="scope.row.clientSort" :min="0" :step="1"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="150">
          <template slot-scope="scope">
            {{ productStatusToName(scope.row.sourceStatus) }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.createdDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" fixed="right">
          <template slot-scope="scope">
            <el-tooltip placement="top" content="编辑" effect="dark" v-if="scope.row.sourceStatus!=4">
              <el-button type="primary" circle size="mini" icon="el-icon-edit"
                         @click="edit(scope.row.sourceId)"></el-button>
            </el-tooltip>
            <el-tooltip placement="top" content="启用" effect="dark" v-if="scope.row.flag==1">
              <el-button type="primary" circle size="mini" icon="el-icon-bell"
                         @click="update(scope.row.sourceId, 0)"></el-button>
            </el-tooltip>

            <el-tooltip placement="top" content="停用" effect="dark" v-if="scope.row.flag==0">
              <el-button type="primary" circle size="mini" icon="el-icon-bell"
                         @click="update(scope.row.sourceId, 1)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
     <search-page-pane @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :size="size"
                       :page="page"
                       :total="total"
                       slot="page">
      </search-page-pane>

      <el-dialog class="addDialog"	 title="编辑" :visible.sync="editDialogVisible" :close-on-click-modal="false">
        <source-edit :source-id="sourceId">

        </source-edit>
      </el-dialog>

    </list-table-pane>
  </div>
</template>


<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import SearchPane from '../../../components/SearchPane/index.vue';
import SearchPagePane from '../../../components/SearchPagePane/index.vue';
import {
  SourceListQuery,
  BaseOrderSource,
  Company,
  Pageable,
  ResponseResult,
  SearchHistoryModel,
} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import SourceEdit from './edit.vue';
import {AxiosResponse} from 'axios';
import {getSourcePageList,updateFlag} from '../../../api/authentication/source';
import {getCompanyList} from '../../../api/authentication/company';
import BaseList from '../../../components/BaseList';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import {addDateFormatString} from '../../../utils/format-utils';
import {anyNotEmpty} from '../../../utils/validate';
import {AppModule, propertyToName} from '../../../store/modules/app';


@Component({
  components: {ListTablePane, SearchPane, SearchPagePane, SourceEdit},
  filters: {},
  mixins: [BaseList],
})
export default class OrderSourceList extends Vue {

  data: BaseOrderSource[] = [];
  listQuery: SourceListQuery = { page: 0, size: 50, total: 0};
  companyList: Company[] = [];
  editDialogVisible: boolean = false;
  sourceId: number = 0;


  created() {
    getCompanyList().then((resolve) => {
      this.companyList = resolve.data.data;
    }).catch(handlerCommonError);
  }

  realFetchData() {
    return getSourcePageList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<BaseOrderSource>>>) => {
      const responseData = response.data.data;
      this.data = responseData.content;
      this.listQuery.page = responseData.number;
      this.listQuery.size = responseData.size;
      this.listQuery.total = responseData.totalElements;
    }).catch(handlerCommonError);
  }

  validSearchCondition(): boolean {

    return true;
  }

  get productStatus() {
    return AppModule.productStatus;
  }

  productStatusToName(code: string) {
    return propertyToName(code, AppModule.productStatus);
  }

  businessTypeToName(code: string) {
    return propertyToName(code, AppModule.businessType);
  }

  update(id: number, status: number) {
    let des: string;
    if (status === 0) {
      des = '启用';
    } else if (status === 1) {
      des = '停用';
    } else {
      return;
    }
    this.$confirm('确定要' + des + '操作吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      updateFlag(id, status).then((response: AxiosResponse<ResponseResult<boolean>>) => {
        if (response.data.success && response.data.data) {
          // 保存成功
          this.$message({
            message: '状态更新成功',
            type: 'success',
          });
          this.realFetchData(); // 重新加载数据
        } else {
          // 保存失败
          this.$message.error('状态更新成功');
        }
      });
    }).catch(() => {

    });
  }

  edit(id: number) {
    this.editDialogVisible = true;
    this.$nextTick(() => this.sourceId = id);
  }

}
</script>
