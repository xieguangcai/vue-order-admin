<template>
  <div class="cc-form" style="width: 100%;">
    <h3 class="cc-form-title">查询账号详细信息</h3>
    <search-pane slot="searchpane" @click="search">
      手机号
      <el-input v-model="listQuery.mobile" size="mini"  placeholder="请输入手机号"></el-input>
      OpenId
      <el-input v-model="listQuery.openId"  size="mini" style="width:260px;" placeholder="请输入OpenId"></el-input>
      第三方账号
      <el-select v-model="listQuery.externalFlag" placeholder="选择类型" size="mini" >
        <el-option label="腾讯QQ" value="qq"></el-option>
        <el-option label="腾讯微信" value="weixin"></el-option>
        <el-option label="新浪微博" value="weibo"></el-option>
        <el-option label="江苏有线" value="jscn"></el-option>
        <el-option label="东方有线" value="ocn"></el-option>
      </el-select>
      <el-input placeholder="请输入第三方openId" size="mini"  v-model="listQuery.externalId"  style="width:260px;" class="input-with-select">
      </el-input>
    </search-pane>
    <div style="padding-top:20px;">
      <sys-account-detail v-bind:search-model="innerListQuery" :active="activeNames">
      </sys-account-detail>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {
  SysAccountQuery,
} from '../../../types';

import SearchPane from '../../../components/SearchPane/index.vue';
import SysAccountDetail from '../sysaccount/detail.vue';
import {setLocationToHisotry} from '../../../utils/tools';

@Component({
  name: 'UserDetail',
  components: {SysAccountDetail, SearchPane},
})
export default class UserDetail extends Vue {
  activeNames = ['1', '2', '3', '4'];
  listQuery: SysAccountQuery = {mobile: '', openId: '', externalFlag: 'qq', externalId: '' };
  openId = '';
  innerListQuery: SysAccountQuery = {mobile: '', openId: '', externalFlag: 'qq', externalId: '' };

  created() {
    this.listQuery = Object.assign(this.listQuery, this.$route.query);
    if (this.validInput()) {
      this.search();
    }
  }

  get inputValueIsValid(): boolean {
    return this.validInput();
  }

  validInput(): boolean {
    if (this.listQuery.mobile === '' && this.listQuery.openId === '' && this.listQuery.externalId === '') {
      return false;
    }
    return true;
  }

  search(): void {
    if (!this.validInput()) {
      this.$message.error('必须输入至少一种查询条件进行查询');
      return;
    }
    this.innerListQuery = {mobile: this.listQuery.mobile,
      openId: this.listQuery.openId,
      externalFlag: this.listQuery.externalFlag,
      externalId: this.listQuery.externalId,
    };
    setLocationToHisotry(this, this.listQuery, '广电用户信息查询');
  }
}
</script>


<style scoped>

</style>

