<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">

        ID
        <el-input v-model="listQuery.schemeId" size="mini" :clearable="true"></el-input>
        分类名称
        <el-input v-model="listQuery.schemeName" size="mini" :clearable="true"></el-input>
        供应商
        <el-select size="mini" v-model="listQuery.company" @change="selectCompany">
          <el-option value="" label="全部"/>
          <el-option v-for="item in this.companyList" :label="item.companyCnName" :key="item.company" :value="item.company" />
        </el-select>
        会员权益
        <el-select size="mini" v-model="listQuery.sourceId">
          <el-option v-for="item in this.sourceList" :label="item.sourceName" :key="item.sourceId" :value="item.sourceId" />
        </el-select>
        使用场景
        <el-select size="mini" v-model="listQuery.usageScenario">
          <el-option value="" label="全部"/>
          <el-option v-for="item in this.schemeScene" :label="item.label" :key="item.company" :value="item.value" />
        </el-select>
        测试状态
        <el-select size="mini" v-model="listQuery.schemeStatus">
          <el-option value="" label="全部"/>
          <el-option v-for="item in this.schemeStatus" :label="item.label" :value="item.value" :key="item.value"/>
        </el-select>
        方案状态
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
        <el-table-column align="left" label="ID" width="300" fixed>
          <template slot-scope="scope">
             {{ scope.row.schemeId}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="方案名称" width="400">
          <template slot-scope="scope">
            {{ scope.row.schemeName}}
          </template>
        </el-table-column>

        <el-table-column align="left" label="供应商" width="200">
          <template slot-scope="scope">
            {{ scope.row.baseOrderSource.baseOrderCompany == null ? '' :  scope.row.baseOrderSource.baseOrderCompany.companyCnName}}
          </template>
        </el-table-column>
        <el-table-column label="会员权益" width="240">
          <template slot-scope="scope">
            {{ scope.row.baseOrderSource.sourceName }}
          </template>
        </el-table-column>
        <el-table-column label="业务类型" width="240">
          <template slot-scope="scope">
            {{ businessTypeToName(scope.row.baseOrderSource.businessType) }}
          </template>
        </el-table-column>
        <el-table-column label="使用场景" width="240">
          <template slot-scope="scope">
            {{ scope.row.usageScenario }}
          </template>
        </el-table-column>
        <el-table-column label="版本" width="240">
          <template slot-scope="scope">
            {{ scope.row.schemeCurrentVersion }}
          </template>
        </el-table-column>
        <el-table-column label="待测试版本" width="240">
          <template slot-scope="scope">
            {{ scope.row.schemeDuplicateVersion }}
          </template>
        </el-table-column>
        <el-table-column label="方案状态" width="240">
          <template slot-scope="scope">
            {{ scope.row.schemeFlag == 1 ? '上架' : '下架' }}
          </template>
        </el-table-column>
        <el-table-column label="测试状态" width="240">
          <template slot-scope="scope">
            {{ schemeStatusToName(scope.row.schemeStatus) }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="320">
          <template slot-scope="scope">
            {{ scope.row.createdDate }}
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
  SchemeInfoListQuery,
  SchemeInfo,
  Company,
  BaseOrderSource,
  Pageable,
  ResponseResult,
  SearchHistoryModel,
} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {AxiosResponse} from 'axios';
import {getSchemePageList} from '../../../api/authentication/scheme';
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

  data: SchemeInfo[] = [];
  listQuery: SchemeInfoListQuery = { page: 0, size: 50, total: 0};
  companyList: Company[] = [];
  sourceList: BaseOrderSource[] = [];

  created() {
    getCompanyList().then((resolve) => {
      this.companyList = resolve.data.data;
    }).catch(handlerCommonError);
  }

  realFetchData() {
    return getSchemePageList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<SchemeInfo>>>) => {
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

  get schemeStatus() {
    return AppModule.schemeStatus;
  }

  get schemeScene() {
    return AppModule.schemeScene;
  }

  schemeStatusToName(code: string) {
    return propertyToName(code, AppModule.schemeStatus);
  }

  businessTypeToName(code: string) {
    return propertyToName(code, AppModule.businessType);
  }

  selectCompany(company: string) {
    getSourceListByCompany(company).then((resolve) => {
      this.sourceList = resolve.data.data;
//      this.listQuery.sourceId = '';
    }).catch(handlerCommonError);
  }
}
</script>
