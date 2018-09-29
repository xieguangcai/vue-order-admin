<template>
  <div class="search-page-panel">
    <el-pagination
      background
      :current-page="page + 1"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[1,50, 100, 200, 300]"
      :page-size="size || 1"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';

@Component({
  name: 'SearchPagePane',
})
export default class SearchPagePane extends Vue {

  @Prop({ type: Number, default: 1})
  page: number = 1;
  @Prop({ type: Number, default: 50})
  size: number = 50;
  @Prop({ type: Number, default: 0})
  total: number = 0;

  @Emit('size-change')
  handleSizeChange(evt: number) {}

  @Emit('current-change')
  handleCurrentChange(evt: number) {}

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .search-page-panel {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
