<template>
  <div v-loading="listLoading">
    <div v-if="data != null">
      <div v-if="data.reciveInfo.haveGift">
        <h3><span class="el-icon-success" style="color:green;">【有】黄金VIP领取资格</span></h3>
        <table class="cc-order-table">
          <tr>
            <td>有效期</td>
            <td>{{data.reciveInfo.giftReceiveTime}}</td>
            <td>最后领取时间</td>
            <td>{{data.reciveInfo.giftReceiveDeadline}}</td>
          </tr>
        </table>
      </div>
      <div v-else>
        <h3><span class="el-icon-error" style="color:red;">【无】黄金VIP领取资格</span></h3>
      </div>
    </div>
    <h4>赠送及领取历史记录</h4>
    <el-table height="400" style="width: 100%"
              :data="getData()"
              element-loading-text="Loading"
              :row-class-name="tableRowClassName"
              border
              fit
              size="mini"
              highlight-current-row>
      <el-table-column align="left" label="影视订单" width="180">
        <template slot-scope="scope">
          <div>
            {{ scope.row.originalOrder }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="状态" width="80">
        <template slot-scope="scope">
          <div>
            {{ getStatus(scope.row.status) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="天数" width="80">
        <template slot-scope="scope">
          <div>
            {{ scope.row.amount }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="领取截止时间" width="160">
        <template slot-scope="scope">
          <div>
            {{ scope.row.takeDeadline}}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="领取手机号" width="120">
        <template slot-scope="scope">
          <div>
            {{ scope.row.takeMobile}}
          </div>
        </template>
      </el-table-column>

      <el-table-column align="left" label="领取时间" width="200">
        <template slot-scope="scope">
          <div>
            {{ scope.row.takeTime }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="爱奇艺id" width="100">
        <template slot-scope="scope">
          <div>
            {{ scope.row.takeUid}}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
  import SearchPane from '../../../components/SearchPane/index.vue';
  import SearchPagePane from '../../../components/SearchPagePane/index.vue';
  import {
    IqiyiGoldVipPresentHistory,
    IqiyiGoldVipQueryList, OrderPermissionsInfo,
    ResponseResult,
  } from '../../../types';
  import ListTablePane from '../../../components/ListTablePane/index.vue';
  import {AxiosResponse} from 'axios';
  import {handlerCommonError} from '../../../utils/auth-interceptor';
  import {getIqiyiGoldVipQueryList} from '../../../api/authentication';

  export interface PermissionQueryDomain {
    coocaaOpenId: string;
    thirdOpenId: string;
    permissionsType: string;

  }

  @Component({
    name: 'IqiyiGoldVipList',
    components: {ListTablePane, SearchPane, SearchPagePane},
    filters: {},
    mixins: [],
  })
  export default class IqiyiGoldVipList extends Vue {
    @Prop({})
      // @ts-ignore
    openId: string;
    loadingData: boolean = false;
    data: IqiyiGoldVipQueryList = {};

    getData(): IqiyiGoldVipPresentHistory[] {
      if (this.data.historyInfo != null) {
        return this.data.historyInfo.history
      }
      return [];
    }

    getStatus(status: number): string {
      let statusName = '';
      switch (status) {
        case 0:
          statusName = '成功领取';
          break;
        case 1:
          statusName = '待领取';
          break;
        case 2:
          statusName = '领取失败';
          break;
        case 3:
          statusName = '已领取的退单';
          break;
        case 4:
          statusName = '未领取的退单';
          break;
      }

      return statusName;
    }

    tableRowClassName({row, rowIndex}: { row: OrderPermissionsInfo, rowIndex: number }) {
      if (row.endDate !== undefined) {
        if (new Date(row.endDate) < new Date()) {
          return 'warning-row';
        }
      }
    }

    @Watch('openId')
    openIdChange(newVal: string, oldVal: string) {
      console.log('正在加载爱奇艺黄金VIP信息')
      if (this.loadingData) {
        return;
      }
      if (newVal === oldVal) {
        return;
      }
      this.loadingData = true;
      this.realFetchData().finally(() => {
        this.loadingData = false;
      });
    }

    realFetchData() {
      if (this.openId === undefined) {
        return Promise.reject();
      }

      return getIqiyiGoldVipQueryList(this.openId).then((response: AxiosResponse<ResponseResult<IqiyiGoldVipQueryList>>) => {
        this.data = response.data.data;
      }).catch(handlerCommonError);
    }
  }
</script>
