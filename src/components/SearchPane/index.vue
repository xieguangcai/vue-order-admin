<template>
  <div class="search-panel">
    <slot/>
    <el-button type="primary" size="mini" icon="el-icon-search" @click="handleClick">查询</el-button>
  </div>
</template>

<script lang="ts">
  import {Component, Emit, Vue} from 'vue-property-decorator';

  @Component({
    name: 'SearchPane',
  })
  export default class SearchPane extends Vue {

    @Emit('click')
    handleClick(evt: MouseEvent) {
    }

  }
</script>
