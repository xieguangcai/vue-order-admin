<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">

        ID
        <el-input v-model="listQuery.policyId" size="mini" :clearable="true"></el-input>
        策略名称
        <el-input v-model="listQuery.policyName" size="mini" :clearable="true"></el-input>
        本地人群ID
        <el-input v-model="listQuery.localGroupId" size="mini" :clearable="true"></el-input>
        会员权益
        <el-select size="mini" v-model="listQuery.sourceId">
          <el-option v-for="item in this.sourceList" :label="item.sourceName" :key="item.sourceId" :value="item.sourceId" />
        </el-select>
        方案ID
        <el-input v-model="listQuery.schemeId" size="mini" :clearable="true"></el-input>
        状态
        <el-select size="mini" v-model="listQuery.schemeFlag">
          <el-option value="" label="全部"/>
          <el-option value="1" label="上架"/>
          <el-option value="0" label="下架"/>
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
             {{ scope.row.policyId}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="策略名称" width="240">
          <template slot-scope="scope">
            {{ scope.row.policyName}}
          </template>
        </el-table-column>
        <el-table-column label="会员权益" width="100">
          <template slot-scope="scope">
            {{ scope.row.source.sourceName }}
          </template>
        </el-table-column>
        <el-table-column label="关联方案" width="300">
          <template slot-scope="scope" >
            <span v-for="item in scope.row.policySchemeRls">{{item.schemeInfo == null ? '' : item.schemeInfo.schemeName+" (ID:"+item.schemeInfo.schemeId+")"}}<br/></span>
          </template>
        </el-table-column>
        <el-table-column label="优先级" width="100">
          <template slot-scope="scope">
            {{ scope.row.priority }}
          </template>
        </el-table-column>
        <el-table-column label="本地人群名称" width="200">
          <template slot-scope="scope">
            {{ scope.row.actLocalGroupInfo == null ? '' : scope.row.actLocalGroupInfo.localGroupName  }}(ID:{{ scope.row.actLocalGroupInfo == null ? '' : scope.row.actLocalGroupInfo.localGroupId }})
          </template>
        </el-table-column>
        <el-table-column label="有效期" width="240">
          <template slot-scope="scope">
            开始时间：{{ scope.row.policyStartTime }}<br/>
            结束时间：{{ scope.row.policyEndTime }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            {{scope.row.policyStatus }}
          </template>
        </el-table-column>
        <el-table-column label="审核人" width="100">
          <template slot-scope="scope">
            {{ scope.row.auditor }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" fixed="right">
          <!--<template slot-scope="scope">-->
            <!--<el-tooltip content="查看该订单详情">-->
              <!--<el-button type="primary" size="mini" circle icon="el-icon-search"-->
                         <!--@click=""></el-button>-->
            <!--</el-tooltip>-->
            <!--<el-tooltip content="尝试查看该订单支付详情">-->
              <!--<el-button type="success" size="mini" circle icon="el-icon-search"-->
                         <!--@click=""></el-button>-->
            <!--</el-tooltip>-->
          <!--</template>-->
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
  </div>
</template>


<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import SearchPane from '../../../components/SearchPane/index.vue';
import SearchPagePane from '../../../components/SearchPagePane/index.vue';
import {
  Policy,
  Company,
  BaseOrderSource,
  Pageable,
  ResponseResult,
  SearchHistoryModel,
} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {AxiosResponse} from 'axios';
import {getPolicyList} from '../../../api/authentication/policy';
import {getCompanyList} from '../../../api/authentication/company';
import {getSourceListByCompany} from '../../../api/authentication/source';
import BaseList from '../../../components/BaseList';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import {addDateFormatString} from '../../../utils/format-utils';
import {anyNotEmpty} from '../../../utils/validate';
import {AppModule, propertyToName} from '../../../store/modules/app';


@Component({
  components: {ListTablePane, SearchPane, SearchPagePane},
  filters: {},
  mixins: [BaseList],
})
export default class OrderSchemeList extends Vue {

  data: Policy[] = [];
  listQuery: Policy = { page: 0, size: 50, total: 0};
  companyList: Company[] = [];
  sourceList: BaseOrderSource[] = [];

  created() {
    getCompanyList().then((resolve) => {
      this.companyList = resolve.data.data;
    }).catch(handlerCommonError);
  }

  realFetchData() {
    return getPolicyList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<Policy>>>) => {
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

  selectCompany(company: string) {
    getSourceListByCompany(company).then((resolve) => {
      this.sourceList = resolve.data.data;
//      this.listQuery.sourceId = '';
    }).catch(handlerCommonError);
  }
}
</script>
