<template>
    <div class="addWindows">
      <template>
         <el-form :model="editItem" :label-position="labelPosition"  label-width="120px">
           <el-form-item label="appCode：">
             <el-select v-model="editItem.appCode" placeholder="请选择appCode" @change="handleCodeChange(editItem.appCode)">
               <el-option
                 v-for="item in items"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
               </el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="scene：">
             <el-select v-model="editItem.scene" placeholder="请选择scene">
               <el-option
                 v-for="(item,index) in senceItems"
                 :label="item[index]"
                 :value="item[index]"
                 :key="item[index]"
               >
               </el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="背景图片">
             <el-upload :disabled="innerViewModel"
                        class="upload-demo"
                        :action="getActionUrl()"
                        :show-file-list="false"
                        :drag="true"
                        :headers="getAuthHeader()"
                        :on-success="(res,file)=>{return handleBgSuccess(res, file, editItem)}"
                        :on-error="uploadError"
                        list-type="picture-card">
               <img v-if="editItem.background" :src="editItem.background" class="bgImg">
               <i v-else class="el-icon-plus avatar-uploader-icon"></i>
               <div slot="tip" class="el-upload__tip">1000px*630px只能上传jpg/png文件，且不超过500kb</div>
             </el-upload>
           </el-form-item>
           <el-form-item label="关闭按钮图">
             <el-upload :disabled="innerViewModel"
                        class="upload-demo"
                        :action="getActionUrl()"
                        :show-file-list="false"
                        :drag="true"
                        :headers="getAuthHeader()"
                        :on-success="(res,file)=>{return handleCloseSuccess(res, file, editItem)}"
                        :on-error="uploadError"
                        list-type="picture-card">
               <img v-if="editItem.closeButton" :src="editItem.closeButton" class="img">
               <i v-else class="el-icon-plus avatar-uploader-icon"></i>
               <div slot="tip" class="el-upload__tip">288px*77px只能上传jpg/png文件，且不超过500kb</div>
             </el-upload>
           </el-form-item>
           <el-form-item label="关闭按钮获焦图">
             <el-upload :disabled="innerViewModel"
                        class="upload-demo"
                        :action="getActionUrl()"
                        :show-file-list="false"
                        :drag="true"
                        :headers="getAuthHeader()"
                        :on-success="(res,file)=>{return handleCloseFocusSuccess(res, file, editItem)}"
                        :on-error="uploadError"
                        list-type="picture-card">
               <img v-if="editItem.closeButtonFocus" :src="editItem.closeButtonFocus" class="img">
               <i v-else class="el-icon-plus avatar-uploader-icon"></i>
               <div slot="tip" class="el-upload__tip">288px*77px只能上传jpg/png文件，且不超过500kb</div>
             </el-upload>
           </el-form-item>
           <el-form-item label="取消按钮图">
             <el-upload :disabled="innerViewModel"
                        class="upload-demo"
                        :action="getActionUrl()"
                        :show-file-list="false"
                        :drag="true"
                        :headers="getAuthHeader()"
                        :on-success="(res,file)=>{return handleCancelSuccess(res, file, editItem)}"
                        :on-error="uploadError"
                        list-type="picture-card">
               <img v-if="editItem.cancelButton" :src="editItem.cancelButton" class="img">
               <i v-else class="el-icon-plus avatar-uploader-icon"></i>
               <div slot="tip" class="el-upload__tip">288px*77px只能上传jpg/png文件，且不超过500kb</div>
             </el-upload>
           </el-form-item>
           <el-form-item label="取消按钮获焦图">
             <el-upload :disabled="innerViewModel"
                        class="upload-demo"
                        :action="getActionUrl()"
                        :show-file-list="false"
                        :drag="true"
                        :headers="getAuthHeader()"
                        :on-success="(res,file)=>{return handleCancelFocusSuccess(res, file, editItem)}"
                        :on-error="uploadError"
                        list-type="picture-card">
               <img v-if="editItem.cancelButtonFocus" :src="editItem.cancelButtonFocus" class="img">
               <i v-else class="el-icon-plus avatar-uploader-icon"></i>
               <div slot="tip" class="el-upload__tip">288px*77px只能上传jpg/png文件，且不超过500kb</div>
             </el-upload>
           </el-form-item>
           <el-form-item style="margin-top: 30px">
             <el-button type="primary" @click="submitForm('editItem')"  v-if="addModel">保存新增</el-button>
             <el-button type="primary" @click="submitEditForm('editItem')"  v-if="!addModel">保存修改</el-button>
             <el-button @click="$router.push({path: 'autimatic-deduction-iframe'})">取消</el-button>
           </el-form-item>
         </el-form>
      </template>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {AutomaticDeductionIframe, ResponseResult, UploadFileInfo} from '../../../types';
import {AxiosResponse} from 'axios';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import {
    getAutomaticDeductionIframeDetail,
    addAutomaticDeductionIframe,
    getAppCodeList,
    getScene,
    editAutomaticDeductionIframe,
  } from '../../../api/pay';
import RightComponent from '../../../components/RightComponent';
import {AppModule} from '../../../store/modules/app';
import {Dictionary} from 'vuex';
import {getFullToken} from '../../../utils/auth';

@Component({
    name: 'windowsAdd',
    components: {},
    mixins: [RightComponent],
  })
    export default class WindowsAdd extends Vue {
    editItem: AutomaticDeductionIframe  = {id: 0, background: undefined, closeButton: undefined, closeButtonFocus: undefined, cancelButton: undefined, cancelButtonFocus: undefined};
    labelPosition: string = 'right';
    items: AutomaticDeductionIframe  = {id: 0};
    senceItems: AutomaticDeductionIframe  = {id: 0};
    addModel: boolean = true ;


    handleCodeChange(newVal: string) {
      this.getSceneInfo(newVal);
    }

    getSceneInfo(val: any) {
      getScene(val).then((response: AxiosResponse<ResponseResult<AutomaticDeductionIframe>>) =>  {
        console.log(response.data.data);
        this.senceItems = response.data.data;
//        this.editItem.scene = response.data.data[0];
      }).catch(handlerCommonError);
    }

    getAppCode() {
      getAppCodeList().then((response: AxiosResponse<ResponseResult<AutomaticDeductionIframe>>) => {
        if (response.data.success && response.data.data) {
          this.items = response.data.data;
        }
      }).catch(handlerCommonError);
   }

    submitForm(formName: AutomaticDeductionIframe ) {
      addAutomaticDeductionIframe(this.editItem).then((response: AxiosResponse<ResponseResult<boolean>>) => {
        if (response.data.success && response.data.data) {
          this.$router.push({path: 'autimatic-deduction-iframe'});
        }
      }).catch(handlerCommonError);
    }

    submitEditForm(formName: AutomaticDeductionIframe ) {
      editAutomaticDeductionIframe(this.editItem).then((response: AxiosResponse<ResponseResult<boolean>>) => {
        if (response.data.success && response.data.data) {
          this.$router.push({path: 'autimatic-deduction-iframe'});
        }
      }).catch(handlerCommonError);
    }

    created() {
      const x = parseInt(this.$route.query.id, 0);
      try  {
        const model = this.$route.query.viewModel;
        if (model === 'add') {
            console.log('新增模式');
            this.addModel = true;
          } else {
            console.log('编辑模式');
            this.addModel = false;
            getAutomaticDeductionIframeDetail(x).then((response: AxiosResponse<ResponseResult<AutomaticDeductionIframe>>) => {
            const responseData = response.data.data;
            console.log(responseData);
            this.editItem = responseData;
            this.getSceneInfo(this.editItem.appCode);
          }).catch(handlerCommonError);
        }
        this.getAppCode();
        } catch (e) {

        }
    }

    getAuthHeader(): Dictionary<string> {
      const headerInfo = {Authorization: getFullToken()};
      return headerInfo;
    }

    getActionUrl(): string {
      return AppModule.uploadAction;
    }

    handleBgSuccess(res: ResponseResult<UploadFileInfo>, file: any, editItem: AutomaticDeductionIframe) {
      console.log(res);
      if (res.success) {
        editItem.background = res.data.url;
      } else {
        this.$message.error(res.message);
      }
    }

    handleCloseSuccess(res: ResponseResult<UploadFileInfo>, file: any, editItem: AutomaticDeductionIframe) {
      console.log(res);
      if (res.success) {
        editItem.closeButton = res.data.url;
      } else {
        this.$message.error(res.message);
      }
    }

    handleCloseFocusSuccess(res: ResponseResult<UploadFileInfo>, file: any, editItem: AutomaticDeductionIframe) {
      console.log(res);
      if (res.success) {
        editItem.closeButtonFocus = res.data.url;
      } else {
        this.$message.error(res.message);
      }
    }

    handleCancelSuccess(res: ResponseResult<UploadFileInfo>, file: any, editItem: AutomaticDeductionIframe) {
      if (res.success) {
        editItem.cancelButton = res.data.url;
      } else {
        this.$message.error(res.message);
      }
    }

    handleCancelFocusSuccess(res: ResponseResult<UploadFileInfo>, file: any, editItem: AutomaticDeductionIframe) {
      console.log(res);
      if (res.success) {
        editItem.cancelButtonFocus = res.data.url;
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
  .addWindows{
    margin: 30px 50px;
    width: 40vw;
  }

  .addWindows >>> .el-upload-dragger {
    height: 160px;
  }

  .addWindows >>> .el-upload-dragger .bgImg{
    height: 160px;
  }
</style>
