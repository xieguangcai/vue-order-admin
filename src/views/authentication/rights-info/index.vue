<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">

        权益名称
        <el-input v-model="listQuery.rightsName" size="mini" :clearable="true"></el-input>
        权益标识
        <el-input v-model="listQuery.sourceSign" size="mini" :clearable="true"></el-input>
      </search-pane>

      <el-button-group slot="action" class="cc-action-button-group">
        <el-button type="success" icon="el-icon-circle-plus" size="mini" @click="add()">新建</el-button>
      </el-button-group>

      <el-table v-loading="listLoading" height="600" style="width: 100%"
                :data="data"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row>
        <el-table-column align="left" label="ID" width="80" fixed>
          <template slot-scope="scope">
             {{ scope.row.rightsId}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="权益名称" width="200">
          <template slot-scope="scope">
            <el-tooltip placement="right" effect="light">
              <div slot="content">
                ID：{{ scope.row.rightsId}}<br/>
                权益名称：{{ scope.row.rightsName}}<br/>
                权益标识：{{scope.row.sourceSign}}<br/>
                供应商：{{ scope.row.baseOrderCompany.companyCnName }}<br/>
                业务类型：{{ businessTypeToName(scope.row.businessType) }}<br/>
              </div>
              <a style="color: cornflowerblue">{{ scope.row.rightsName}}</a>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column align="left" label="权益标识" width="200">
          <template slot-scope="scope">
            {{scope.row.sourceSign}}
          </template>
        </el-table-column>
        <el-table-column label="供应商" width="240">
          <template slot-scope="scope">
            {{ scope.row.baseOrderCompany.companyCnName }}
          </template>
        </el-table-column>
        <el-table-column label="业务类型" width="100">
          <template slot-scope="scope">
            {{ businessTypeToName(scope.row.businessType) }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="320">
          <template slot-scope="scope">
            {{ scope.row.createdDate }}
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

    </list-table-pane>

    <el-dialog title="新增权益" :visible.sync="dialogFormVisible" :close-on-click-modal="false" >
      <div style="text-align:center;width: 100%">
        <el-form :model="form" :rules="rules" ref="OrderRightsInfoList">
          <div class="inputClass">
            <el-form-item label="供应商" :label-width="formLabelWidth" prop="company">
              <el-select v-model="form.company" clearable="true">
                <el-option v-for="item in this.companyList" :label="item.companyCnName" :key="item.company" :value="item.company" />
              </el-select>
            </el-form-item>
            <el-form-item label="权益名称" :label-width="formLabelWidth" prop="rightsName">
              <el-input v-model="form.rightsName" clearable="true"></el-input>
            </el-form-item>
            <el-form-item label="权益标识" :label-width="formLabelWidth" prop="sourceSign">
              <el-input v-model="form.sourceSign" clearable="true"></el-input>
            </el-form-item>
            <el-form-item label="业务类型" :label-width="formLabelWidth" prop="businessType">
              <el-select v-model="form.businessType" clearable="true">
                <el-option v-for="item in this.businessTypes" :label="item.label" :key="item.value" :value="item.value" />
              </el-select>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm()">保 存</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>


<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import SearchPane from '../../../components/SearchPane/index.vue';
import SearchPagePane from '../../../components/SearchPagePane/index.vue';
import {
  RightsInfoListQuery,
  RightsInfo,
  Company,
  Pageable,
  ResponseResult,
  SearchHistoryModel,
} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {AxiosResponse} from 'axios';
import {getRightsInfoList, saveData} from '../../../api/authentication/rightsInfo';
import {getCompanyList} from '../../../api/authentication/company';
import BaseList from '../../../components/BaseList';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import {addDateFormatString} from '../../../utils/format-utils';
import {anyNotEmpty} from '../../../utils/validate';
import {ElForm} from 'element-ui/types/form';
import {AppModule, propertyToName} from '../../../store/modules/app';


@Component({
  components: {ListTablePane, SearchPane, SearchPagePane},
  filters: {},
  mixins: [BaseList],
})
export default class OrderRightsInfoList extends Vue {

  dialogFormVisible = false;
  form: RightsInfo = {};
  data: RightsInfo[] = [];
  listQuery: RightsInfoListQuery = { page: 0, size: 50, total: 0};
  companyList: Company[] = [];

  rules = {
    rightsName: [
      {required: true, message: '请输入权益名称', trigger: 'blur'},
    ],
    company: [
      {required: true, message: '请选择供应商', trigger: 'blur'},
    ],
    sourceSign: [
      {required: true, message: '请输入权益标识', trigger: 'blur'},
    ],
    businessType: [
      {required: true, message: '请选择业务类型', trigger: 'blur'},
    ],
  };

  created() {
    getCompanyList().then((resolve) => {
      this.companyList = resolve.data.data;
    }).catch(handlerCommonError);
  }

  realFetchData() {
    return getRightsInfoList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<RightsInfo>>>) => {
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

  get businessTypes() {
    return AppModule.businessType;
  }

  businessTypeToName(code: string) {
    return propertyToName(code, AppModule.businessType);
  }

  getElForm(): ElForm {
    return this.$refs.OrderRightsInfoList as ElForm;
  }

  add() {
    if (this.getElForm() !== undefined) {
      this.getElForm().resetFields();
    }
    this.dialogFormVisible = true;
  }

  submitForm() {
    // 必填项
    this.getElForm().validate((valid: boolean) => {
      if (valid) {
        saveData(this.form).then((response: AxiosResponse<ResponseResult<boolean>>) => {
          if (response.data.success && response.data.data) {
            // 保存成功
            this.dialogFormVisible = false;
            this.$message({
              message: '保存供应商信息成功',
              type: 'success',
            });
            this.realFetchData(); // 重新加载数据
          } else {
            // 保存失败
            this.dialogFormVisible = false;
            this.$message.error('保存供应商信息失败');
          }
        }).catch(handlerCommonError);
      } else {
        return false;
      }
    });
  }

}
</script>
