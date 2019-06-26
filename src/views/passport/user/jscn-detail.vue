<template>
  <div class="cc-form" style="width: 100%;">
    <h3 class="cc-form-title">智能卡账号信息查询</h3>
    <search-pane slot="searchpane" @click="search">
      用户凭证
      <el-input v-model="listQuery.userId" size="mini" placeholder="请输入userId"></el-input>
      智能卡号
      <el-input v-model="listQuery.smartCardId" size="mini" style="width:260px;"
                placeholder="请输入smartCardId"></el-input>
      客户凭证
      <el-input placeholder="请输入家庭账号" size="mini" v-model="listQuery.customerCode" style="width:260px;"
                class="input-with-select">
      </el-input>
    </search-pane>
    <div v-loading="listLoading">
      <el-table style="width: 100%"
                ref="userInfoTable"
                :data="data"
                element-loading-text="Loading"
                border
                fit
                size="mini"
                @row-click="loadCoocaaUserInfo"
                highlight-current-row>
        <el-table-column align="left" label="ID" width="100" fixed>
          <template slot-scope="scope">
            <div>
              {{scope.row.id}}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="用户编码" width="120">
          <template slot-scope="scope">
            <div>
              {{scope.row.userId}}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="智能卡号" width="200">
          <template slot-scope="scope">
            <div>
              {{scope.row.smartCardId}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="姓名" width="180">
          <template slot-scope="scope">
            <div>
              {{scope.row.userName}}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="家庭编码" width="200">
          <template slot-scope="scope">
            <div>
              {{scope.row.customerCode}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="基础状态" width="120">
          <template slot-scope="scope">
            <div>
              {{scope.row.status}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="60">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" circle icon="el-icon-view"
                       @click="()=>{loadCoocaaUserInfo(scope.row)}"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <hr>
        <sys-account-detail v-bind:search-model="innerListQuery" :open-id.sync="openId" :active="activeNames">
          <template slot="tabPrefix">
            <el-tab-pane label="智能卡关联用户信息">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="关联卡号详细信息" name="1">
                  <table class="cc-order-table " style="width:100%;">
                    <tr>
                      <td width="20%">ID</td>
                      <td width="30%">{{selectJscnUserInfo.id}}</td>
                      <td width="20%">用户编码</td>
                      <td width="30%">{{selectJscnUserInfo.userId}}</td>
                    </tr>
                    <tr>
                      <td>用户名</td>
                      <td>{{selectJscnUserInfo.userName}}</td>
                      <td>联系电话</td>
                      <td>{{selectJscnUserInfo.phoneNumber}}</td>
                    </tr>
                    <tr>
                      <td>智能卡号</td>
                      <td>{{selectJscnUserInfo.smartCardId}}</td>
                      <td>电视号</td>
                      <td>{{selectJscnUserInfo.tvCode}}</td>
                    </tr>
                    <tr>
                      <td>机顶盒号码</td>
                      <td>{{selectJscnUserInfo.settopboxId}}</td>
                      <td>多媒体终端号</td>
                      <td>{{selectJscnUserInfo.imsNumber}}</td>
                    </tr>
                    <tr>
                      <td>客户类型</td>
                      <td>
                        {{selectJscnUserInfo.customerType}}
                      </td>
                      <td>客户等级</td>
                      <td>
                        {{selectJscnUserInfo.customerLevel}}
                      </td>
                    </tr>
                    <tr>
                      <td>用户状态</td>
                      <td>
                        {{selectJscnUserInfo.status}}
                      </td>
                      <td>用户类型</td>
                      <td>
                        {{selectJscnUserInfo.userType}}
                      </td>
                    </tr>
                    <tr>
                      <td>客户证号</td>
                      <td>{{selectJscnUserInfo.customerCode}}</td>
                      <td>电子邮件</td>
                      <td>{{selectJscnUserInfo.email}}</td>
                    </tr>
                    <tr>
                      <td>管理站id</td>
                      <td>{{selectJscnUserInfo.managementStationId}}</td>
                      <td>管理站名称</td>
                      <td>{{selectJscnUserInfo.managementStationName}}</td>
                    </tr>
                    <tr>
                      <td>数字基本产品状态</td>
                      <td>
                        {{selectJscnUserInfo.baseStatus}}
                      </td>
                      <td>互动基本产品状态</td>
                      <td>
                        {{selectJscnUserInfo.interactiveStatus}}
                      </td>
                    </tr>
                    <tr>
                      <td>机顶盒mac地址</td>
                      <td>
                        {{selectJscnUserInfo.stbMac}}
                      </td>
                      <td>cm_mac地址</td>
                      <td>{{selectJscnUserInfo.cmMac}}</td>
                    </tr>
                    <tr>
                      <td>详细地址</td>
                      <td colspan="3">{{selectJscnUserInfo.districtName}}</td>
                    </tr>
                    <tr>
                      <td>分公司编码</td>
                      <td>{{selectJscnUserInfo.districtCode}}</td>
                      <td>修改时间</td>
                      <td>{{selectJscnUserInfo.lastUpdateTime}}</td>
                    </tr>
                    <tr>
                      <td>操作</td>
                      <td colspan="3">
                        <el-button size="mini" type="primary" @click="viewUserOrder"
                                   v-if="selectJscnUserInfo.smartCardId != null && openId != '' ">查询用户订购记录
                        </el-button>
                      </td>
                    </tr>
                  </table>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>

            <el-tab-pane label="线下订购记录">
              <jscn-order-sync-detail :user-id="userId">
              </jscn-order-sync-detail>
            </el-tab-pane>
            <el-tab-pane label="会员权益信息">
              <order-permissions-detail :query-domain="rightQueryPerMission">
              </order-permissions-detail>
            </el-tab-pane>
            <el-tab-pane label="会员单点影片权益信息">
              <order-permissions-detail :query-domain="movieQueryPerMission">
              </order-permissions-detail>
            </el-tab-pane>
          </template>
        </sys-account-detail>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import {
    JscnUserInfo, JscnUserInfoQuery, PermissionQueryDomain, ResponseResult, SysAccountQuery,
  } from '../../../types';

  import SearchPane from '../../../components/SearchPane/index.vue';
  import SysAccountDetail from '../sysaccount/detail.vue';
  import {AxiosResponse} from 'axios';
  import {handlerCommonError} from '../../../utils/auth-interceptor';
  import {jscnUserInfoList} from '../../../api/passport';
  import {setLocationToHisotry} from '../../../utils/tools';
  import JscnOrderSyncDetail from './jscn-order-sync-detail.vue';
  import OrderPermissionsDetail from '../../authentication/order-permissions/detail.vue';
  import {ElTable} from "element-ui/types/table";

  @Component({
    name: 'JscnUserInfoDetail',
    components: {JscnOrderSyncDetail, SysAccountDetail, SearchPane, OrderPermissionsDetail},
  })
  export default class JscnUserInfoDetail extends Vue {
    activeNames = ['1', '2', '3', '4'];
    listQuery: JscnUserInfoQuery = {smartCardId: '', userId: '', customerCode: ''};
    innerListQuery: SysAccountQuery = {};
    selectJscnUserInfo: JscnUserInfo = {};
    listLoading: boolean = false;
    data: JscnUserInfo[] = [];
    openId: string = '';
    userId: string = ''; // 广电用户的id
    rightQueryPerMission: PermissionQueryDomain = {coocaaOpenId: '', thirdOpenId: '', permissionsType: '1'};
    movieQueryPerMission: PermissionQueryDomain = {coocaaOpenId: '', thirdOpenId: '', permissionsType: '2'};


    created() {
      this.listQuery = Object.assign(this.listQuery, this.$route.query);
      if (this.validInput()) {
        this.fetchData();
      }
    }

    get inputValueIsValid(): boolean {
      return this.validInput();
    }

    validInput(): boolean {
      if (this.listQuery.smartCardId === '' && this.listQuery.userId === '' && this.listQuery.customerCode === '') {
        return false;
      }
      return true;
    }

    @Watch('openId')
    openIdChanged(newVal: string, oldVal: string) {
      console.log('openIdChanged ===');
      const coocaaOpenId = this.getGdOpenId();
      this.rightQueryPerMission.coocaaOpenId = coocaaOpenId;
      this.movieQueryPerMission.coocaaOpenId = coocaaOpenId;
    }

    search(): void {
      if (!this.validInput()) {
        this.$message.error('必须输入至少一种查询条件进行查询');
        return;
      }
      this.openId = '';
      this.userId = '';
      this.fetchData();
    }

    getGdOpenId(): string {
      const openIds = [];
      if (this.openId !== undefined) {
        openIds.push(this.openId);
      }
      if (this.selectJscnUserInfo !== undefined) {
        openIds.push(this.selectJscnUserInfo.smartCardId);
        if (this.selectJscnUserInfo.stbMac !== null) {
          openIds.push(this.selectJscnUserInfo.stbMac);
        }
      }
      return openIds.join(',');
    }

    fetchData() {
      this.listLoading = true;
      this.realFetchData().finally(() => {
        this.listLoading = false;
      });
    }

    realFetchData() {
      return jscnUserInfoList(this.listQuery).then((response: AxiosResponse<ResponseResult<JscnUserInfo[]>>) => {
        const responseData = response.data.data;
        this.data = responseData;
        if (this.data != null && this.data.length > 0) {
          const row = this.data[0];
          this.selectJscnUserInfo = row;
          this.loadCoocaaUserInfo(row);
          (this.$refs.userInfoTable as ElTable).setCurrentRow(row);
        }
        // 设置路由
        setLocationToHisotry(this, this.listQuery, '广电用户信息查询');
      }).catch(handlerCommonError);
    }

    loadCoocaaUserInfo(row: JscnUserInfo) {
      console.log(process.env.VUE_APP_JSCN_EXT_ID);
      this.selectJscnUserInfo = row;

      if (row.customerCode !== null && row.customerCode !== ''
        && (this.openId === undefined || this.openId === '' || this.innerListQuery.externalId === undefined
        || row.customerCode !== this.innerListQuery.externalId)) {
        this.innerListQuery = {externalId: row.customerCode, externalFlag: process.env.VUE_APP_JSCN_EXT_ID};
      } else {
        //酷开用户没有变化
        this.openIdChanged(this.openId, '');
      }
      if (row != null && row.userId !== undefined) {
        this.userId = row.userId;
      }

    }

    viewUserOrder() {
      if (this.selectJscnUserInfo.smartCardId != null && this.openId !== '') {
        this.$router.push({
          path: '/orders/movies-order-list',
          query: {coocaaOpenId: this.openId + ',' + this.selectJscnUserInfo.smartCardId},
        });
      }
    }
  }
</script>


<style scoped>

</style>

