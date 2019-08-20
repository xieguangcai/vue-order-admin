<template>
  <div :class="classObj" class="app-wrapper">
    <div>
      <div class="cc-navbar-con">
        <navbar/>
      </div>
      <div class="cc-main-con">
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
  import ResizeMixin from '../layout/mixin/ResizeHandler';
  import {Component, Vue} from 'vue-property-decorator';
  import {mixins} from 'vue-class-component';
  import {DeviceType, AppModule} from '@/store/modules/app';
  import {AppMain} from '../layout/components';
  import {Navbar,TagsView} from './components';

  @Component({
    name: 'Layout',
    components: {
      AppMain,
      Navbar,
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
  @import "@/styles/mixin.scss";
  .navbar{
    padding-left:10px;
  }
  .cc-navbar-con {
    width: 100%;
    position: fixed;
    z-index: 1000;
  }

  .cc-main-con {
    padding-top: 40px
  }

  .cc-tags-view-con {
    position: fixed;
    width: 100%;
    z-index: 1000;
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

  #app .main-container {
    margin-left: 0px;
  }
  .navbar .avatar-container .avatar-wrapper{
    margin-top:2px;
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
