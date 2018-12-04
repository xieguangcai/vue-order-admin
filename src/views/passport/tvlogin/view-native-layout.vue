<template>
  <native-view-edit :domain-id="domainId" :view-model="viewModel"></native-view-edit>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import NativeViewEdit from './native-view-edit.vue';

@Component({
  name: 'ViewNativeLayout',
  components: {NativeViewEdit},
})
export default class ViewNativeLayout extends Vue {

  domainId: number = 1;
  viewModel: boolean = true;

  mounted() {
    // @ts-ignore
    // this.domainId = this.$route.query.id;
  }
}
</script>

<style scoped>

</style>
