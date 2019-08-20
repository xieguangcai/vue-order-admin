<template>
  <el-menu class="navbar" mode="horizontal">
    <div class="cc-company">{{appName}}</div>
    <div class="cc-name">{{ userName }}</div>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img src="@/assets/img/1540538985180.jpg" class="user-avatar">
        <i class="el-icon-caret-bottom"/>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            首页
          </el-dropdown-item>
        </router-link>
        <router-link class="inlineBlock" to="/me/changepwd">
          <el-dropdown-item>
            修改密码
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span style="display:block;" @click="logout">退出当前账号</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { AppModule } from '@/store/modules/app';
import { UserModule } from '@/store/modules/user';

@Component({
  components: {
  },
})
export default class Navbar extends Vue {
  get sidebar() {
    return AppModule.sidebar;
  }
  get userName() {
    return UserModule.name;
  }
  get avatar() {
    return UserModule.avatar;
  }
  get appName() {
    return process.env.VUE_APP_APP_NAME;
  }

  toggleSideBar() {
    AppModule.ToggleSideBar(false);
  }

  logout() {
    UserModule.LogOut().then(() => {
      location.href = '/login'; // reload(); // 为了重新实例化vue-router对象 避免bug
    });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../../../src/styles/variables.scss";
  .cc-company{
    color:white;float:left;
  }
  .navbar {
  height: 40px;
  line-height: 40px;
  border-radius: 0px !important;
  background: $navbar-bg-color;
  .hamburger-container {
    line-height: 40px;
    height: 40px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 11px;
    color: red;
  }
  .avatar-container {
    height: 40px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 2px;
      position: relative;
      .user-avatar {
        width: 35px;
        height: 35px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 20px;
        font-size: 12px;
      }
    }
  }
  .cc-name{
    line-height:40px;font-size:20px; color: #d4eeb9;
    position:absolute; right:80px; display: inline-block;
  }
}
</style>

