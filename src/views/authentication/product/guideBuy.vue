<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">

        ID
        <el-input v-model="listQuery.productId" size="mini" :clearable="true"></el-input>
        产品包标题
        <el-input v-model="listQuery.productTitle" size="mini" :clearable="true"></el-input>

      </search-pane>
      <el-table v-loading="listLoading" height="600" style="width: 100%"
                :data="data"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row>
        <el-table-column align="left" label="ID" width="100" fixed>
          <template slot-scope="scope">
             {{ scope.row.product.productId}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="标题" width="400">
          <template slot-scope="scope">
            {{ scope.row.product.productTitle}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="名称" width="200">
          <template slot-scope="scope">
            {{ scope.row.product.productName}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="时长" width="100">
          <template slot-scope="scope">
            {{productTypeToName(scope.row.product.productType)}}
          </template>
        </el-table-column>
        <el-table-column label="所属分类" width="200">
          <template slot-scope="scope">
            {{ scope.row.product.baseOrderSource.sourceName }}
          </template>
        </el-table-column>
        <el-table-column label="原价" width="100">
          <template slot-scope="scope">
            {{ scope.row.product.unitFee | NumFormat}} 元
          </template>
        </el-table-column>
        <el-table-column label="销售价" width="120">
          <template slot-scope="scope">
            <el-input size="mini" style="width: 80px"  @keyup.native="clearNoNum($event.target.value, scope.row.product)" @focus="focusPrice($event.target.value)" @blur="blurPrice($event.target.value, scope.row.product)" :value="scope.row.product.discountFee | NumFormat"></el-input>元
          </template>
        </el-table-column>
        <el-table-column label="唯一标识编码" width="240">
          <template slot-scope="scope">
            {{ scope.row.product.uniqueCode }}
          </template>
        </el-table-column>
        <el-table-column label="ERPCode" width="240">
          <template slot-scope="scope">
            {{ scope.row.product.erpCode }}
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="240">
          <template slot-scope="scope">
            {{ productStatusToName(scope.row.product.productStatus) }}
          </template>
        </el-table-column>
          <el-table-column label="状态" width="240">
          <template slot-scope="scope">
            {{ scope.row.product.flag == 0 ? '已启用' : '已停用' }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="320">
          <template slot-scope="scope">
            {{ scope.row.product.createdDate }}
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
  </div>
</template>


<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import SearchPane from '../../../components/SearchPane/index.vue';
import SearchPagePane from '../../../components/SearchPagePane/index.vue';
import {
  ProductChangprice,
  BaseOrderProducts,
  Pageable,
  ResponseResult,
  SearchHistoryModel,
} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {AxiosResponse} from 'axios';
import {getGuideBuyPageList, getProductChangeprice} from '../../../api/authentication/guideBuy';
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

export default class OrderProductChangpriceList extends Vue {

  data: ProductChangprice[] = [];
  listQuery: ProductChangprice = { page: 0, size: 50, total: 0, product: {}};
  price: number = 0;
  param: BaseOrderProducts = {};

  realFetchData() {
    return getGuideBuyPageList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<ProductChangprice>>>) => {
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

  productTypeToName(code: string) {
    return propertyToName(code, AppModule.productType);
  }

  productStatusToName(code: string) {
    return propertyToName(code, AppModule.productStatus);
  }

  businessTypeToName(code: string) {
    return propertyToName(code, AppModule.businessType);
  }

  blurPrice(value: number, row: BaseOrderProducts) {
    if (value === this.price) {
        return;
    }
    // 给出提示是否需要作出变更
    this.$confirm('确认要修改(' + row.productTitle + ' ID:' + row.productId + ') 产品包价格?', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      this.param.productId = row.productId;
      this.param.discountFee = value * 100;
      const data = await getProductChangeprice(this.param);
      if (data.data.success) {
        this.$message.success('修改成功');
        row.discountFee = this.param.discountFee;
      } else {
        this.$message.error( '修改失败！');
      }
    }).catch(() => {
      row.discountFee = this.price;
      this.$nextTick(() =>  row.discountFee = this.price * 100);
    });
  }

  focusPrice(value: number) {
      this.price = value;
  }

  clearNoNum(value: string, row: BaseOrderProducts) {
    let val: string = value;
    // 先把非数字的都替换掉，除了数字和.
    val = val.replace(/[^\d.]/g, '');
    // 必须保证第一个为数字而不是.
    val = val.replace(/^\./g, '');
    // 保证.只出现一次，而不能出现两次以上，
    val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
    // 只能输入小数点后2位
    if (val.substring(val.indexOf('.')).length > 3) {
        val = val.substring(0, val.indexOf('.') + 3);
    }
    if (value === val) {
        return;
    }
    row.discountFee = 0;
    this.$nextTick(() =>  row.discountFee = parseFloat(val).valueOf() * 100);
  }
}
</script>
