<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">

        供应商名称
        <el-input v-model="listQuery.companyCnName" size="mini" :clearable="true"></el-input>
        供应商标识
        <el-input v-model="listQuery.company" size="mini" :clearable="true"></el-input>
        状态
        <el-select size="mini" v-model="listQuery.flag">
          <el-option value="" label="全部"/>
          <el-option value="1" label="已启用"/>
          <el-option value="0" label="已停用"/>
        </el-select>
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
            {{ scope.row.id}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="供应商名称" width="400">
          <template slot-scope="scope">
            <el-tooltip placement="right" effect="light">
              <div slot="content">
                ID：{{ scope.row.id}}<br/>
                供应商名称：{{ scope.row.companyCnName}}<br/>
                供应商标识：{{scope.row.company}}<br/>
                OSS商户编码：{{ scope.row.appcode }}<br/>
                秘钥：{{ scope.row.appkey }}<br/>
                状态：{{ scope.row.flag == 1 ? '已启用' : '已停用' }}<br/>
              </div>
              <el-link type="primary" :underline="false">{{ scope.row.companyCnName}}</el-link>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column align="left" label="供应商标识" width="200">
          <template slot-scope="scope">
            {{scope.row.company}}
          </template>
        </el-table-column>
        <el-table-column label="OSS商户编码" width="200">
          <template slot-scope="scope">
            {{ scope.row.appcode }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="200">
          <template slot-scope="scope">
            {{ scope.row.flag == 1 ? '已启用' : '已停用' }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="320">
          <template slot-scope="scope">
            {{ scope.row.createdDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" fixed="right">
          <template slot-scope="scope">
            <el-tooltip placement="top" content="编辑" effect="dark">
              <el-button type="primary" circle size="mini" icon="el-icon-edit"
                         @click="edit(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip placement="top" content="启用" effect="dark" v-if="scope.row.flag==0">
              <el-button type="primary" circle size="mini" icon="el-icon-open"
                         @click="update(scope.row.id, 1)"></el-button>
            </el-tooltip>

            <el-tooltip placement="top" content="停用" effect="dark" v-if="scope.row.flag==1">
              <el-button type="primary" circle size="mini" icon="el-icon-turn-off"
                         @click="update(scope.row.id, 0)"></el-button>
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

      <el-dialog title="新增供应商" :visible.sync="dialogFormVisible">
        <div style="text-align:center;width: 100%">
          <el-form :model="form" :rules="rules" ref="OrderCompanyList">
            <div class="inputClass">
              <el-form-item label="供应商名称" :label-width="formLabelWidth" prop="companyCnName">
                <el-input v-model="form.companyCnName"></el-input>
              </el-form-item>
              <el-form-item label="标识" :label-width="formLabelWidth" prop="company">
                <el-input v-model="form.company"></el-input>
              </el-form-item>
              <el-form-item label="APPCODE" :label-width="formLabelWidth" prop="appcode">
                <el-input v-model="form.appcode"></el-input>
              </el-form-item>
              <el-form-item label="秘钥" :label-width="formLabelWidth" prop="appkey">
                <el-input v-model="form.appkey"></el-input>
              </el-form-item>
              <el-form-item label="状态" :label-width="formLabelWidth" style="display: none">
                <el-input v-model="form.flag"></el-input>
              </el-form-item>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm()">保 存</el-button>
          </div>
        </div>
      </el-dialog>

    </list-table-pane>
  </div>
</template>


<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import SearchPane from '../../../components/SearchPane/index.vue';
import SearchPagePane from '../../../components/SearchPagePane/index.vue';
import {
  CompanyListQuery,
  Company,
  Pageable,
  ResponseResult,
  SearchHistoryModel,
} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {AxiosResponse} from 'axios';
import {getCompanyPageList, addCompany, getCompanyById, updateStatus} from '../../../api/authentication/company';
import BaseList from '../../../components/BaseList';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import {addDateFormatString} from '../../../utils/format-utils';
import {anyNotEmpty} from '../../../utils/validate';
import {ElForm} from 'element-ui/types/form';

@Component({
  components: {ListTablePane, SearchPane, SearchPagePane},
  filters: {},
  mixins: [BaseList],
})
export default class OrderCompanyList extends Vue {

  dialogFormVisible = false;
  form: Company = {flag: 0};
  data: Company[] = [];
  listQuery: CompanyListQuery = {page: 0, size: 50, total: 0};
  rules = {
    companyCnName: [
      {required: true, message: '请输入供应商名称', trigger: 'blur'},
    ],
    company: [
      {required: true, message: '请输入标识', trigger: 'blur'},
    ],
    appcode: [
      {required: true, message: '请输入APPCODE', trigger: 'blur'},
    ],
    appkey: [
      {required: true, message: '请输入秘钥', trigger: 'blur'},
    ],
  };


  realFetchData() {
    return getCompanyPageList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<Company>>>) => {
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

  getElForm(): ElForm {
    return this.$refs.OrderCompanyList as ElForm;
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
        addCompany(this.form).then((response: AxiosResponse<ResponseResult<boolean>>) => {
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

  edit(id: number) {
    if (this.getElForm() !== undefined) {
      this.getElForm().resetFields();
    }
    this.dialogFormVisible = true;
    getCompanyById(id).then((response: AxiosResponse<ResponseResult<Company>>) => {
      this.form = response.data.data;
    });
  }

  update(id: number, status: number) {
      let des: string;
      if (status === 1) {
          des = '启用';
      } else if (status === 0) {
          des = '停用';
      } else {
          return;
      }
      this.$confirm('确定要' + des + '操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        updateStatus(id, status).then((response: AxiosResponse<ResponseResult<boolean>>) => {
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
}
</script>

<style>
  .inputClass {
    width: 350px;
    text-align: center;
  }
</style>
