<template>
  <div class="cc-view-temp" v-if="editLoginLayout != null">
    <div class=" cc-view-con cc-view-page-con">
      <div class="cc-view-container" :style="{zoom: zoomValue}">
        <div class="cc-view-main">
          <div class="cc-view-page" :style="commonStyle" @click="editItemProp(editLoginLayout.commonBg)">

          </div>
          <template v-for="boxItem in currentEditPage.itemList">
            <div :class="boxItem === editItem? 'cc-view-item current-edit-com': 'cc-view-item'"
                 :style="getItemStyle(boxItem, 16)">
              <template v-if="boxItem.type === 'IMAGE'">
                <img :src="boxItem.imgUrl" style="background-color:#ff861c;" :style="getItemStyle(boxItem)"
                     @click="editItemProp(boxItem)"/>
              </template>
              <template v-if="boxItem.type === 'TEXT'">
                <div :style="getItemStyle(boxItem)" @click="editItemProp(boxItem)">
                  {{ boxItem.text }}
                </div>
              </template>
              <template v-if="boxItem.type === 'BUTTON'">
                <div :style="getItemStyle(boxItem)" @mousedown.left="(ev)=>{changeBg(true, boxItem, ev.target)}"
                     @mouseup.left="(ev)=>{changeBg(false, boxItem, ev.target)}" @click="editItemProp(boxItem)">
                  {{ boxItem.text }}
                </div>
              </template>
              <template v-if="boxItem.type === 'TEXT_VERSION'">
                <div :style="getItemStyle(boxItem)" @click="editItemProp(boxItem)">
                  V1.4.4
                </div>
              </template>
              <template v-if="boxItem.type === 'IMAGE_QR_CODE'">
                <template v-if="boxItem.imgUrl != null && boxItem.imgUrl != '' ">
                  <img :src="boxItem.imgUrl" :style="getItemStyle(boxItem)"
                       @click="editItemProp(boxItem)"/>
                </template>
                <template v-else>
                  <img src="@/assets/img/1543313198.png" :style="getItemStyle(boxItem)"
                       @click="editItemProp(boxItem)"/>
                </template>
              </template>
              <template v-if="boxItem.type === 'COMMON_LOGIN_BY_MOBILE'">
                <template v-if="boxItem.imgUrl != null && boxItem.imgUrl != '' ">
                  <img :src="boxItem.imgUrl" :style="getItemStyle(boxItem)"
                       @click="editItemProp(boxItem)"/>
                </template>
                <template v-else>
                  <img src="@/assets/img/1543313200.png" :style="getItemStyle(boxItem)"
                       @click="editItemProp(boxItem)"/>
                </template>
              </template>

            </div>
          </template>
        </div>
      </div>
      <div>
        <div class="cc-page-edit">
          <h3>页面编辑器
            <el-switch
              v-model="zoomValue"
              active-color="#13ce66"
              :active-value="0.4"
              :inactive-value="1"
              active-text="缩放页面"
              inactive-color="#ff4949">
            </el-switch>
            {{zoomValue}}
          </h3>
          页面切换方式：
          <el-switch
            v-model="editLoginLayout.switchType"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="up_down"
            inactive-value="left_right"
            active-text="上下切换"
            @change="rebuildSwitchPageData"
            :disabled="innerViewModel"
            inactive-text="左右切换">
          </el-switch>
          <div class="cc-page-edit-con">
            <el-button size="mini" icon="el-icon-tickets"
                       v-for="tag in editLoginLayout.pageList"
                       :class="tag.isDefault ? 'default-page-border': ''"
                       :key="tag.id"
                       @click="()=>{pageSelect(tag)}"
                       :type="tag.id == currentEditPage.id ? 'success' : ''">
              页面:{{tag.name}}
            </el-button>
            <el-button v-if="innerViewModel === false" type="warning" size="mini" icon="el-icon-circle-plus-outline"
                       @click="addNewPage">
              添加新页面
            </el-button>
          </div>
          <div>
            <div v-if="innerViewModel === false">编辑选中页面属性</div>
            <div v-if="innerViewModel === true">查看选中页面属性</div>
            <el-form :model="currentEditPage" :inline="true" label-width="100px" size="mini">
              <el-form-item label="页面ID">
                {{currentEditPage.id}}
              </el-form-item>
              <el-form-item label="页面名称">
                <el-input v-model="currentEditPage.name" :disabled="innerViewModel"></el-input>
              </el-form-item>
              <el-form-item label="默认页">
                <el-switch :disabled="currentEditPage.isDefault || innerViewModel" v-model="currentEditPage.isDefault"
                           @change="(val)=>{defaultPageChange(val, currentEditPage)}"></el-switch>
              </el-form-item>
              <el-button v-if="innerViewModel === false" type="danger" size="mini" icon="el-icon-delete"
                         @click="removePage">删除该页面
              </el-button>
              <br/>
              <el-form-item label="选择类型" prop="type" v-if="innerViewModel === false">
                <el-select v-model="newComType" placeholder="请选择类型">
                  <el-option label="文本" value="TEXT"></el-option>
                  <el-option label="图片" value="IMAGE"></el-option>
                  <el-option label="按钮" value="BUTTON"></el-option>
                  <el-option label="版本号" value="TEXT_VERSION"></el-option>
                  <el-option label="登录二维码" value="IMAGE_QR_CODE"></el-option>
                  <el-option label="手机号登录控件" value="COMMON_LOGIN_BY_MOBILE"></el-option>
                </el-select>
              </el-form-item>
              <el-button v-if="innerViewModel === false" type="primary" size="mini" icon="el-icon-delete"
                         @click="addComponent">添加组件
              </el-button>
            </el-form>
            <div>
              页面切换器
            </div>
            <div>
              <div v-for="tag in currentEditPage.switchPage">
                按键《{{getCodeName(tag.keyCode)}}键》，跳转至id={{tag.toPageId}}页面
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="cc-view-controller cc-view-con">
      <div class="cc-component-properties-edit">
        <div>属性编辑器</div>
        <div v-if="editItem">
          <el-form :model="editItem" :rules="rules" ref="ruleForm" label-width="100px" size="mini">
            <el-form-item label="类型" prop="type">
              <el-select v-model="editItem.type" disabled="" placeholder="请选择类型">
                <el-option label="通用背景" value="COMMON"></el-option>
                <el-option label="文本" value="TEXT"></el-option>
                <el-option label="图片" value="IMAGE"></el-option>
                <el-option label="按钮" value="BUTTON"></el-option>
                <el-option label="版本号" value="TEXT_VERSION"></el-option>
                <el-option label="登录二维码" value="IMAGE_QR_CODE"></el-option>
                <el-option label="手机号登录控件" value="COMMON_LOGIN_BY_MOBILE"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="X位置" prop="x">
              <el-input-number v-model="editItem.x" :min="0" :max="1920" :disabled="innerViewModel"></el-input-number>
            </el-form-item>
            <el-form-item label="Y位置" prop="y">
              <el-input-number v-model="editItem.y" :min="0" :max="1080" :disabled="innerViewModel"></el-input-number>
            </el-form-item>
            <el-form-item label="宽度" prop="w">
              <el-input-number v-model="editItem.w" :min="0" :max="1920" :disabled="innerViewModel"></el-input-number>
            </el-form-item>
            <el-form-item label="高度" prop="h">
              <el-input-number v-model="editItem.h" :min="0" :max="1080" :disabled="innerViewModel"></el-input-number>
            </el-form-item>
            <template v-if="editItem.type === 'TEXT' || editItem.type === 'BUTTON' ">
              <el-form-item label="文字" prop="text">
                <el-input v-model="editItem.text" :disabled="innerViewModel"></el-input>
              </el-form-item>
              <el-form-item label="大小" prop="size">
                <el-input-number v-model="editItem.size" :min="8" :max="56"
                                 :disabled="innerViewModel"></el-input-number>
              </el-form-item>
              <el-form-item label="颜色" prop="color">
                <el-color-picker v-model="editItem.color" show-alpha size="mini"
                                 :disabled="innerViewModel"></el-color-picker>
                {{editItem.color}}
              </el-form-item>
            </template>
            <template v-if="editItem.type === 'TEXT_VERSION'">
              <el-form-item label="大小" prop="size">
                <el-input-number v-model="editItem.size" :min="8" :max="56"
                                 :disabled="innerViewModel"></el-input-number>
              </el-form-item>
              <el-form-item label="颜色" prop="color">
                <el-color-picker v-model="editItem.color" show-alpha size="mini"
                                 :disabled="innerViewModel"></el-color-picker>
                {{editItem.color}}
              </el-form-item>
            </template>
            <template v-if="editItem.type === 'IMAGE' ||
              editItem.type === 'BUTTON' ||
              editItem.type === 'IMAGE_QR_CODE' ||
              editItem.type === 'COMMON_LOGIN_BY_MOBILE' ||
              editItem.type === 'COMMON' ">
              <el-form-item label="上传背景图片">
                <el-upload :disabled="innerViewModel"
                           class="upload-demo"
                           :action="getActionUrl()"
                           :show-file-list="false"
                           :drag="true"
                           :headers="getAuthHeader()"
                           :file-list="getFileList(editItem)"
                           :on-success="(res,file)=>{return handleSuccess(res, file, editItem)}"
                           :on-error="uploadError"
                           list-type="picture-card">
                  <img v-if="editItem.imgUrl" :src="editItem.imgUrl" class="img">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </el-form-item>
            </template>
            <template v-if="
              editItem.type === 'BUTTON' ">
              <el-form-item label="上传落焦图片">
                <el-upload :disabled="innerViewModel"
                           class="upload-demo"
                           :action="getActionUrl()"
                           :show-file-list="false"
                           :drag="true"
                           :on-error="uploadError"
                           accept=".png,.jpg,.jpeg,.webp"
                           :headers="getAuthHeader()"
                           :on-success="(res,file)=>{return handleFocusSuccess(res, file, editItem)}"
                           list-type="picture-card">
                  <img v-if="editItem.focusImgUrl" :src="editItem.focusImgUrl" class="img">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </el-form-item>
              <el-form-item label="点击事件">
                <el-input v-model="editItem.clickAction" :disabled="innerViewModel"></el-input>
              </el-form-item>
            </template>
            <template v-if="
            editItem.type === 'COMMON'||
            editItem.type === 'IMAGE_QR_CODE'||
            editItem.type === 'COMMON_LOGIN_BY_MOBILE'">
              <el-form-item v-if="innerViewModel === false">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCommonBg">清除背景图</el-button>
              </el-form-item>

              <el-form-item label="背景颜色" prop="bgColor">
                <el-color-picker v-model="editItem.bgColor" show-alpha size="mini"
                                 :disabled="innerViewModel"></el-color-picker>
                {{editItem.bgColor}}
              </el-form-item>
            </template>
            <el-form-item v-if="editItem !== editLoginLayout.commonBg && innerViewModel ===  false">
              <el-button size="mini" circle icon="el-icon-arrow-down" @click="justZIndex(true)"></el-button>
              <el-button size="mini" circle icon="el-icon-arrow-up" @click="justZIndex(false)"></el-button>
              <el-button type="danger" circle="" icon="el-icon-delete" size="mini" @click="removeComponent"></el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-else>
          请点击左侧页面中的组件进行编辑
        </div>
      </div>
      <div class="cc-handler">
        <div> 投放操作区域</div>
        <div>
          <el-form label-width="100px" size="mini">
            <el-form-item label="布局名称">
              <el-input v-model="domainInfo.name" :disabled="innerViewModel"></el-input>
            </el-form-item>
            <el-form-item label="投放mac地址">
              <el-input v-model="domainInfo.mac" :clearable="true" placeholder="以英文逗号分割多个值" :disabled="innerViewModel"></el-input>
            </el-form-item>
            <el-form-item label="最低版本">
              <el-select v-model="domainInfo.minVersion" placeholder="选择最低版本" :disabled="innerViewModel">
                <el-option label="V4.10" value="4100000" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生效时间">
              <el-date-picker size="mini" :disabled="innerViewModel"
                              v-model="validTime"
                              type="datetimerange"
                              range-separator="-"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              :default-time="['00:00:00','23:59:59']"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="策略优先级">
              <el-input-number v-model="domainInfo.priority" :min="0" :disabled="innerViewModel"></el-input-number>
            </el-form-item>
            <el-form-item label="影视源">
              <el-checkbox-group v-model="platForm" :disabled="innerViewModel">
                <el-checkbox label="tencent">腾讯源</el-checkbox>
                <br/>
                <el-checkbox label="yinhe">爱奇艺源</el-checkbox>
                <br/>
                <el-checkbox label="voole">优朋源</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <div>
              <el-button size="mini" type="primary" icon="el-icon-edit-outline" @click="save"
                         v-if="innerViewModel === false && domainInfo.status !== 2 && checkUserRole('LAYOUT_ROLE_EDIT')" :loading="operator">保存
              </el-button>
              <el-button size="mini" type="warning" icon="el-icon-share"
                         v-if="innerViewModel === false && domainInfo.id > 0 && domainInfo.status !== 2  && checkUserRole('LAYOUT_ROLE_EDIT')"
                         @click="publishTest" :loading="operator">发布测试
              </el-button>
              <el-button size="mini" type="danger" icon="el-icon-share"
                         v-if="domainInfo.id > 0 && (domainInfo.status === 1 || domainInfo.status === 3 || domainInfo.status === 2)  && checkUserRole('LAYOUT_ROLE_AUDIT')"
                         @click="publish" :loading="operator">发布全网
              </el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>

    <div style="clear: both;">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="源码数据" name="1">
          <div>
            {{domainInfo}}
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

  </div>
  <div v-else>
    加载数据中...
  </div>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
import {
  ResponseResult,
  SysLoginLayoutModel,
  UiContentData,
  UiItemData,
  UiItemType,
  UiPageData,
  UploadFileInfo,
} from '../../../types';
import {AppModule} from '../../../store/modules/app';
import {Dictionary} from 'vuex';
import {getFullToken} from '../../../utils/auth';
import {pickerOptions} from '@/utils/validate';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import {
  addNewLoginLayout,
  getLoginLayoutDetail, publisLoginLayout,
  publisLoginLayoutTest,
  updateLoginLayout,
} from '../../../api/passport';
import RightComponent from '../../../components/RightComponent';


@Component({
  name: 'NativeViewEdit',
  mixins: [RightComponent],
  components: {},
})
export default class NativeViewEdit extends Vue {

  @Prop({type: Number, default: 0})
    // @ts-ignore
  domainId: number;
  @Prop({type: Boolean, default: false})
    // @ts-ignore
  viewModel: boolean;
  // 是否正在操作远程数据
  operator: boolean = false;

  activeNames: number[] = [];

  innerViewModel: boolean = false;
  innerDomainId: number = 0;

  platForm = ['yinhe', 'tencent', 'voole'];
  validTime?: string[] | null = null; // 投放方案的开始时间，结束时间

  rules: any = {};
  newComType: UiItemType = 'IMAGE';
  editItem: UiItemData | null = null;
  maxPageId = 1;
  currentEditPage: UiPageData | null = null;
  zoomValue = 0.4;
  domainInfo: SysLoginLayoutModel | null = null;
  editLoginLayout: UiContentData | null = null;

  @Watch('domainId', {immediate: true})
  handleDomainIdChange(newVal: number, oldVal?: number) {
    this.onDomainIdChange(newVal);
  }

  @Watch('viewModel', {immediate: true})
  handleViewModelChange(newVal: boolean, oldVal?: boolean) {
    this.innerViewModel = newVal;
    console.log('innerViewModel changed ' + newVal);
  }

  onDomainIdChange(newVal: number) {
    this.innerDomainId = newVal;
    if (null == newVal || newVal === 0) {
      this.domainInfo = this.getInitData();
      this.dataLoaded();
    } else {
      getLoginLayoutDetail(this.innerDomainId).then((resolve) => {
        this.domainInfo = resolve.data.data;
        this.dataLoaded();
      }).catch(handlerCommonError);
    }
  }

  dataLoaded() {
    if (this.domainInfo == null) {
      return;
    }
    this.editLoginLayout = this.domainInfo.uiContentData;
    if (this.domainInfo.sourceSign !== undefined) {
      this.platForm = this.domainInfo.sourceSign.split(',');
    }
    if (
      null != this.domainInfo.startTime && undefined !== this.domainInfo.startTime && '' !== this.domainInfo.startTime &&
      null != this.domainInfo.endTime && undefined !== this.domainInfo.endTime && '' !== this.domainInfo.endTime
    ) {
      this.validTime = [this.domainInfo.startTime, this.domainInfo.endTime];
    }
    this.editItem = null;
    this.initProperties();
  }

  uploadError(res: ResponseResult<string>) {
    const msg = (res != null ? res.message : null) || '上传文件失败';
    this.$message.error(msg);
  }

  get commonStyle(): any {
    if (this.editLoginLayout == null) {
      return;
    }
    const comBg = this.editLoginLayout.commonBg;
    return {
      width: comBg.w + 'px',
      height: comBg.h + 'px',
      left: comBg.x + 'px',
      top: comBg.y + 'px',
      background: 'url(' + comBg.imgUrl + ') center center no-repeat',
      zIndex: 0,
      backgroundColor: comBg.bgColor,
    };
  }


  /**
   * 按钮按下的时候，显示不同的背景，模拟获取焦点的图片
   */
  changeBg(parse: boolean, item: UiItemData, obj: HTMLElement) {
    let url = '';
    if (parse === true) {
      url = item.focusImgUrl || '';
    } else {
      url = item.imgUrl || '';
    }
    obj.style.background = 'url(' + url + ') center center no-repeat';
  }

  removeCommonBg() {
    if (this.editItem == null) {
      return;
    }
    this.editItem.imgUrl = '';
    this.editItem.imgMd5 = '';
    this.editItem.imgName = '';
  }

  /**
   * 调整层次位置
   */
  justZIndex(down: boolean) {
    if (this.editItem == null || this.currentEditPage == null || this.currentEditPage.itemList === undefined) {
      return;
    }
    for (let i = 0; i < this.currentEditPage.itemList.length; i++) {
      const item = this.currentEditPage.itemList[i];
      if (this.editItem === item) {
        // 交换数组位置
        if (down === true) {
          if (i === 0) {
            // 第一个
            this.$message.info('已经是最底层了');
            return;
          } else {
            const prev = this.currentEditPage.itemList[i - 1];
            this.currentEditPage.itemList[i - 1] = item;
            this.$set(this.currentEditPage.itemList, i, prev);
          }
        } else {
          if (i === this.currentEditPage.itemList.length - 1) {
            this.$message.info('已经是最上层了');
            return;
          } else {
            const next = this.currentEditPage.itemList[i + 1];
            this.currentEditPage.itemList[i + 1] = item;
            this.$set(this.currentEditPage.itemList, i, next);
          }
        }
        break;
      }
    }
    this.resetZIndex(this.currentEditPage.itemList);
  }

  removeComponent() {
    if (this.editItem == null || this.currentEditPage == null || this.currentEditPage.itemList === undefined) {
      return;
    }
    for (let i = 0; i < this.currentEditPage.itemList.length; i++) {
      const item = this.currentEditPage.itemList[i];
      if (this.editItem === item) {
        this.currentEditPage.itemList.splice(i, 1);
        this.editItem = null;
        break;
      }
    }
    this.resetZIndex(this.currentEditPage.itemList);
  }

  // 重新计算zIndex
  resetZIndex(itemList: UiItemData[]) {
    itemList.forEach((item, index) => {
      item.zIndex = index + 1;
    });
  }

  addComponent() {
    if (this.currentEditPage == null) {
      return;
    }
    const newCom = this.newComFromType(this.newComType);

    if (null == this.currentEditPage.itemList) {
      this.currentEditPage.itemList = [];
    }
    newCom.zIndex = this.currentEditPage.itemList.length + 1;
    this.currentEditPage.itemList.push(newCom);
  }

  newComFromType(type: UiItemType): UiItemData {
    // 根据不同
    // 'COMMON'|'TEXT'| 'IMAGE'| 'BUTTON'| 'TEXT_VERSION'|'IMAGE_QR_CODE'|'COMMON_LOGIN_BY_MOBILE'
    const itemData = {
      type,
      w: 200,
      h: 60,
      x: 100,
      y: 100,
      text: '新添加的组件',
      size: 16,
      color: '',
      bold: false,
      isBG: false,
      imgUrl: '',
      imgMd5: '',
      imgName: '',
      focusImgUrl: '',
      focusImgMd5: '',
      focusImgName: '',
      clickAction: '',
      bgColor: '',
    };
    switch (type) {
      case 'IMAGE':
        itemData.w = 300;
        itemData.h = 300;
        break;
      case 'IMAGE_QR_CODE':
        itemData.w = 430;
        itemData.h = 430;
        itemData.y = 325;
        itemData.x = 745;
        break;
      case 'COMMON_LOGIN_BY_MOBILE':
        itemData.w = 714;
        itemData.h = 742;
        itemData.y = 169;
        itemData.x = 600;
        itemData.bgColor = 'rgba(48, 48, 48, 1)';
        break;
      case 'TEXT_VERSION':
        itemData.w = 400;
        itemData.h = 40;
        itemData.x = 20;
        itemData.y = 1040;
        itemData.size = 12;
        break;
    }
    return itemData;
  }

  pageSelect(item: UiPageData) {
    if (item !== this.currentEditPage) {
      this.currentEditPage = item;
      this.editItem = null;
    }
  }

  getCodeName(code: number): string {
    switch (code) {
      case 21:
        return '左';
      case 19:
        return '上';
      case 22:
        return '右';
      case 20:
        return '下';
    }
    return '';
  }

  removePage() {
    if (this.editLoginLayout == null) {
      return;
    }
    if (this.editLoginLayout.pageList.length <= 1) {
      this.$message.error('无法删除最后一个页面');
      return;
    }
    if (this.currentEditPage == null) {
      return;
    }
    this.$confirm('确认删除该页面吗?', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      if (this.editLoginLayout == null || this.currentEditPage == null || this.editLoginLayout.pageList === undefined) {
        return;
      }
      for (let i = 0; i < this.editLoginLayout.pageList.length; i++) {
        const item = this.editLoginLayout.pageList[i];
        if (item.id === this.currentEditPage.id) {
          // 删除此页面

          this.editLoginLayout.pageList.splice(i, 1);
          break;
        }
      }
      if (this.currentEditPage.isDefault === true) {
        this.editLoginLayout.pageList[0].isDefault = true;
      }
      this.currentEditPage = this.editLoginLayout.pageList[0];
      this.editItem = null;
      this.rebuildSwitchPageData();
    });
  }

  /**
   * 重新构建每个页面中的导航数据
   */
  rebuildSwitchPageData() {
    if (this.editLoginLayout == null) {
      return;
    }
    const length = this.editLoginLayout.pageList.length;
    if (length === 1) {
      this.editLoginLayout.pageList[0].switchPage = [];
    } else if (length > 1) {
      let preCode = 21;
      let nextCode = 22;
      if (this.editLoginLayout.switchType === 'up_down') {
        preCode = 19;
        nextCode = 20;
      }
      if (length > 2) {
        // 多余2个的中间的都加上2个导航
        for (let start = 1; start < length - 1; start++) {
          const pre = this.editLoginLayout.pageList[start - 1];
          const next = this.editLoginLayout.pageList[start + 1];
          const cur = this.editLoginLayout.pageList[start];
          cur.switchPage = [];
          cur.switchPage.push({keyCode: preCode, toPageId: pre.id, name: pre.name});
          cur.switchPage.push({keyCode: nextCode, toPageId: next.id, name: next.name});
        }
      }
      const first = this.editLoginLayout.pageList[0];
      const sec = this.editLoginLayout.pageList[1];
      const last = this.editLoginLayout.pageList[length - 1];
      const preLast = this.editLoginLayout.pageList[length - 2];
      first.switchPage = [{keyCode: nextCode, toPageId: sec.id, name: sec.name}];
      last.switchPage = [{keyCode: preCode, toPageId: preLast.id, name: preLast.name}];
    }
  }

  initProperties() {
    if (null == this.editLoginLayout) {
      return;
    }
    let id = 1;
    this.editLoginLayout.pageList.forEach((item) => {
      if (item.id !== undefined) {
        if (id < item.id) {
          id = item.id;
        }
      }
    });
    this.maxPageId = id;
    if (this.editLoginLayout.pageList.length > 0) {
      this.currentEditPage = this.editLoginLayout.pageList[0];
    } else {
      this.addNewPage();
    }
    this.rebuildSwitchPageData();
  }

  defaultPageChange(newValue: boolean, changeItem: UiPageData): void {
    if (this.editLoginLayout == null) {
      return;
    }
    this.editLoginLayout.pageList.forEach((item) => {
      if (item.id !== changeItem.id) {
        item.isDefault = false;
      }
    });
  }

  /**
   * 添加新的编辑页面，并将当前页面作为最新编辑的页面。
   */
  addNewPage(): UiPageData | undefined {
    if (this.editLoginLayout == null) {
      return;
    }
    const newId = this.getNewPageId();
    const newpage = {
      id: newId, name: '新页面' + newId, isDefault: false, itemList: [], switchPage: [],
    };
    this.editLoginLayout.pageList.push(newpage);
    this.currentEditPage = newpage;

    this.rebuildSwitchPageData();
    this.editItem = null;
    return newpage;
  }

  getNewPageId(): number {
    this.maxPageId = this.maxPageId + 1;
    return this.maxPageId;
  }

  created() {
    // @ts-ignore
    // let id = this.$route.query.id;
    // // @ts-ignore
    // let innerViewModel = this.$route.query.viewModel;
    // this.innerViewModel = innerViewModel == 'true';
    // if (null != id) {
    //   this.onDomainIdChange(id);
    // }
    // this.initProperties();
  }

  handleFocusSuccess(res: ResponseResult<UploadFileInfo>, file: any, editItem: UiItemData) {
    console.log(res);
    if (res.success) {
      editItem.focusImgUrl = res.data.url;
      editItem.focusImgName = res.data.fileName;
      editItem.focusImgMd5 = res.data.md5;
    } else {
      this.$message.error(res.message);
    }
  }

  getAuthHeader(): Dictionary<string> {
    const headerInfo = {Authorization: getFullToken()};
    return headerInfo;
  }

  getActionUrl(): string {
    return AppModule.uploadAction;
  }

  handleSuccess(res: ResponseResult<UploadFileInfo>, file: any, editItem: UiItemData) {
    console.log(res);
    if (res.success) {
      editItem.imgUrl = res.data.url;
      editItem.imgName = res.data.fileName;
      editItem.imgMd5 = res.data.md5;
    } else {
      this.$message.error(res.message);
    }
  }

  getFocusFileList(item: UiItemData): any {
    return [{name: item.focusImgName, url: item.focusImgUrl}];
  }

  getFileList(item: UiItemData): any {
    return [{name: item.imgName, url: item.imgUrl}];
  }

  editItemProp(item: UiItemData) {
    this.editItem = item;
  }

  getItemStyle(item: UiItemData, extend?: number): any {
    const attr: any = {};
    extend = extend || 0;
    attr.width = (item.w + extend) + 'px';
    attr.height = (item.h + extend) + 'px';
    attr.left = item.x + 'px';
    attr.top = item.y + 'px';
    attr.color = item.color;
    if (item.zIndex != null) {
      attr.zIndex = item.zIndex;
    }
    switch (item.type) {
      case 'BUTTON':
        attr.background = 'url(' + item.imgUrl + ') center center no-repeat';
      case 'TEXT':
        attr.fontSize = item.size + 'px';
        break;

    }
    return attr;
  }

  /**
   * 发布
   */
  publish() {
    if (this.domainInfo == null) {
      this.$message.error('对象为空不能保存');
      return;
    }
    if (this.domainInfo.id <= 0) {
      this.$message.error('请先保存布局信息');
      return;
    }
    if (this.domainInfo.status !== 1 && this.domainInfo.status !== 2 && this.domainInfo.status !== 3) {
      this.$message.error('推送全网环境之前必须经过测试');
      return;
    }
    console.log('推送全网');
    this.operator = true;

    this.$confirm('推送全网之前先要在测试机器验证，您确认在测试机器验证后没有问题吗？', '警告', {
      confirmButtonText: '确认推送',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      if (this.domainInfo == null) {
        return;
      }
      publisLoginLayout(this.domainInfo.id).then(() => {
        this.$message.success('推送成功');
        // 重新加载
        if (this.domainInfo != null) {
          this.handleDomainIdChange(this.domainInfo.id);
        }
        this.operator = false;
      }).catch((ar) => {
        handlerCommonError(ar);
        this.operator = false;
      });
    }).catch(() => {
      this.operator = false;
    });
  }

  /**
   * 发布至测试
   */
  publishTest() {
    if (this.domainInfo == null) {
      this.$message.error('对象为空不能保存');
      return;
    }
    if (this.domainInfo.id <= 0) {
      this.$message.error('请先保存布局信息');
      return;
    }
    if (this.domainInfo.name == null || this.domainInfo.name === '') {
      this.$message.error('请输入布局名称');
      return;
    }
    if (this.domainInfo.mac == null || this.domainInfo.mac === '') {
      this.$message.error('推送测试环境必须指定mac地址');
      return;
    }
    if (!/([0-9a-f]){12}(,([0-9a-f]){12})*$/i.test(this.domainInfo.mac)) {
      this.$message.error('请输入正确的mac地址');
      return;
    }
    if (this.platForm.length === 0) {
      this.$message.error('必须指定视频源');
      return;
    }
    this.operator = true;

    this.beforSave();

    publisLoginLayoutTest(this.domainInfo).then(() => {
      this.$message.success('推送成功');
      // 重新加载
      if (this.domainInfo != null && this.domainInfo.id !== undefined) {
        this.handleDomainIdChange(this.domainInfo.id);
      }
      this.operator = false;

    }).catch((ar) => {
      handlerCommonError(ar);
      this.operator = false;
    });
  }

  @Emit('update:domainId')
  domainIdChange(newVal: number | undefined, oldVal: number | undefined): void {
  }

  beforSave() {
    if (this.domainInfo == null) {
      return;
    }
    // 将其他关联配置信息保存到对象中
    this.domainInfo.sourceSign = this.platForm.join(',');
    if (this.validTime != null && this.validTime.length === 2) {
      this.domainInfo.startTime = this.validTime[0];
      this.domainInfo.endTime = this.validTime[1];
    }
  }
  /**
   * 保存
   */
  save() {
    console.log('保存方案');
    console.log(this.domainInfo);
    if (this.domainInfo == null) {
      this.$message.error('对象为空不能保存');
      return;
    }
    if (this.domainInfo.name == null || this.domainInfo.name === '') {
      this.$message.error('请输入布局名称');
      return;
    }
    if (this.platForm.length === 0) {
      this.$message.error('必须指定视频源');
      return;
    }
    if (this.domainInfo.mac !== '' && this.domainInfo.mac != null) {
      if (!/([0-9a-f]){12}(,([0-9a-f]){12})*$/i.test(this.domainInfo.mac)) {
        this.$message.error('请输入正确的mac地址');
        return;
      }
    }
    this.operator = true;
    this.beforSave();

    if (this.domainInfo.id !== 0 && this.domainInfo.id != null) {
      updateLoginLayout(this.domainInfo).then(() => {
        this.$message.success('修改成功');
        this.operator = false;
      }).catch((ar) => {
        handlerCommonError(ar);
        this.operator = false;
      });
    } else {
      addNewLoginLayout(this.domainInfo).then((response) => {
        this.$message.success('新增成功');
        this.operator = false;
        if (null != this.domainInfo) {
          this.domainInfo.id = response.data.data.id;
          this.domainIdChange(this.domainInfo.id, 0);
          this.innerDomainId = this.domainInfo.id;
        }
      }).catch((ar) => {
        handlerCommonError(ar);
        this.operator = false;
      });
    }
  }

  getInitData(): SysLoginLayoutModel {
    const ui: UiContentData = {
      switchType: 'up_down',
      commonBg: {
        type: 'COMMON',
        x: 0,
        y: 0,
        w: 1920,
        h: 1080,
        imgUrl: 'http://pic1.win4000.com/wallpaper/4/59881599deed4.jpg',
      },
      pageList: [{
        id: 1,
        name: '二维码页面',
        isDefault: true,
        itemList: [{
          type: 'IMAGE_QR_CODE',
          w: 430,
          h: 430,
          x: 745,
          y: 325,
          text: '二维码控件',
          size: 16,
          color: '',
          bold: false,
          isBG: false,
          imgUrl: '',
          imgMd5: '',
          imgName: '',
          focusImgUrl: '',
          focusImgMd5: '',
          focusImgName: '',
          clickAction: '',
          zIndex: 1,
        }, {
          type: 'TEXT_VERSION',
          w: 400,
          h: 40,
          x: 20,
          y: 1040,
          text: '版本',
          size: 12,
          color: '',
          bold: false,
          isBG: false,
          imgUrl: '',
          imgMd5: '',
          imgName: '',
          focusImgUrl: '',
          focusImgMd5: '',
          focusImgName: '',
          clickAction: '',
          zIndex: 2,
        }],
        switchPage: [{keyCode: 40, toPageId: 2, name: '手机号页面'}],
      }, {
        id: 2,
        name: '手机号页面',
        isDefault: false,
        itemList: [{
          type: 'COMMON_LOGIN_BY_MOBILE',
          w: 714,
          h: 742,
          x: 600,
          y: 169,
          text: '手机号登录',
          size: 16,
          color: '',
          bold: false,
          isBG: false,
          imgUrl: '',
          imgMd5: '',
          imgName: '',
          focusImgUrl: '',
          focusImgMd5: '',
          focusImgName: '',
          clickAction: '',
          bgColor : 'rgba(48, 48, 48, 1)',
          zIndex: 1,
        }],
        switchPage: [{keyCode: 38, toPageId: 1, name: '二维码页面'}],
      }],
    };
    const newModel: SysLoginLayoutModel = {
      id: 0,
      name: '新登录布局',
      status: 0,
      mac: '',
      sourceSign: 'yinhe,tencent,voole',
      priority: 1,
      minVersion: '4100000',
      uiContentData: ui,
    };
    return newModel;
  }

}
</script>


<style rel="stylesheet/scss" lang="scss">
  .cc-view-temp {
    padding-top: 20px;
  }

  .cc-view-container {
    zoom: 0.4;
  }

  .cc-view-con {
    float: left;
  }

  .cc-page-edit {
    padding: 10px;
    .el-tag {
      cursor: pointer;
    }
    .el-tag + .el-tag {
      margin-left: 10px;
    }
  }

  .cc-view-main {
    overflow: hidden;
    position: relative;
    width: 1920px;
    height: 1080px;
    border: 1px solid #ccc;
  }

  .cc-view-controller {
    width: 300px;
    margin-left: 20px;
    .upload-demo .el-upload-dragger {
      width: 152px;
      height: 152px;
    }

    .img {
      width: 150px;
    }
    .el-form-item--mini.el-form-item {
      margin-bottom: 4px;
    }
  }

  .cc-view-page {
    position: absolute;
  }

  .cc-full-page {
    width: 1920px;
    height: 1080px;
    background-color: transparent;
  }

  .cc-view-item {
    position: absolute;
    cursor: pointer;
  }

  .cc-page-edit-con {
    .el-button--mini {
      margin: 5px 0px 5px 10px;
    }
    .el-range-editor--mini.el-input__inner {
      width: 310px;
    }
  }

  .default-page-border {
    border: solid 1px #fa7b11;
  }

  .cc-page-edit {
    width: 768px;
  }

  .current-edit-com {
    border: 4px dashed red;
    padding: 4px;
    margin: -8px;
  }
</style>

