<template>
    <div class="addWindows">
      <template>
         <el-form :model="editItem" :label-position="labelPosition"  label-width="120px">
           <el-form-item label="appCode：">
             <el-select v-model="editItem.appCode" placeholder="请选择appCode">
               <el-option
                 v-for="item in items"
                 :key="item.value"
                 :label="item.value"
                 :value="item.value">
               </el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="scene：" :label-width="formLabelWidth" prop="scene">
             <el-input v-model="editItem.scene"></el-input>
           </el-form-item>
           <el-form-item label="产品包名称：" :label-width="formLabelWidth" prop="prodName">
             <el-input v-model="editItem.prodName"></el-input>
           </el-form-item>
           <el-form-item label="产品包类型：">
             <el-select v-model="editItem.payTypeUnit" placeholder="请选择产品包类型">
               <el-option value="1" label="包月"></el-option>
               <el-option value="2" label="包季"></el-option>
               <el-option value="3" label="包半年"></el-option>
               <el-option value="4" label="包年"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="限制金额：" :label-width="formLabelWidth" prop="payLimit">
             <el-input v-model="editItem.payLimit"></el-input>
           </el-form-item>
           <el-form-item label="状态：">
             <el-select v-model="editItem.status" placeholder="请选择状态">
               <el-option value="0" label="未使用"></el-option>
               <el-option value="1" label="使用中"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item style="margin-top: 30px">
             <el-button type="primary" @click="submitForm('editItem')"  v-if="addModel">保存新增</el-button>
             <el-button type="primary" @click="submitEditForm('editItem')"  v-if="!addModel">保存修改</el-button>
             <el-button @click="$router.push({path: 'autimatic-app-scene'})">取消</el-button>
           </el-form-item>
         </el-form>
      </template>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {AutomaticDeductionAppScene, ResponseResult} from '../../../types';
import {AxiosResponse} from 'axios';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import {
  editAutomaticDeductionAppScene,
  addAutomaticDeductionAppScene,
  getAppCode,
  getAutomaticDeductionAppSceneDetail,
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
    editItem: AutomaticDeductionAppScene  = {id: 0, appCode: undefined, scene: undefined, prodName: undefined, payLimit: undefined, payTypeUnit: undefined};
    labelPosition: string = 'right';
    items: AutomaticDeductionAppScene  = {id: 0};
    addModel: boolean = true ;

    getAppCode() {
      getAppCode().then((response: AxiosResponse<ResponseResult<AutomaticDeductionAppScene>>) => {
        if (response.data.success && response.data.data) {
          this.items = response.data.data;
        }
      }).catch(handlerCommonError);
   }

    submitForm(formName: AutomaticDeductionAppScene ) {
      addAutomaticDeductionAppScene(this.editItem).then((response: AxiosResponse<ResponseResult<boolean>>) => {
        if (response.data.success && response.data.data) {
          this.$router.push({path: 'autimatic-app-scene'});
        }
      }).catch(handlerCommonError);
    }

    submitEditForm(formName: AutomaticDeductionAppScene ) {
      editAutomaticDeductionAppScene(this.editItem).then((response: AxiosResponse<ResponseResult<boolean>>) => {
        if (response.data.success && response.data.data) {
          debugger
          this.$router.push({path: 'autimatic-app-scene'});
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
            getAutomaticDeductionAppSceneDetail(x).then((response: AxiosResponse<ResponseResult<AutomaticDeductionAppScene>>) => {
            const responseData = response.data.data;
            console.log(responseData);
            this.editItem = responseData;
            //this.getSceneInfo(this.editItem.appCode);
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
