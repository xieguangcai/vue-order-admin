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

<style rel="stylesheet/scss" lang="scss" scoped>
  .search-panel {
    margin-bottom: 10px;
    display: inline;
    font-size: 14px;
  }

  .search-panel .el-input {
    width: 150px;
    margin: 3px 6px;
  }

  .search-panel .el-date-editor {
    width: 180px;
    margin: 3px 6px;
  }

  .search-panel .el-range-editor {
    width: 220px;
    margin: 3px 6px;
  }

  .search-panel .el-button {
    margin-left: 10px;
  }

  .search-panel .el-select {
    margin: 3px 6px;
  }
</style>
