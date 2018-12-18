<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
    >
      <sidebar-item v-for="route in (routes)" :key="route.name" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { AppModule } from '@/store/modules/app';
import SidebarItem from './SidebarItem.vue';
import {RouteConfig} from 'vue-router';
import {UserModule} from '../../../../store/modules/user';

@Component({
  components: {
    SidebarItem,
  },
})
export default class SideBar extends Vue {
  get sidebar() {
    return AppModule.sidebar;
  }

  get routes(): RouteConfig[] {
    const x = (this.$router as any).options.routes;
    this.rightFilter(x);
    return x;
  }

  get isCollapse() {
    return !this.sidebar.opened;
  }

  rightFilter(routes: RouteConfig[]) {
    routes.forEach((r) => {
      if (r.meta && r.meta.title && !r.meta.hidden) {
        r.meta.hidden = !this.hasRight(r);
        console.log('检查用户菜单权限：' + r.meta.title + ', ' + !r.meta.hidden);

        if (r.children && r.children.length > 0) {
          this.rightFilter(r.children);
        }
      }
    });
  }

  hasRight(route: RouteConfig) {
    if (UserModule.roles.some((r: string) => r === 'ROLE_ADMIN')) {
      return true;
    }
    // 只需要某个权限才显示出来。
    if (!route.meta || !route.meta.roles) {
      return true;
    }
    return UserModule.roles.some((r: string ) => route.meta.roles.some((nr: string) => nr === r));
  }
}
</script>
