<template>
  <div>
    <native-view-edit :domain-id="domainId" :view-model="viewModel"></native-view-edit>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import NativeViewEdit from './native-view-edit.vue';

@Component({
  name: 'EditNativeLayout',
  components: {NativeViewEdit},
})
export default class EditNativeLayout extends Vue {
  domainId: number = 0;
  viewModel: boolean = false;

  created() {
    try {
      // @ts-ignore
      const x = parseInt(this.$route.query.id, 10);
      if (!isNaN(x)) {
        this.domainId = x;
        this.viewModel = false;
      }
    } catch (e) {
    }
  }
}
</script>

<style scoped>

</style>
