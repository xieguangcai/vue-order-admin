<template>
  <div>
    <native-view-edit :domain-id="domainId" :view-model="viewModel"></native-view-edit>
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
}
</script>

<style scoped>

</style>
