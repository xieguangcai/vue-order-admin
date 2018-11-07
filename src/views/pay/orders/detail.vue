<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item :title="'OSS订单详情['+ domainInfo.orderNo +']'" name="1">
        <table class="cc-order-table cc-inline-title-table" cellpadding="0" cellspacing="0">
          <tr>
            <td>订单状态</td>
            <td>
              <span :class="tableRowClassName(domainInfo.orderStatus)">{{ orderStatusToName(domainInfo.orderStatus) }}</span>
            </td>
            <td>订单信息</td>
            <td colspan="5"><span class="order-amount">[{{domainInfo.orderAmount}}元]</span>{{ domainInfo.prodName }}</td>
          </tr>
          <tr>
            <td>mac地址</td>
            <td>{{ domainInfo.mac }}</td>
            <td>支付方式</td>
            <td>
              <template v-if="domainInfo.payModValue" >{{ domainInfo.payModValue }}</template>
              <template v-else>{{ domainInfo.payMod }}</template>
            </td>
            <td>手机号</td>
            <td> {{domainInfo.phoneNo}}</td>
            <td>用户id</td>
            <td>{{ domainInfo.userId }}</td>
          </tr>
          <tr>
            <td>订单时间</td>
            <td>{{ domainInfo.orderTime }}</td>
            <td>支付时间</td>
            <td>{{ domainInfo.payTime }}</td>
            <td>完成时间</td>
            <td>{{ domainInfo.completedTime }}</td>
            <td>修改时间</td>
            <td>{{ domainInfo.modifiedTime }}</td>
          </tr>
          <tr>
            <td>oss订单号</td>
            <td colspan="3">{{ domainInfo.orderNo }}</td>
            <td>业务订单号</td>
            <td colspan="3">{{ domainInfo.origiOrderNo }}</td>
          </tr>
          <tr>
            <td>支付订单号</td>
            <td colspan="3">{{ domainInfo.ybDealNo }}</td>
            <td>支付流水号</td>
            <td colspan="3">{{ domainInfo.serialNo }}</td>
          </tr>
          <tr>
            <td>供应商</td>
            <td colspan="7">[{{domainInfo.appCode}}]{{ domainInfo.appName }}</td>
          </tr>
          <tr>
            <td>应用名称</td>
            <td colspan="3">{{ domainInfo.appRealName }}</td>
            <td>业务类型</td>
            <td>{{ domainInfo.appTypeCodeValue }}</td>
            <td>订单来源</td>
            <td>{{ ossOrderSourceToName(domainInfo.orderSource) }}</td>
          </tr>
          <tr>
            <td>回调地址</td>
            <td colspan="7">{{ domainInfo.callBackUrl }}</td>
          </tr>
        </table>
      </el-collapse-item>
      <el-collapse-item :title="'订单扩展信息' + (orderInfoExtend || orderOpenidInfo ?'' : '（无记录）')" name="2">
        <table class="cc-order-table cc-inline-title-table" cellpadding="0" cellspacing="0" v-if="orderInfoExtend || orderOpenidInfo">
          <tr v-if="orderInfoExtend">
            <td width="10%">激活id</td>
            <td width="40%">{{orderInfoExtend.activatedId}}</td>
            <td width="10%">用户openId</td>
            <td width="40%">{{orderInfoExtend.openId}}
              <el-button v-if="orderInfoExtend.openId" size="mini" type="primary"  @click="viewAccountDetail(orderInfoExtend.openId)">查看用户详情</el-button>
            </td>
          </tr>
          <tr v-for="item in orderOpenidInfo">
            <td width="10%">支付类型</td>
            <td width="40%">{{ item.flag === 1 ? "微信" : "支付宝" }}</td>
            <td width="10%">支付账户</td>
            <td width="40%">{{item.openid}}</td>
          </tr>
        </table>
        <div v-else>
          无支付扩展信息
        </div>
      </el-collapse-item>
      <el-collapse-item :title="'订单支付流水记录' + (orderSerialInfo && orderSerialInfo.length > 0 ? '' : '（无记录）')" name="3">
        <table class="cc-order-table cc-inline-title-table" cellpadding="0" cellspacing="0" v-if="orderSerialInfo">
          <tr v-for="item in orderSerialInfo">
            <td width="10%">支付方式</td>
            <td width="10%">{{ item.payMod }}</td>
            <td width="10%">支付流水号</td>
            <td width="30%">{{item.serialNo}}</td>
            <td width="10%">支付号</td>
            <td width="30%">{{item.tradeNo}}</td>
          </tr>
        </table>
        <div v-else>
          无支付流水记录
        </div>
      </el-collapse-item>
      <el-collapse-item :title="'订单授信异常记录' + (payExpInfos ? '' : '（无记录）')"  name="4">
        <div v-if="payExpInfos != null">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="订单名称">
              <span>{{ domainInfo.name }}</span>
            </el-form-item>
          </el-form>
        </div>
        <div v-else>
          无异常记录
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-dialog title="用户详情信息" :visible.sync="dialogAccountDetilVisible"
               :append-to-body="true" :modal-append-to-body="false" width="70%" @close="accountDetailOpenId = ''">
      <sys-account-detail :open-id="accountDetailOpenId"/>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
import {OrderInfo, OrderInfoExtend, OrderOpenidInfo, OrderSerialInfo, PayExpInfo, ResponseResult} from '../../../types';
import {
  getOrderInfo,
  getOrderInfoByorigiOrderNo,
  orderStatusClass,
  orderStatusName,
  ossOrderSourceName,
} from '../../../api/pay';
import SysAccountDetail from '../../passport/sysaccount/detail.vue';

@Component({
  name: 'OrderInfoDetail',
  components: {SysAccountDetail},
})
export default class OrderInfoDetail extends Vue {
  dialogAccountDetilVisible: boolean = false;
  activeNames: string[] = ['1'];
  domainInfo: OrderInfo = {orderId: 0};
  accountDetailOpenId = '';

  @Prop({type: Number, default: 0})
    // @ts-ignore
  domainId: number;

  @Prop({type: String, default: ''})
    // @ts-ignore
  origiOrderNo: string;


  tableRowClassName(orderStatus: string) {
    return orderStatusClass(orderStatus);
  }

  orderStatusToName(code: string) {
    return orderStatusName(code);
  }
  ossOrderSourceToName(code: number) {
    return ossOrderSourceName(code);
  }
  get payExpInfos(): PayExpInfo | null {
    if (this.domainInfo.payExpInfos != null && this.domainInfo.payExpInfos.length > 0) {
      return this.domainInfo.payExpInfos[0];
    } else {
      return null;
    }
  }

  get orderInfoExtend(): OrderInfoExtend | null {
    if (this.domainInfo.orderInfoExtend != null && this.domainInfo.orderInfoExtend.length > 0) {
      return this.domainInfo.orderInfoExtend[0];
    } else {
      return null;
    }
  }

  get orderOpenidInfo(): (OrderOpenidInfo[] | null | undefined)  {
    return this.domainInfo.orderOpenidInfo;
  }

  get orderSerialInfo(): OrderSerialInfo[] | null | undefined {
    return this.domainInfo.orderSerialInfos;
  }

  viewAccountDetail(openId: string): void {
    this.dialogAccountDetilVisible = true;
    console.log('点击选择的用户的openid为' + openId);
    this.$nextTick(() => this.accountDetailOpenId = openId);

  }

  @Watch('domainId', {immediate: true})
  handleDomainIdhange(newVal: number | undefined, oldVal: number | undefined) {
    if (null == newVal || newVal === 0) {
      this.domainInfo = {orderId: 0};
    } else {
      getOrderInfo(this.domainId).then((resolve) => {
        this.domainInfo = resolve.data.data;
        this.loadEntitySucess(this.domainInfo);
      }).catch((error: ResponseResult<any>) => {
        this.noSuchEntity();
      });
    }
  }
  @Emit('no-such-entity')
  noSuchEntity() {

  }

  @Emit('load-entity-success')
  loadEntitySucess(orderInfo: OrderInfo) {

  }

  @Watch('origiOrderNo')
  handleOrigiOrderNoChange(newVal: string | undefined, oldVal: string | undefined) {
    if (null === newVal || undefined === newVal  || newVal === '') {
      this.domainInfo = {orderId: 0};
    } else {
      getOrderInfoByorigiOrderNo(this.origiOrderNo).then((resolve) => {
        this.domainInfo = resolve.data.data;
        this.loadEntitySucess(this.domainInfo);
      }).catch((error: ResponseResult<any>) => {
        this.noSuchEntity();
      });
    }
  }

  @Watch('domainInfo', {immediate: true})
  handleInternalDomainInfoChange(newVal: OrderInfo, oldVal?: OrderInfo): void {
    if (null == newVal && null == oldVal) {
      return;
    }
    if (newVal != null && oldVal != null) {
      this.domainIdChange(newVal.orderId, oldVal.orderId);
    } else if (oldVal != null) {
      this.domainIdChange(0, oldVal.orderId);
    } else if (newVal != null) {
      this.domainIdChange(newVal.orderId, 0);
    }
  }

  @Emit('update:domainId')
  domainIdChange(orderId: number | undefined, orderId2: number | undefined): void {
  }
}
</script>


<style scoped>

</style>

