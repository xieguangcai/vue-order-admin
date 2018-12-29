<template>
  <div>

    <el-tabs type="border-card">
      <el-tab-pane label="会员业务订单详情">
        <el-collapse v-model="activeNames">
          <el-collapse-item :title="'会员业务订单详情['+ domainInfo.orderNo +']'" name="1">
            <table class="cc-order-table cc-inline-title-table" cellpadding="0" cellspacing="0">
              <tr>
                <td>订单状态</td>
                <td>
                  <span :class="tableRowClassName(domainInfo.payFlag + '')">{{ domainInfo.payFlag === 1 ? '已支付' : '未支付' }}</span>
                </td>
                <td>订单信息</td>
                <td colspan="5"><span class="order-amount">[{{domainInfo.totalPayFee / 100 }}元]</span>{{ domainInfo.title }}</td>
              </tr>
              <tr>
                <td>订单时间</td>
                <td>{{ domainInfo.createTime }}</td>
                <td>支付时间</td>
                <td>{{ domainInfo.payTime }}</td>
                <td>开通时间</td>
                <td>{{ domainInfo.synDatetime }}</td>
                <td>修改时间</td>
                <td>{{ domainInfo.lastUpdateTime }}</td>
              </tr>
              <tr>
                <td>会员订单号</td>
                <td colspan="3">{{ domainInfo.orderNo }}</td>
                <td>第三方业务订单号</td>
                <td colspan="3">{{ domainInfo.synTradeNo }}</td>
              </tr>
              <tr>
                <td>支付说明</td>
                <td colspan="3">{{ domainInfo.payDesc }}</td>
                <td>卡密支付卡号</td>
                <td colspan="3">{{ domainInfo.payCardNo }}</td>
              </tr>
              <tr>
                <td>酷开openId</td>
                <td colspan="3">{{ domainInfo.coocaaOpenId }}
                  <el-button v-if="domainInfo.coocaaOpenId" type="primary"  size="mini" @click="viewAccountDetail(domainInfo.coocaaOpenId)">查看用户详情</el-button>
                </td>
                <td>第三方openId</td>
                <td colspan="3">{{ domainInfo.thirdOpenId }}</td>
              </tr>
              <tr>
                <td>微信vuserid</td>
                <td colspan="3">{{ domainInfo.wxVuOpenId }}</td>
                <td>订单来源</td>
                <td colspan="3">{{ domainInfo.orderSource }}</td>
              </tr>
              <tr>
                <td>订单权益</td>
                <td>{{ domainInfo.orderSource }}</td>
                <td>产品类型</td>
                <td>{{ domainInfo.productType }}</td>
                <td>同步开通参数</td>
                <td colspan="3">{{ domainInfo.synParams }}</td>
              </tr>
              <tr>
                <td>mac地址</td>
                <td>{{ domainInfo.mac }}</td>
                <td>激活ID</td>
                <td>{{ domainInfo.tvId }}</td>
                <td>机型</td>
                <td> {{domainInfo.phoneNo}}</td>
                <td>机芯</td>
                <td>{{ domainInfo.userId }}</td>
              </tr>
              <tr>
                <td>ip</td>
                <td>{{ domainInfo.ip }}</td>
                <td>资源类型</td>
                <td>{{ domainInfo.movieType }}</td>
                <td>影片id</td>
                <td>{{ domainInfo.movieId }}</td>
                <td>订单id</td>
                <td>{{ domainInfo.id }}</td>
              </tr>
              <tr>
                <td>活动id</td>
                <td>{{ domainInfo.activityId }}</td>
                <td>产品id</td>
                <td>{{ domainInfo.productId }}</td>
                <td>下单设备类型</td>
                <td>{{ clientTypeToName(domainInfo.clientType) }}</td>
                <td>订单类型</td>
                <td>{{ orderTypeToName(domainInfo.orderType) }}</td>
              </tr>
            </table>
          </el-collapse-item>
          <el-collapse-item title="订购产品信息" name="2">
            <table class="cc-order-table cc-inline-title-table" cellpadding="0" cellspacing="0" >

            </table>
          </el-collapse-item>
          <el-collapse-item title="权益信息" name="3">
            <table class="cc-order-table cc-inline-title-table" cellpadding="0" cellspacing="0">

            </table>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="OSS支付订单信息" v-if="loadOssDomain">
        <order-info-detail :origi-order-no="domainInfo.orderNo"
                           @no-such-entity="loadOssDomain = false"
                           @load-entity-success="loadOssDomain = true"/>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="用户详情信息" :visible.sync="dialogAccountDetilVisible" :append-to-body="true" :modal-append-to-body="false" width="70%" @close="accountDetailOpenId = ''">
      <sys-account-detail :open-id="accountDetailOpenId"/>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
import SysAccountDetail from '../../passport/sysaccount/detail.vue';
import OrderInfoDetail from '../../pay/orders/detail.vue';

import {
  clientTypeToName,
  getBaseMoviesIqiyiOrderBaseDetail,
  orderTypeToName,
  payFlagClassName,
} from '../../../api/authentication';
import {BaseMoviesIqiyiOrderBase, OrderFlag, SearchHistoryModel} from '../../../types';

@Component({
  name: 'BaseMoviesIqiyiOrderBaseDetail',
  components: {SysAccountDetail, OrderInfoDetail},
})
export default class BaseMoviesIqiyiOrderBaseDetail extends Vue {
  dialogAccountDetilVisible: boolean = false;
  activeNames: string[] = ['1'];
  domainInfo: BaseMoviesIqiyiOrderBase = {id: 0};
  accountDetailOpenId = '';
  loadOssDomain: boolean = true;

  @Prop({type: Number, default: 0})
    // @ts-ignore
  domainId: number;
  @Prop({type : String, default: '1'})
    // @ts-ignore
  searchHistoryModel: SearchHistoryModel;

  clientTypeToName(code: number) {
    return clientTypeToName(code);
  }

  orderTypeToName(code: number) {
    return orderTypeToName(code);
  }
  viewAccountDetail(openId: string): void {
    this.dialogAccountDetilVisible = true;
    console.log('点击选择的用户的openid为' + openId);
    this.$nextTick(() => this.accountDetailOpenId = openId);

  }

  tableRowClassName(payFlag: OrderFlag) {
    return payFlagClassName(payFlag);
  }

  @Watch('domainId', {immediate: true})
  handleDomainIdhange(newVal: number | undefined, oldVal: number | undefined) {
    this.loadOssDomain = true;
    console.log('变更了记录-' + newVal);
    if (null == newVal || newVal === 0) {
      this.domainInfo = {id: 0};
    } else {
      getBaseMoviesIqiyiOrderBaseDetail(this.domainId, this.searchHistoryModel).then((resolve) => {
        this.domainInfo = resolve.data.data;
      });
    }
  }

  @Watch('domainInfo', {immediate: true})
  handleInternalDomainInfoChange(newVal: BaseMoviesIqiyiOrderBase, oldVal?: BaseMoviesIqiyiOrderBase): void {
    if (null == newVal && null == oldVal) {
      return;
    }
    if (newVal != null && oldVal != null) {
      this.domainIdChange(newVal.id, oldVal.id);
    } else if (oldVal != null) {
      this.domainIdChange(0, oldVal.id);
    } else if (newVal != null) {
      this.domainIdChange(newVal.id, 0);
    }
  }

  @Emit('update:domainId')
  domainIdChange(orderId: number | undefined, orderId2: number | undefined): void {
  }
}
</script>


<style scoped>

</style>

