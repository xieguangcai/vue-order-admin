<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">
        手机号
        <el-input v-model="listQuery.mobile" size="mini" :clearable="true"></el-input>
      </search-pane>
      <el-button-group slot="action" class="cc-action-button-group">
        <el-button type="success" icon="el-icon-circle-plus" size="mini" @click="handleNew">新增手机号</el-button>
      </el-button-group>
      <el-table v-loading="listLoading" height="600" style="width: 100%"
                :data="data"
                element-loading-text="Loading"
                @selection-change="handleSelectionChange"
                border
                fit
                highlight-current-row>
        <el-table-column align="left" label="ID" width="200" fixed>
          <template slot-scope="scope">
             {{ scope.row.id}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="手机号" width="400">
          <template slot-scope="scope">
            {{ scope.row.mobile}}
          </template>
        </el-table-column>

        <el-table-column align="left" label="创建人" width="200">
          <template slot-scope="scope">
            {{scope.row.createBy}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center"  width="100">
          <template slot-scope="scope">
            <el-tooltip content="编辑">
              <el-button type="primary" size="mini" circle icon="el-icon-edit"
                         @click="handleEdit(scope.$index, scope.row)"></el-button>
            </el-tooltip>

            <el-tooltip content="删除" slot="reference">
              <el-button type="danger" circle size="mini" icon="el-icon-delete"
                         @click="handleDelRows([scope.row])"></el-button>
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

    </list-table-pane>

    <el-dialog title="编辑测试手机号" :visible.sync="dialogEditFormVisible" :close-on-click-modal="false" width="600px">
      <user-phone-edit @cancel="dialogEditFormVisible=false;editDomainInfo.editDomainId = 0;" :domain-id="editDomainInfo.editDomainId"
                        @save-success-then-new="saveThenNew"
                        @save-success="()=>{this.dialogEditFormVisible=false;fetchData();this.editDomainInfo.editDomainId = 0;}"/>
    </el-dialog>
  </div>
</template>


<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import SearchPane from '../../../components/SearchPane/index.vue';
import SearchPagePane from '../../../components/SearchPagePane/index.vue';
import {UserPhoneListQuery, UserPhone, Pageable, ResponseResult, SearchHistoryModel} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import UserPhoneEdit from './edit.vue';
import {AxiosResponse} from 'axios';
import {getUserPhonePageList, deleteUserPhone} from '../../../api/userPhone';
import BaseList from '../../../components/BaseList';
import BaseTableDelete from '../../../components/BaseTableDelete';
import {handlerCommonError} from '../../../utils/auth-interceptor';
interface EditDomain {
  editDomainId: number | undefined;
}

@Component({
  components: {UserPhoneEdit, ListTablePane, SearchPane, SearchPagePane},
  filters: {},
  mixins: [BaseList],
})
export default class UserPhoneList extends Vue {

  dialogEditFormVisible: boolean = false;
  editDomainInfo: EditDomain = {editDomainId: 0};
  data: UserPhone[] = [];
  listQuery: UserPhoneListQuery = { page: 0, size: 50, total: 0};

  handleNew() {
    // 创建新用户弹窗
    this.dialogEditFormVisible = true;
    this.editDomainInfo.editDomainId = 0;
  }

  handleEdit(index: number, row: UserPhone): void {
    this.dialogEditFormVisible = true;
    this.$nextTick(() => this.editDomainInfo.editDomainId = row.id);
  }
  saveThenNew() {
    this.editDomainInfo.editDomainId = 0;
    // @ts-ignore
    this.fetchData();
  }

  handleDelRows(row: UserPhone[]) {
    if (row.length === 0) {
      return;
    }
    const rowsId: Array<number | undefined> = [];
    row.forEach((item) => rowsId.push(item.id));

    this.$confirm('确认永久删除该测试手机号吗?', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      // 删除
      const {data} = await deleteUserPhone(rowsId);
      this.$message({
        type: 'success',
        message: '删除成功',
      });
      // @ts-ignore
      this.fetchData();

    }).catch(() => {
    });
  }

  realFetchData() {
    return getUserPhonePageList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<UserPhone>>>) => {
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
}
</script>
