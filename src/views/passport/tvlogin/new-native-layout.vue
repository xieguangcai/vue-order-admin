<template>
  <div>
    <native-view-edit v-bind:domain-id.sync="domainId" :view-model="viewModel"></native-view-edit>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import NativeViewEdit from './native-view-edit.vue';

@Component({
  name: 'NewNativeLayout',
  components: {NativeViewEdit},
})
export default class NewNativeLayout extends Vue {
  domainId: number = 0;
  viewModel: boolean = false;

  activated() {
    if(this.domainId != 0){
      this.domainId = 0;
    }
  }
}
</script>

<style scoped>

</style>
