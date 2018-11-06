<template>
  <div class="search-page-panel">
    <el-pagination
      background
      :current-page="innerPage + 1"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[1,50, 100, 200, 300]"
      :page-size="innerSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="innerTotal">
    </el-pagination>
  </div>
</template>

<script lang="ts">
  import {Component, Emit, Model, Prop, Vue, Watch} from 'vue-property-decorator';

  @Component({
    name: 'SearchPagePane',
  })
  export default class SearchPagePane extends Vue {
    get innerPage(): number {
      return this.page;
    }

    get innerSize(): number {
      return this.size || 1;
    }

    get innerTotal(): number {
      return this.total || 0;
    }

    @Prop({type: Number, default: 0})
      // @ts-ignore
    page: number;
    @Prop({type: Number, default: 50})
      // @ts-ignore
    size: number;
    @Prop({type: Number, default: 0})
      // @ts-ignore
    total: number;

    @Emit('size-change')
    handleSizeChange(evt: number) {
    }

    handleCurrentChange(evt: number) {
      this.triggerCurrentChange(evt - 1);
    }

    @Emit('current-change')
    triggerCurrentChange(evt: number) {
    }

  }
</script>
