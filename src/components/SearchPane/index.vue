<template>
  <div class="search-panel">
    <slot/>
    <el-button  type="primary" icon="el-icon-search" @click="handleClick" >查询</el-button>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";

  @Component({
    name: 'SearchPane'
  })
  export default class SearchPane extends Vue {
    handleClick(evt){
      this.$emit('click', evt);
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .search-panel {
    margin-bottom:10px;
  }
  .search-panel .el-input{width:200px;}
  .search-panel .el-button{margin-left:10px;}
</style>
