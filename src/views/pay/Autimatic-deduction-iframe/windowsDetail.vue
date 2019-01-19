<template>
  <div :model="data">
    <div>挽留弹窗详情</div>
    <el-form>
      <el-form-item label="id：">
        {{data.id}}
      </el-form-item>
      <el-form-item label="状态：">
        {{data.status}}
      </el-form-item>
      <el-form-item label="背景图：">
        <img :src="data.background" class="img">
      </el-form-item>
      <el-form-item label="关闭按钮：">
        {{data.closeButton}}
      </el-form-item>
      <el-form-item label="关闭按钮获焦：">
        {{data.closeButtonFocus}}
      </el-form-item>
      <el-form-item label="取消按钮：">
        {{data.cancelButton}}
      </el-form-item>
      <el-form-item label="取消按钮获焦：">
        {{data.cancelButtonFocus}}
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import {AutomaticDeductionIframe,  ResponseResult} from '../../../types';
  import {AxiosResponse} from 'axios';
  import {handlerCommonError} from '../../../utils/auth-interceptor';
  import {
    getAutomaticDeductionIframeDetail}
    from '../../../api/pay';
  import RightComponent from "../../../components/RightComponent";

  @Component({
    name: 'windowsDetail',
    components: {},
    mixins: [RightComponent],
  })


  export default class windowsDetail extends Vue{
    data: AutomaticDeductionIframe = {id: 0};


    realFetchData() {
      const x = parseInt(this.$route.query.id, 0);
      if (x != null) {
        this.data.id = x;
        getAutomaticDeductionIframeDetail(x).then((response: AxiosResponse<ResponseResult<AutomaticDeductionIframe>>) => {
          const responseData = response.data.data;
          console.log(responseData);
          this.data = responseData;
        }).catch(handlerCommonError);
      }
    }

    created() {
      try {
        // @ts-ignore
        // debugger
        this.realFetchData();
      } catch (e) {
      }
    }


  }
</script>

<style scoped>

</style>
