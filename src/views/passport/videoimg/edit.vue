<template>
  <div class="addWindows" style="margin-top: 25px;">
  <el-form :model="domainInfo" ref="editForm" :rules="rules" :size="formSize">
    <el-form-item label="视频源" :label-width="formLabelWidth" prop="tvSource">
      <el-select v-model="domainInfo.tvSource" placeholder="选择视频">
        <el-option v-for="item in videoSource" :label="item.label" :value="item.value" :key="item.value"/>
      </el-select>
    </el-form-item>
    <el-form-item label="用户类型" :label-width="formLabelWidth" prop="userType">
      <el-select v-model="domainInfo.userType" placeholder="选择用户类型" size="mini" >
        <el-option label="非会员用户" value="1"></el-option>
        <el-option label="会员用户" value="2"></el-option>
        <el-option label="过期会员" value="3"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="优先级" :label-width="formLabelWidth" prop="sortOrder">
      <el-input v-model="domainInfo.sortOrder"></el-input>
    </el-form-item>
    <el-form-item label="有效期开始时间" :label-width="formLabelWidth" prop="startTime">
      <el-date-picker type="date" placeholder="选择有效期开始时间" value-format="yyyy-MM-dd HH:mm:ss"  v-model="domainInfo.startTime"></el-date-picker>
    </el-form-item>
    <el-form-item label="有效期结束时间" :label-width="formLabelWidth" prop="endTime">
      <el-date-picker type="date" placeholder="选择有效期结束时间" value-format="yyyy-MM-dd HH:mm:ss"  v-model="domainInfo.endTime"></el-date-picker>
    </el-form-item>
    <el-form-item label="VIP运营图标" :label-width="formLabelWidth">
      <el-upload :disabled="innerViewModel"
                 class="upload-demo"
                 :action="getActionUrl()"
                 :show-file-list="false"
                 :drag="true"
                 :headers="getAuthHeader()"
                 :on-success="(res,file)=>{return handleCancelFocusSuccess(res, file, domainInfo)}"
                 :on-error="uploadError"
                 list-type="picture-card">
        <img v-if="domainInfo.imgUrl" :src="domainInfo.imgUrl" class="img" id="videoImgUrl">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        <div slot="tip" class="el-upload__tip">180px*45px 只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-form-item>

    <div class="cc-edit-button">
      <el-button type="primary" icon="el-icon-edit" @click="submitForm('domainInfo')">保存</el-button>
      <el-button type="info" icon="el-icon-close" @click="cancel">取消</el-button>
    </div>
  </el-form>
  </div>
</template>


<script lang="ts">
  import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
  import { ResponseResult, UploadFileInfo, VideoImg} from '../../../types/index';
  import {getVideoImgInfo, saveVideoImg} from '../../../api/passport';
  import BaseEdit from '../../../components/BaseEdit';
  import {handlerCommonError} from '../../../utils/auth-interceptor';
  import {AppModule} from "@/store/modules/app";
  import {getFullToken} from "@/utils/auth";
  import {Dictionary} from "vuex";
  import {AxiosResponse} from "axios";

  @Component({
    name: 'VideoImgEdit',
    components: {},
    mixins: [ BaseEdit ],
  })
  export default class VideoImgEdit extends Vue {
    domainInfo: VideoImg = {sortOrder: 1, imgUrl: undefined};
    @Prop({type: Number, default: 0})
    domainId: number = 0;
    addModel: boolean = true ;

    rules = {
      tvSource: [{required: true, message: '请选择视频源', trigger: 'blur'}, {
        trigger: 'blur',
      }],
      userType: [{required: true, message: '请选择用户类型', trigger: 'blur'}, {
        trigger: 'blur',
      }],
      startTime: [{required: true, message: '请输入有效期开始时间', trigger: 'blur'}, {
        trigger: 'blur',
      }],
      endTime: [{required: true, message: '请输入有效期结束时间', trigger: 'blur'}, {
        trigger: 'blur',
      }]
    };


    @Watch('domainId', {immediate: true})
    handleDomainIdChange(newVal: number | undefined, oldVal: number| undefined) {
      if ( null == newVal || newVal === 0) {
        this.domainInfo = {sortOrder: 1, imgUrl: undefined};
      } else {
        // @ts-ignore
        this.showLoading();
        getVideoImgInfo(this.domainId).then((resolve) => {
          this.domainInfo = resolve.data.data;
        }).catch(handlerCommonError).finally(() => {
          // @ts-ignore
          this.hiddenLoading();
        });
      }
    }

    @Watch('domainInfo', {immediate: true})
    handleInternalDomainInfoChange(newVal: VideoImg, oldVal?: VideoImg): void {
      if (null == newVal && null == oldVal) {
        return;
      }
      if (newVal != null && oldVal != null) {
        this.domainIdChange(newVal.id, oldVal.id);
      } else if (oldVal != null) {
        this.domainIdChange(0, oldVal.id);
      } else if (newVal != null) {
        this.domainIdChange(newVal.id, 0);
      }
    }

    @Emit('update:domainId')
    domainIdChange(newVal: number | undefined, oldVal: number | undefined): void {
    }

    getActionUrl(): string {
      return AppModule.uploadAction;
    }

    getAuthHeader(): Dictionary<string> {
      const headerInfo = {Authorization: getFullToken()};
      return headerInfo;
    }

    handleCancelFocusSuccess(res: ResponseResult<UploadFileInfo>, file: any, domainInfo: VideoImg) {
      if (res.success) {
        domainInfo.imgUrl = res.data.url;

      } else {
        this.$message.error(res.message);
      }
    }

    created() {
      const x = parseInt(this.$route.query.id, 0);
      try  {
        const model = this.$route.query.viewModel;
        if (model === 'add') {
          this.addModel = true;
        } else {
          this.addModel = false;
          getVideoImgInfo(x).then((response: AxiosResponse<ResponseResult<VideoImg>>) => {
            const responseData = response.data.data;
            this.domainInfo = responseData;
          }).catch(handlerCommonError);
        }
      } catch (e) {

      }
    }


    uploadError(res: ResponseResult<string>) {
      const msg = (res != null ? res.message : null) || '上传文件失败';
      this.$message.error(msg);
    }

    submitForm(formName: VideoImg ) {
      saveVideoImg(this.domainInfo).then((response: AxiosResponse<ResponseResult<boolean>>) => {
        if (response.data.success && response.data.data) {
          this.$message.success('保存成功');


        }
      }).catch(handlerCommonError);
    }

  }
</script>
<style rel="stylesheet/scss" lang="scss">

  .upload-demo .el-upload-dragger {
    width: 190px;
    height: 148px;
  }

  .addWindows >>> .el-upload-dragger .bgImg{
    height: 50px;
    width: 200px;
  }
</style>
