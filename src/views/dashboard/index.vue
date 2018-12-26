<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎登录酷开智能客服系统</div>
    <div class="dashboard-text">登录账号:{{ name }}</div>
    <div class="dashboard-text">当前账号所属角色:<div v-for="role in roles" :key="role">{{ role }}</div></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { UserModule } from '@/store/modules/user';

@Component
export default class Dashboard extends Vue {
  get name() {
    return UserModule.name;
  }

  get roles() {
    return UserModule.roles;
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
