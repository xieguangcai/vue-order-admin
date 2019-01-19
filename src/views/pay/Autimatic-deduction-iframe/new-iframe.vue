<template>
    <div>
      <template>
         <el-form v-model="editItem">
           <el-form-item label="上传背景图片">
             <el-upload :disabled="innerViewModel"
                        class="upload-demo"
                        :action="getActionUrl()"
                        :show-file-list="false"
                        :drag="true"
                        :headers="getAuthHeader()"
                        :on-success="(res,file)=>{return handleBgSuccess(res, file, editItem)}"
                        :on-error="uploadError"
                        list-type="picture-card">
               <img v-if="editItem.background" :src="editItem.background" class="img">
               <i v-else class="el-icon-plus avatar-uploader-icon"></i>
               <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
             </el-upload>
           </el-form-item>
         </el-form>
      </template>
    </div>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import {AutomaticDeductionIframe, ResponseResult, UploadFileInfo} from '../../../types';
  import {AxiosResponse} from 'axios';
  import {handlerCommonError} from '../../../utils/auth-interceptor';
  import {
    getAutomaticDeductionIframeDetail}
    from '../../../api/pay';
  import RightComponent from "../../../components/RightComponent";
  import {AppModule} from "../../../store/modules/app";
  import {Dictionary} from "vuex";
  import {getFullToken} from "../../../utils/auth";

  @Component({
    name: 'windowsAdd',
    components: {},
    mixins: [RightComponent],
  })
    export default class windowsAdd extends Vue {
    editItem: AutomaticDeductionIframe[] =[];

    getAuthHeader(): Dictionary<string> {
      const headerInfo = {Authorization: getFullToken()};
      return headerInfo;
    }

    getActionUrl(): string {
      return AppModule.uploadAction;
    }

    handleBgSuccess(res: ResponseResult<UploadFileInfo>, file: any, editItem: AutomaticDeductionIframe) {
      console.log(res);
      debugger;
      if (res.success) {
        editItem.background = res.data.url;
      } else {
        this.$message.error(res.message);
      }
    }

    uploadError(res: ResponseResult<string>) {
      const msg = (res != null ? res.message : null) || '上传文件失败';
      this.$message.error(msg);
    }

    }
</script>

<style scoped>

</style>
