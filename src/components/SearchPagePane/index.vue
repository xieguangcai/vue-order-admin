<template>
  <div class="search-page-panel">
    <el-pagination
      :current-page="pageInfo.page + 1"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[1,50, 100, 200, 300]"
      :page-size="pageInfo.size || 1"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageInfo.total">
    </el-pagination>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";

  export interface PageInfo {
    page: number,
    size: number,
    total: number
  }

  @Component({
    name:'SearchPagePane'
  })
  export default class SearchPagePane extends Vue {

    @Prop({default: {page: 0, size: 50, total: 0}})
    pageInfo: PageInfo;

    handleSizeChange(evt) {
      this.$emit('size-change', evt);
    }

    handleCurrentChange(evt) {
      this.$emit('current-change', evt);
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .search-page-panel {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
