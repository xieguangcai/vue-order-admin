<template>
  <div class="app-container">
    <div class="cc-list-row">
      <slot name="action" />
      <slot name="searchpane"/>
    </div>
    <div class="cc-list-row">
      <slot/>
    </div>
    <div class="cc-list-row">
      <slot name="page"/>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

@Component({
  name: 'ListTablePane',
})
export default class ListTablePane extends Vue {

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .cc-list-row {margin-bottom:10px;}
  .cc-list-row .cc-action-button-group{margin-left:6px;}
  .cc-list-row .el-input{width:200px;}
  .cc-list-row .el-button{margin-left:10px;}
</style>
