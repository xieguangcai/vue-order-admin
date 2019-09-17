<template>
  <div class="search-page-panel">
    <el-pagination
      background
      :current-page="innerPage + 1"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[15]"
      :page-size="innerSize"
      layout="total, sizes, prev, pager, next"
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
      console.log('page==='+this.page);
      return this.page;
    }

    get innerSize(): number {
      console.log('size==='+this.size);
      return this.size || 1;
    }

    get innerTotal(): number {
      console.log('total==='+this.total);
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
