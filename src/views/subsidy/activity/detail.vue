<template>
  <div>
    <el-collapse v-model="activeNames">

      <el-collapse-item :title="'活动信息['+ domainInfo.orderNo +']'" name="1">

      </el-collapse-item>









    </el-collapse>
  </div>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
import {
  SubsidyActivityInfo
} from '../../../types';
import {} from '../../../api/subsidy';

@Component({
  name: 'ActivityInfoDetail',
  components: {},
})
export default class ActivityInfoDetail extends Vue {
  activeNames: string[] = ['1'];
  domainInfo: SubsidyActivityInfo = {subsidyActivityId: 0};


}
</script>


<style scoped>

</style>

