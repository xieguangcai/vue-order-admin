<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">

        ID
        <el-input v-model="listQuery.productId" size="mini" :clearable="true"></el-input>
        产品包标题
        <el-input v-model="listQuery.productTitle" size="mini" :clearable="true"></el-input>
        供应商
        <el-input v-model="listQuery.company" size="mini" :clearable="true"></el-input>
        审核状态
        <el-select size="mini" v-model="listQuery.productStatus">
          <el-option value="" label="全部"/>
          <el-option v-for="item in productStatus" :label="item.label" :value="item.value" :key="item.value"/>
        </el-select>
        状态
        <el-select size="mini" v-model="listQuery.flag">
          <el-option value="" label="全部"/>
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
        <el-table-column align="left" label="ID" width="300" fixed>
          <template slot-scope="scope">
             {{ scope.row.productId}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="标题" width="400">
          <template slot-scope="scope">
            {{ scope.row.productTitle}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="名称" width="400">
          <template slot-scope="scope">
            {{ scope.row.productName}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="时长" width="200">
          <template slot-scope="scope">
            {{ productTypeToName(scope.row.productType) }}
          </template>
        </el-table-column>
        <el-table-column label="所属分类" width="240">
          <template slot-scope="scope">
            {{ scope.row.baseOrderSource.sourceName }}
          </template>
        </el-table-column>
        <el-table-column label="业务类型" width="240">
          <template slot-scope="scope">
            {{ businessTypeToName(scope.row.baseOrderSource.businessType) }}
          </template>
        </el-table-column>
        <el-table-column label="原价" width="240">
          <template slot-scope="scope">
            {{ scope.row.unitFee | NumFormat }} 元
          </template>
        </el-table-column>
        <el-table-column label="销售价" width="240">
          <template slot-scope="scope">
            {{ scope.row.discountFee | NumFormat }} 元
          </template>
        </el-table-column>
        <el-table-column label="唯一标识编码" width="240">
          <template slot-scope="scope">
            {{ scope.row.uniqueCode }}
          </template>
        </el-table-column>
        <el-table-column label="ERPCode" width="240">
          <template slot-scope="scope">
            {{ scope.row.erpCode }}
          </template>
        </el-table-column>
        <el-table-column label="MA参数" width="240">
          <template slot-scope="scope">
            {{ scope.row.openMaParams }}
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="240">
          <template slot-scope="scope">
            {{ productStatusToName(scope.row.productStatus) }}
          </template>
        </el-table-column>
          <el-table-column label="状态" width="240">
          <template slot-scope="scope">
            {{ scope.row.flag == 0 ? '已启用' : '已停用' }}
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
  ProductListQuery,
  BaseOrderProducts,
  Pageable,
  ResponseResult,
} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {AxiosResponse} from 'axios';
import {getProductList} from '../../../api/authentication/product';
import BaseList from '../../../components/BaseList';
import {handlerCommonError} from '../../../utils/auth-interceptor';
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
export default class OrderProductList extends Vue {


  data: BaseOrderProducts[] = [];
  listQuery: ProductListQuery = { page: 0, size: 50, total: 0};


  realFetchData() {
    return getProductList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<BaseOrderProducts>>>) => {
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

  productTypeToName(code: string) {
    return propertyToName(code, AppModule.productType);
  }
}
</script>
