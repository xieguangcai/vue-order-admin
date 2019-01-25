<template>
  <div :model="data" class="windows_detail">
    <div class="title">挽留弹窗详情</div>
    <el-form :label-position="labelPosition"  label-width="120px">
      <el-form-item label="id：">
        {{data.id}}
      </el-form-item>
      <el-form-item label="状态：">
        {{data.status}}
      </el-form-item>
      <el-form-item label="背景图：">
        <img :src="data.background" class="bgImg">
      </el-form-item>
      <el-form-item label="关闭按钮：">
        <img :src="data.closeButton" class="img">
      </el-form-item>
      <el-form-item label="关闭按钮获焦：">
        <img :src="data.closeButtonFocus" class="img">
      </el-form-item>
      <el-form-item label="取消按钮：">
        <img :src="data.cancelButton" class="img">
      </el-form-item>
      <el-form-item label="取消按钮获焦：">
        <img :src="data.cancelButtonFocus" class="img">
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
    labelPosition: string = 'right';


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
  .windows_detail{
    margin: 50px;
  }

  .windows_detail .img{
    width: 288px;
    height: 77px;
  }

  .windows_detail .bgImg {
    width: 1000px;
    height: 630px;
  }

  .title {
    margin: 30px;
    font-weight: bold;
  }

</style>
