<template>
  <el-tabs type="border-card">
    <el-tab-pane label="酷开账户中心详情">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="酷开用户详情" name="1">
          <table class="cc-order-table" cellpadding="0" cellspacing="0">
            <tr>
              <td colspan="4" rowspan="5" width="200">
                <img :src="getAvatar" style="width: 200px;height:200px;"/>
              </td>
              <td width="10%">昵称</td>
              <td width="30%">{{domainInfo.nickName}}</td>
              <td width="10%">用户id</td>
              <td width="30%">{{ domainInfo.accountId }}</td>
            </tr>
            <tr>
              <td>openId</td>
              <td>{{ domainInfo.openId }}</td>
              <td>手机号</td>
              <td> {{domainInfo.mobile}}</td>
            </tr>
            <tr>
              <td>邮箱</td>
              <td>{{ domainInfo.email }}</td>
              <td>注册时间</td>
              <td>{{ domainInfo.createDate}}</td>
            </tr>
            <tr>
              <td>最后登录ip</td>
              <td>{{ domainInfo.lastIp }}</td>
              <td>最后登录时间</td>
              <td>{{ domainInfo.lastTime }}</td>
            </tr>
            <tr>
              <td>完成时间</td>
              <td>{{ domainInfo.completedTime }}</td>
              <td>登录次数</td>
              <td>{{ domainInfo.visitNum }}</td>
            </tr>
          </table>
        </el-collapse-item>
        <el-collapse-item :title="'绑定的第三方账号信息' + (domainInfo.bindExternals.length > 0 ?'' : '（无记录）')" name="2">
          <table class="cc-order-table" cellpadding="0" cellspacing="0" v-if="domainInfo.bindExternals.length > 0">
            <tr>
              <th>头像</th>
              <th>类型</th>
              <th>第三方昵称</th>
              <th>第三方openId</th>
              <th>绑定时间</th>
            </tr>
            <template v-for="item in domainInfo.bindExternals">
              <tr v-if="item.externalFlag !== 'weixin' ">
                <td>
                  <img :src="item.externalAvatar"/>
                </td>
                <td>{{item.externalFlag}}</td>
                <td>{{item.externalId}}</td>
                <td>{{item.externalNickname}}</td>
                <td>{{item.bindTime}}</td>
                <td>{{item.vuserid}}</td>
                <td>{{item.vusession}}</td>
                <td>{{item.unionid}}</td>
              </tr>
              <template v-else>
                <tr>
                  <td rowspan="3">
                    <img :src="item.externalAvatar"/>
                  </td>
                  <td rowspan="3">{{item.externalFlag}}</td>
                  <td>{{item.externalId}}</td>
                  <td>{{item.externalNickname}}</td>
                  <td>{{item.bindTime}}</td>
                </tr>
                <tr>
                  <th>vuserid</th>
                  <th>vusession</th>
                  <th>unionid</th>
                </tr>
                <tr>
                  <td>{{item.vuserid}}</td>
                  <td>{{item.vusession}}</td>
                  <td>{{item.unionid}}</td>
                </tr>
              </template>
            </template>
          </table>
          <div v-else>
            无第三方账号的绑定信息
          </div>
        </el-collapse-item>
        <el-collapse-item
          :title="'登录设备信息' + (domainInfo.bindDevices.length > 0 ? '' : '（无记录）')" name="3">
          <table class="cc-order-table" cellpadding="0" cellspacing="0" v-if="domainInfo.bindDevices.length > 0">
            <tr>
              <th>设备id</th>
              <th>激活id</th>
              <th>登录ip</th>
              <th>时间</th>
              <th>激活状态</th>
            </tr>
            <tr v-for="item in domainInfo.bindDevices">
              <td>{{ item.deviceId }}</td>
              <td>{{ item.cUdid }}</td>
              <td>{{ item.lastIp }}</td>
              <td>{{ item.bindTime}}</td>
              <td>{{ item.isBind == 1 ? '激活': '未激活' }}</td>
            </tr>
          </table>
          <div v-else>
            无登录设备信息
          </div>
        </el-collapse-item>
        <el-collapse-item
          :title="'合并账号信息' + (( domainInfo.fromMergeInfos.length > 0) || (domainInfo.toMergeInfos.length > 0) ? '' : '（无记录）')"
          name="4">
          <table class="cc-order-table" cellpadding="0" cellspacing="0"
                 v-if="( domainInfo.fromMergeInfos.length > 0) || ( domainInfo.toMergeInfos.length > 0)  ">
            <template v-for="item in domainInfo.fromMergeInfos">
              <tr>
                <td>从OpenId<span style="color:red;">[{{item.fromOpenId}}]</span> 合并至OpenId[{{item.toOpenId}}]</td>
                <td>合并时间</td>
                <td>{{ item.createTime }}</td>
              </tr>
              <tr>
                <td>待合并账户信息</td>
                <td>{{item.fromUserInfo}}</td>
              </tr>
              <tr>
                <td>待合并账户扩展信息</td>
                <td>{{item.fromExtUserInfo}}</td>
              </tr>
              <tr>
                <td>合并后账户扩展信息</td>
                <td>{{item.toUserInfo}}</td>
              </tr>
              <tr>
                <td>合并后账户扩展信息</td>
                <td>{{item.toExtUserInfo}}</td>
              </tr>
            </template>
            <template v-for="item in domainInfo.toMergeInfos">
              <tr>
                <td>从OpenId[{{item.fromOpenId}}] 合并至OpenId<span style="color:red;">[{{item.toOpenId}}]</span></td>
                <td>合并时间</td>
                <td>{{ item.createTime }}</td>
              </tr>
              <tr>
                <td>待合并账户信息</td>
                <td>{{item.fromUserInfo}}</td>
              </tr>
              <tr>
                <td>待合并账户扩展信息</td>
                <td>{{item.fromExtUserInfo}}</td>
              </tr>
              <tr>
                <td>合并后账户扩展信息</td>
                <td>{{item.toUserInfo}}</td>
              </tr>
              <tr>
                <td>合并后账户扩展信息</td>
                <td>{{item.toExtUserInfo}}</td>
              </tr>
            </template>
          </table>
          <div v-else>
            无合并账号信息
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-tab-pane>
    <el-tab-pane label="账号支付相关信息" v-if="loadOssUserInfo">
      <el-collapse v-model="payUserActiveNames">
        <el-collapse-item :title="'免密签约协议' + (payUserInfo.noPassportSigns.length > 0 ?'' : '（无记录）')" name="1">
          <table class="cc-order-table" cellpadding="0" cellspacing="0" v-if="payUserInfo.noPassportSigns.length > 0">
            <tr>
              <th>序号</th>
              <th>免密产品</th>
              <th>签约状态</th>
              <th>签约场景</th>
              <th>签约用户id</th>
            </tr>
            <template v-for="(item,index) in payUserInfo.noPassportSigns">
              <tr>
                <td rowspan="2">{{ index + 1}}</td>
                <td>{{ item.payMethod }}</td>
                <td>{{ item.status }}</td>
                <td>{{ item.signScene }}</td>
                <td>{{ item.signUserId }}</td>
              </tr>
              <tr>
                <td>签约时效</td>
                <td>{{ item.validTime}} - {{item.invalidTime}}</td>
                <td>创/改</td>
                <td>{{ item.createTime}} / {{item.modifyTime}}</td>
              </tr>
              <tr>
                <td colspan="5">
                  <table class="cc-order-table" cellpadding="0" cellspacing="0"
                         v-if="item.noPassportSignAuths.length > 0">
                    <caption>免密签约授权设备</caption>
                    <tr>
                      <th>授权设备</th>
                      <th>授权时间</th>
                      <th>创建时间</th>
                    </tr>
                    <tr v-for="item in item.noPassportSignAuths">
                      <td>{{ item.deviceId }}</td>
                      <td>{{ item.authTime }}</td>
                      <td>{{ item.createTime }}</td>
                    </tr>
                  </table>
                  <div v-else>
                    无授权设备信息
                  </div>
                </td>
              </tr>
            </template>
          </table>
          <div v-else>
            无免密签约协议
          </div>
        </el-collapse-item>
        <el-collapse-item
          :title="'生效中的自动续费产品' + (payUserInfo.protocols.length > 0 ? '共' + payUserInfo.protocols.length + '个' : '（无记录）')"
          name="3">
          <table class="cc-order-table" cellpadding="0" cellspacing="0" v-if="payUserInfo.protocols.length > 0">
            <tr>
              <th>序号</th>
              <th>appCode</th>
              <th>场景</th>
              <th>签约产品</th>
              <th>金额</th>
              <th>签约时间</th>
              <th>最后修改时间</th>
            </tr>
            <template v-for="(item, index) in payUserInfo.protocols">
              <tr>
                <td rowspan="2">{{index + 1}}</td>
                <td>{{ item.appCode }}</td>
                <td>{{ item.scene }}</td>
                <td>{{ item.prodName }}</td>
                <td>{{ item.price }}</td>
                <td>{{ item.signTime }}</td>
                <td>{{ item.modifyTime }}</td>
              </tr>
              <tr>
                <td>回调地址</td>
                <td colspan="6">{{ item.notifyUrl }}</td>
              </tr>
            </template>
          </table>
          <div v-else>
            无签约记录
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
  import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
  import {
    ResponseResult,
    SysAccount, SysUser,
    UserInfoFull,
  } from '../../../types/index';
  import {getSysAccountInfoDetail} from '../../../api/passport';
  import {getUserInfoFullByOpenId} from '../../../api/pay';
  import {handlerCommonError} from '../../../utils/auth-interceptor';

  @Component({
    name: 'SysAccountDetail',
    components: {},
  })
  export default class SysAccountDetail extends Vue {
    activeNames: string[] = ['1'];
    payUserActiveNames: string[] = ['1'];
    loadOssUserInfo: boolean = false;

    domainInfo: SysAccount = {
      accountId: 0,
      bindDevices: [],
      bindExternals: [],
      eduVips: [],
      bindLogs: [],
      user: [],
      fromMergeInfos: [],
      toMergeInfos: [],
    };

    payUserInfo: UserInfoFull = {
      userId: 0,
      protocols: [],
      noPassportSigns: [],
    };

    get defPayUserInfo(): UserInfoFull {
      return {
        userId: 0,
        protocols: [],
        noPassportSigns: [],
      };
    }

    @Prop({type: String, default: ''})
      // @ts-ignore
    openId: string;

    get getAvatar(): string {
      const user = this.getUser;
      if (null == user) {
        return '';
      }
      return user.avatar || '';
    }

    get getUser(): SysUser | null {
      if (null != this.domainInfo.user && this.domainInfo.user.length > 0) {
        return this.domainInfo.user[0];
      }
      return null;
    }

    @Watch('openId', {immediate: true})
    handleOpenIdhange(newVal: string | undefined, oldVal: string | undefined) {
      this.loadOssUserInfo = false;
      console.log('变更了记录-' + newVal);
      if (null == newVal || newVal === '') {
        this.domainInfo = {
          accountId: 0,
          bindDevices: [],
          bindExternals: [],
          eduVips: [],
          bindLogs: [],
          user: [],
          fromMergeInfos: [],
          toMergeInfos: [],
        };
        this.payUserInfo = this.defPayUserInfo;
      } else {
        getSysAccountInfoDetail(this.openId).then((resolve) => {
          this.domainInfo = resolve.data.data;
        }).catch(handlerCommonError);
        getUserInfoFullByOpenId(this.openId).then((resolve) => {
          this.payUserInfo = resolve.data.data;
          this.loadOssUserInfo = true;
        }).catch((error: ResponseResult<any>) => {
          this.loadOssUserInfo = false;
        });
      }
    }

    @Watch('domainInfo', {immediate: true})
    handleInternalDomainInfoChange(newVal: SysAccount, oldVal?: SysAccount): void {
      if (null == newVal && null == oldVal) {
        return;
      }
      if (newVal != null && oldVal != null) {
        this.openIdChange(newVal.openId, oldVal.openId);
      } else if (oldVal != null) {
        this.openIdChange('', oldVal.openId);
      } else if (newVal != null) {
        this.openIdChange(newVal.openId, '');
      }
    }

    @Emit('update:openId')
    openIdChange(openId: string | undefined, openId2: string | undefined): void {
    }
  }
</script>


<style scoped>

</style>

