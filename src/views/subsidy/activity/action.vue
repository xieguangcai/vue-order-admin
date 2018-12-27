<template>
  <div>
    <el-collapse v-model="activeNames">

      <el-collapse-item :title="活动信息" name="1">
        <el-table-column label="活动状态" width="80px">
          <template slot-scope="scope">
            asdad
          </template>
        </el-table-column>
      </el-collapse-item>


    </el-collapse>
  </div>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
import {
  SubsidyActivityInfo,
} from '../../../types';
import {} from '../../../api/subsidy';

@Component({
  name: 'ActivityInfoAction',
  components: {},
})
export default class ActivityInfoAction extends Vue {
  activeNames: string[] = ['1'];
  domainInfo: SubsidyActivityInfo = {subsidyActivityId: 0};


}
</script>


<style scoped>

</style>

