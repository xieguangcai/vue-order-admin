<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">
        卡号
        <el-input v-model="listQuery.cardNo" size="mini"></el-input>
        卡密
        <el-input v-model="listQuery.cardPwd" size="mini" style="width:180px;"></el-input>
        影视订单号
        <el-input v-model="listQuery.orderNo" size="mini" style="width:220px"></el-input>
        mac地址
        <el-input v-model="listQuery.mac" size="mini"></el-input>
        卡密状态
        <el-select size="mini" v-model="listQuery.cardStatus">
          <el-option value="" label="全部"/>
          <el-option v-for="item in cardInfoStatus" :label="item.label" :value="item.value" :key="item.value"/>
        </el-select>
        激活时间
        <el-date-picker size="mini"
                        v-model="listQuery.usedDate"
                        type="datetimerange"
                        range-separator="-"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00','23:59:59']"
                        :picker-options="pickerOptions"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
      </search-pane>
      <el-table v-loading="listLoading" height="600" style="width: 100%"
                :data="data"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row>

        <el-table-column align="left" label="卡密信息" width="300" fixed>
          <template slot-scope="scope">
            <div>
              <span>卡号：</span>[{{cardInfoStatusToName(scope.row.cardStatus, scope.row.cardBatch.cardBatchStatus)}}]
              {{ scope.row.cardNo}}<br/>
              <span>影视单号：</span>{{ scope.row.orderNo}}<br/>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="时间" width="240">
          <template slot-scope="scope">
            <div>
              <span>创建时间：</span>{{ scope.row.creatDate }}<br/>
              <span>使用时间：</span>{{ scope.row.usedDate }}<br/>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="资源信息" width="240">
          <template slot-scope="scope">
            <div>
              <span>名称：</span>{{ scope.row.cardResource != null ? scope.row.cardResource.cardResourceName : ''}}<br/>
              <span>erpCode:</span>{{ scope.row.cardResource != null ? scope.row.cardResource.erpCode : ''}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="批次信息" width="540">
          <template slot-scope="scope">
            <div>
              <span>批次名称：</span>{{ scope.row.cardBatch.cardBatchName }}<br/>
              <span>批次id：</span>{{ scope.row.cardPid }}
            </div>
          </template>
        </el-table-column>

        <el-table-column align="left" label="机器信息" width="200">
          <template slot-scope="scope">
            <div>
              <span>机型：</span>{{scope.row.tvModel}}
              <span>机芯：</span>{{ scope.row.tvChip }}
              <br/>
              <span>mac：</span>{{ scope.row.mac}}<br/>
            </div>
          </template>
        </el-table-column>

        <!--<el-table-column label="操作" align="center" fixed="right">-->
        <!--<template slot-scope="scope">-->
        <!--<el-tooltip content="查看该订单详情">-->
        <!--<el-button type="primary" size="mini" circle icon="el-icon-search"-->
        <!--@click="handleViewOrderInfoDetail(scope.$index, scope.row)"></el-button>-->
        <!--</el-tooltip>-->
        <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
      <search-page-pane @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :size="size"
                        :page="page"
                        :total="total"
                        slot="page">
      </search-page-pane>
      <!--<el-pagination-->
      <!--background-->
      <!--:current-page="page + 1"-->
      <!--@size-change="handleSizeChange"-->
      <!--@current-change="handleCurrentChange"-->
      <!--:page-sizes="[1,50, 100, 200, 300]"-->
      <!--:page-size="size"-->
      <!--layout="total, sizes, prev, pager, next, jumper"-->
      <!--:total="totalElements">-->
      <!--</el-pagination>-->
      <!--<el-dialog title="oss订单详情" :visible.sync="dialogDetilVisible" :append-to-body="true" :modal-append-to-body="false"-->
                 <!--width="80%" @close="editDomainInfo.editDomainId = 0">-->
        <!--<order-info-detail :domain-id="editDomainInfo.editDomainId"/>-->
      <!--</el-dialog>-->

    </list-table-pane>
  </div>
</template>


<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import SearchPane from '../../../components/SearchPane/index.vue';
import SearchPagePane from '../../../components/SearchPagePane/index.vue';
import {CardInfoListQuery, Pageable, ResponseResult, CardInfo} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {AxiosResponse} from 'axios';
import {AppModule} from '../../../store/modules/app';
// @ts-ignore
import qs from 'qs';
import BaseList from '../../../components/BaseList';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import {cardBatchStatusName, cardInfoStatusName, getCardInfoList} from '../../../api/pay';

interface EditDomain {
  editDomainId: number | undefined;
}

@Component({
  name: 'CardInfoList',
  components: {ListTablePane, SearchPane, SearchPagePane},
  filters: {},
  mixins: [BaseList],
})
export default class CardInfoList extends Vue {
  dialogDetilVisible: boolean = false;
  editDomainInfo: EditDomain = {editDomainId: 0};

  data: CardInfo[] = [];
  listQuery: CardInfoListQuery = {page: 0, size: 50, total: 0};


  get cardInfoStatus() {
    return AppModule.cardInfoStatus;
  }

  cardInfoStatusToName(code: number, cardBatchStatus: number) {
    if (code === 3) {
      return cardInfoStatusName(code);
    } else if (cardBatchStatus === 2) {
      return '批次' + cardBatchStatusName(cardBatchStatus);
    } else {
      return cardInfoStatusName(code);
    }
  }

  handleViewCardInfoDetail(index: number, row: CardInfo) {
    this.dialogDetilVisible = true;
    this.$nextTick(() => this.editDomainInfo.editDomainId = row.cardId);
  }

  realFetchData() {
    return getCardInfoList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<CardInfo>>>) => {
      const responseData = response.data.data;
      this.data = responseData.content;
      this.listQuery.page = responseData.number;
      this.listQuery.size = responseData.size;
      this.listQuery.total = responseData.totalElements;
    }).catch(handlerCommonError);
  }
}
</script>
