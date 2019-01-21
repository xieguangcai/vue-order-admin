<template>
    <div>
      <list-table-pane>

        <el-button-group slot="action" class="cc-action-button-group">
          <el-button type="success" icon="el-icon-circle-plus" size="mini" @click="addIframe"
                     >新建
          </el-button>
          <el-button type="danger" icon="el-icon-circle-close" size="mini" @click="handleDel"
                     >删除
          </el-button>
        </el-button-group>

        <search-pane slot="searchpane" @click="refetchData">
          <el-input v-model="listQuery.searchValue" size="mini" placeholder="弹窗ID"></el-input>
        </search-pane>

      <el-table v-loading="listLoading" :data="data"
                @selection-change="handleSelectionChange"
                border fit highlight-current-row>
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column label="id">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="appCode">
          <template slot-scope="scope">
            {{ scope.row.appCode }}
          </template>
        </el-table-column>
        <el-table-column label="scene">
          <template slot-scope="scope">
            {{ scope.row.scene }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{ scope.row.status | windowsStatus }}
          </template>
        </el-table-column>
        <el-table-column label="背景图">
          <template slot-scope="scope">
            {{ scope.row.background }}
          </template>
        </el-table-column>
        <el-table-column label="关闭按钮">
          <template slot-scope="scope">
            {{ scope.row.closeButton }}
          </template>
        </el-table-column>
        <el-table-column label="关闭按钮获焦">
          <template slot-scope="scope">
            {{ scope.row.closeButtonFocus }}
          </template>
        </el-table-column>
        <el-table-column label="取消按钮">
          <template slot-scope="scope">
            {{ scope.row.cancelButton }}
          </template>
        </el-table-column>
        <el-table-column label="取消按钮获焦">
          <template slot-scope="scope">
            {{ scope.row.cancelButtonFocus }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120px">
          <template slot-scope="scope">
            <el-tooltip content="查看">
              <el-button type="primary" size="mini" circle icon="el-icon-view"
                         @click="handleViewWindowsDetail(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="编辑" v-if="(scope.row.status === 1)">
              <el-button type="warning" size="mini" circle icon="el-icon-edit"
                         @click="handleEditLayoutDetail(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="上线" v-if="(scope.row.status === 1)">
              <el-button type="warning" size="mini" circle icon="el-icon-upload2"
                         @click="handleCopy(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="下线" v-if="(scope.row.status === 2)">
              <el-button type="warning" size="mini" circle icon="el-icon-download"
                         @click="handleCopy(scope.$index, scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

        <search-page-pane @size-change="handleSizeChange" @current-change="handleCurrentChange" :size="size" :page="page"
                          :total="total" slot="page"></search-page-pane>

      </list-table-pane>
    </div>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import SearchPane from '../../../components/SearchPane/index.vue';
  import SearchPagePane from '../../../components/SearchPagePane/index.vue';
  import ListTablePane from '../../../components/ListTablePane/index.vue';
  import {AutomaticDeductionIframe, Pageable, ResponseResult, IframeListQuery} from '../../../types';
  import {AxiosResponse} from 'axios';
  import {handlerCommonError} from '../../../utils/auth-interceptor';
  import BaseList from '../../../components/BaseList';
  import {
    getAutomaticDeductionIframeList,
    getAutomaticDeductionIframeDetail,
    deleteAutomaticDeductionIframe,
    editAutomaticDeductionIframe}
    from '../../../api/pay';
  import BaseTableDelete from "../../../components/BaseTableDelete";
  import RightComponent from "../../../components/RightComponent";
  import BaseTableDelete from '@/components/BaseTableDelete';
  @Component({
    name: 'autimaticDeductionIframeList',
    components: {ListTablePane, SearchPane, SearchPagePane},
    filters: {
      windowsStatus(value: number) {
        if (value === 0) {
          return '未使用';
        } else if (value === 1) {
          return '使用中';
        }
      },
    },
    mixins: [BaseList, BaseTableDelete, RightComponent],
  })
  export default class automaticDeductionIframeList extends Vue {
    data: AutomaticDeductionIframe[] = [];
    listQuery: IframeListQuery = {page: 0, size: 50, total: 0};
    // getViewContentName(scope: AutomaticDeductionIframe) {
    //   if ((scope.status === 1 || scope.status === 3)) {
    //     return '发布全网';
    //   } else {
    //     return '查看';
    //   }
    // }

    addIframe() {
      this.$router.push({path:'add-autimatic-deduction-iframe'});
    }

    handleDelRows(row: AutomaticDeductionIframe[]) {
        debugger;
      if (row.length === 0) {
        return;
      }
      const rowsId: Array<number | undefined> = [];
      row.forEach((item) => rowsId.push(item.id));
      this.$confirm('确认永久删除该活动信息吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        // 删除
        const {data} = await deleteAutomaticDeductionIframe(rowsId);
        this.$message({
          type: 'success',
          message: '删除成功',
        });
        // @ts-ignore
        this.realFetchData();
      }, async () => {
      }).catch(handlerCommonError);
    }

    handleViewWindowsDetail(index: number, row: AutomaticDeductionIframe) {
      this.$router.push({path: 'autimatic-deduction-iframe-detail', query: {id: '' + row.id}});
    }

    realFetchData() {
      return getAutomaticDeductionIframeList().then((response: AxiosResponse<ResponseResult<Pageable<AutomaticDeductionIframe>>>) => {
        debugger;
        const responseData = response.data.data;
        this.data = responseData.content;
        console.log(this.data);
        this.listQuery.page = responseData.number;
        this.listQuery.size = responseData.size;
        this.listQuery.total = responseData.totalElements;
      }).catch(handlerCommonError);
    }
    }


</script>

<style scoped>

</style>
