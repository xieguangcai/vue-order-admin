<template>
  <div class="search-page-panel">
    <el-pagination
      background
      :current-page="innerPage"
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
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';

@Component({
  name: 'SearchPagePane',
})
export default class SearchPagePane extends Vue {

  get innerPage(){
    return this.page + 1;
  }
  get innerSize():number{
    return this.size || 1;
  }
  get innerTotal():number{
    return this.total;
  }
  @Prop({ type: Number, default: 0})
  page: number = 0;
  @Prop({ type: Number, default: 50})
  size: number = 50;
  @Prop({ type: Number, default: 0})
  total: number = 0;

  @Emit('size-change')
  handleSizeChange(evt: number) {}

  handleCurrentChange(evt: number) {
    this.triggerCurrentChange(evt - 1);
  }

  @Emit('current-change')
  triggerCurrentChange(evt: number) {}

}
</script>
