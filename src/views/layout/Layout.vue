<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="classObj.mobile && sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <div>
      <div class="cc-navbar-con">
        <navbar/>
      </div>
      <div class="cc-main-con">
        <sidebar class="sidebar-container"/>
        <div class="main-container">
          <div class="cc-tags-view-con">
            <tags-view/>
          </div>
          <div class="cc-router-container">
            <app-main/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Navbar, AppMain, Sidebar, TagsView} from './components';
  import ResizeMixin from './mixin/ResizeHandler';
  import {Component, Vue} from 'vue-property-decorator';
  import {mixins} from 'vue-class-component';
  import {DeviceType, AppModule} from '@/store/modules/app';

  @Component({
    name: 'Layout',
    components: {
      Navbar,
      Sidebar,
      AppMain,
      TagsView,
    },
  })
  export default class Layout extends mixins(ResizeMixin) {
    get classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === DeviceType.Mobile,
      };
    }

    handleClickOutside() {
      AppModule.CloseSideBar(false);
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .cc-navbar-con{
    width:100%; position:fixed;z-index:1000;
  }
  .cc-main-con{
    padding-top:50px;
  }
  .cc-tags-view-con{
    position:fixed;width:100%;z-index:1000;
  }
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

</style>
