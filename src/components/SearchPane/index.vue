<template>
  <div class="search-panel">
    <transition name="el-zoom-in-top">
    <div class="search-con-container" v-if="showSearchCon">
      <slot/>
    </div>
    </transition>
    <el-button type="primary" size="mini" icon="el-icon-search" @click="handleClick">查询</el-button>
    <el-button type="info" size="mini" icon="el-icon-search" @click="showSearchCon = !showSearchCon ">{{ showSearchCon ? '隐藏查询条件' : '显示查询条件'}}</el-button>
  </div>
</template>

<script lang="ts">
  import {Component, Emit, Vue} from 'vue-property-decorator';

  @Component({
    name: 'SearchPane',
  })
  export default class SearchPane extends Vue {

    showSearchCon: boolean = true;

    @Emit('click')
    handleClick(evt: MouseEvent) {
    }

  }
</script>
