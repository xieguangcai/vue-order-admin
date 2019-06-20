<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">

        原产品包ID
        <el-input v-model="listQuery.mainProductId" size="mini" :clearable="true"></el-input>
        开通产品包ID
        <el-input v-model="listQuery.subProductId" size="mini" :clearable="true"></el-input>

        测试状态
        <el-select size="mini" v-model="listQuery.relationStatus">
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
             {{ scope.row.productRlsId}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="原产品包" width="240">
          <template slot-scope="scope">
            产品包ID:{{ scope.row.mainProductId}}<br/>
            产品包标题：{{ scope.row.mainProduct.productTitle}}<br/>
            产品包销售价：{{ scope.row.mainProduct.discountFee | NumFormat }} 元
          </template>
        </el-table-column>

        <el-table-column align="left" label="开通产品" width="240">
          <template slot-scope="scope">
            产品包ID:{{ scope.row.subProductId}}<br/>
            产品包标题：{{ scope.row.subProduct.productTitle}}<br/>
            产品包销售价：{{ scope.row.subProduct.discountFee | NumFormat }} 元
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            {{ scope.row.relationStatus == 1 ? "上架" : "下架"}}
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
  ProductRlsListQuery,
  ProductRls,
  Pageable,
  ResponseResult,
  SearchHistoryModel,
} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {AxiosResponse} from 'axios';
import {getProductRlsList} from '../../../api/authentication/productRls';
import BaseList from '../../../components/BaseList';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import {addDateFormatString} from '../../../utils/format-utils';
import {anyNotEmpty} from '../../../utils/validate';
import {AppModule, propertyToName} from '../../../store/modules/app';


@Component({
  components: {ListTablePane, SearchPane, SearchPagePane},
  filters: {
    NumFormat(value: number) {
      return (value / 100).toFixed(2);
    },
  },
  mixins: [BaseList],
})
export default class ProductRlsList extends Vue {

  data: ProductRls[] = [];
  listQuery: ProductRlsListQuery = { page: 0, size: 50, total: 0};

  realFetchData() {
    return getProductRlsList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<ProductRls>>>) => {
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
