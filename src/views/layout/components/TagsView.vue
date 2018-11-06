<template>
  <div class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <router-link
        v-for="tag in Array.from(visitedViews)"
        ref="tag"
        :class="isActive(tag)?'active':''"
        :to="tag"
        :key="tag.path + '?' + formatQuery(tag) "
        class="tags-view-item"
        @contextmenu.prevent.native="openMenu(tag,$event)">
        {{tag.title}}
        <span class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)"/>
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags">关闭所有</li>
    </ul>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';

import ScrollPane from '@/components/ScrollPane/index.vue';
import {Route} from 'vue-router';
import {TagsViewModule} from '../../../store/modules/tagsView';
import {ElBreadcrumbItem} from 'element-ui/types/breadcrumb-item';
// @ts-ignore
import qs from 'qs';

@Component({
  components: {
    ScrollPane,
  },
})
export default class TagsView extends Vue {
  visible = false;
  top = 0;
  left = 0;
  selectedTag = {};

  formatQuery(v: Route) {
    return qs.stringify(v.query, {arrayFormat: 'repeat'});
  }

  get visitedViews() {
    return TagsViewModule.visitedViews;
  }
  mounted() {
    this.addViewTags();
  }

  @Watch('$route')
  routeChange() {
    console.log('路由变了...');
    this.addViewTags();
    this.moveToCurrentTag();
  }
  @Watch('visible')
  handlerVisible(value: boolean) {
    if (value) {
      document.body.addEventListener('click', this.closeMenu);
    } else {
      document.body.removeEventListener('click', this.closeMenu);
    }
  }
  generateRoute() {
    if (this.$route.name) {
      return this.$route;
    }
    return false;
  }

  isActive(route: Route) {
    return route.path === this.$route.path;
  }

  addViewTags() {
    const route = this.generateRoute();
    if (!route) {
      return false;
    }
    this.$store.dispatch('addVisitedViews', route);
  }

  moveToCurrentTag() {
    const tags = this.$refs.tag as ElBreadcrumbItem[];
    this.$nextTick(() => {
      for (const tag of tags) {
        const route = tag.to as Route;
        if (route.path === this.$route.path) {
          const scrollPane = (this.$refs.scrollPane) as ScrollPane;
          scrollPane.moveToTarget(tag.$el);
          break;
        }
      }
    });
  }

  closeSelectedTag(view: Route) {
    this.$store.dispatch('delVisitedViews', view).then(() => {
      if (this.isActive(view)) {
        const views = this.$store.state.tagsView.visitedViews;
        const latestView = views.slice(-1)[0];
        if (latestView) {
          this.$router.push(latestView);
        } else {
          this.$router.push('/');
        }
      }
    });
  }

  closeOthersTags() {
    this.$router.push(this.selectedTag);
    this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
      this.moveToCurrentTag();
    });
  }

  closeAllTags() {
    this.$store.dispatch('delAllViews');
    this.$router.push('/');
  }

  openMenu(tag: Route, e: MouseEvent) {
    this.visible = true;
    this.selectedTag = tag;
    const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
    this.left = e.clientX - offsetLeft + 15; // 15: margin right
    this.top = e.clientY;
  }

  closeMenu() {
    this.visible = false;
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '../../../../src/styles/variables.scss';

  .tags-view-container {
    .tags-view-wrapper {
      background: $tagsWrapperBg;
      height: 34px;
      border-bottom: 1px solid $tagsWrapperBbBg;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
      .tags-view-item {
        display: inline-block;
        position: relative;
        height: 26px;
        line-height: 26px;
        border: 1px solid #d8dce5;
        color: #495060;
        background: #fff;
        padding: 0 8px;
        font-size: 12px;
        margin-left: 5px;
        margin-top: 4px;
        &:first-of-type {
          margin-left: 15px;
        }
        &.active {
          background-color: #42b983;
          color: #fff;
          border-color: #42b983;
          &::before {
            content: '';
            background: #fff;
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            position: relative;
            margin-right: 2px;
          }
        }
      }
    }
    .contextmenu {
      margin: 0;
      background: #fff;
      z-index: 100;
      position: absolute;
      list-style-type: none;
      padding: 5px 0;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
      li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;
        &:hover {
          background: #eee;
        }
      }
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss">
  //reset element css of el-icon-close
  .tags-view-wrapper {
    .tags-view-item {
      .el-icon-close {
        width: 16px;
        height: 16px;
        vertical-align: 2px;
        border-radius: 50%;
        text-align: center;
        transition: all .3s cubic-bezier(.645, .045, .355, 1);
        transform-origin: 100% 50%;
        &:before {
          transform: scale(.6);
          display: inline-block;
          vertical-align: -3px;
        }
        &:hover {
          background-color: #b4bccc;
          color: #fff;
        }
      }
    }
  }
</style>
