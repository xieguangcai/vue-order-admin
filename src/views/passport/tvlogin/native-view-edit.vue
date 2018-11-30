<template>
  <div class="cc-view-temp">
    <div class=" cc-view-con cc-view-page-con">
      <div class="cc-view-container">
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
                <div :style="getItemStyle(boxItem)" @click="editItemProp(boxItem)">
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
          <h3>页面编辑器</h3>
          页面切换方式：
          <el-switch
            v-model="editLoginLayout.switchType"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="up_down"
            inactive-value="left_right"
            active-text="上下切换"
            @change="rebuildSwitchPageData"
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
            <el-button type="warning" size="mini" icon="el-icon-circle-plus-outline" @click="addNewPage">
              添加新页面
            </el-button>
          </div>
          <div>
            <div>编辑选中页面属性</div>
            <el-form :model="currentEditPage" :inline="true" ref="ruleForm" label-width="100px" size="mini">
              <el-form-item label="页面ID">
                {{currentEditPage.id}}
              </el-form-item>
              <el-form-item label="页面名称">
                <el-input v-model="currentEditPage.name"></el-input>
              </el-form-item>
              <el-form-item label="默认页">
                <el-switch :disabled="currentEditPage.isDefault" v-model="currentEditPage.isDefault"
                           @change="(val)=>{defaultPageChange(val, currentEditPage)}"></el-switch>
              </el-form-item>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="removePage">删除该页面</el-button>
              <br/>
              <el-form-item label="向页面中添加的组件类型" prop="type">
                <el-select v-model="newComType" placeholder="请选择类型">
                  <el-option label="文本" value="TEXT"></el-option>
                  <el-option label="图片" value="IMAGE"></el-option>
                  <el-option label="按钮" value="BUTTON"></el-option>
                  <el-option label="版本号" value="TEXT_VERSION"></el-option>
                  <el-option label="登录二维码" value="IMAGE_QR_CODE"></el-option>
                  <el-option label="手机号登录控件" value="COMMON_LOGIN_BY_MOBILE"></el-option>
                </el-select>
              </el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-delete" @click="addComponent">添加组件</el-button>
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
      <div style="width:400px;">
        预览区域
        {{editLoginLayout}}
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
              <el-input-number v-model="editItem.x" :min="0" :max="1920"></el-input-number>
            </el-form-item>
            <el-form-item label="Y位置" prop="y">
              <el-input-number v-model="editItem.y" :min="0" :max="1080"></el-input-number>
            </el-form-item>
            <el-form-item label="宽度" prop="w">
              <el-input-number v-model="editItem.w" :min="0" :max="1920"></el-input-number>
            </el-form-item>
            <el-form-item label="高度" prop="h">
              <el-input-number v-model="editItem.h" :min="0" :max="1080"></el-input-number>
            </el-form-item>
            <template v-if="editItem.type === 'TEXT'">
              <el-form-item label="文字" prop="text">
                <el-input v-model="editItem.text"></el-input>
              </el-form-item>
              <el-form-item label="大小" prop="size">
                <el-input-number v-model="editItem.size" :min="8" :max="56"></el-input-number>
              </el-form-item>
              <el-form-item label="颜色" prop="color">
                <el-color-picker v-model="editItem.color" show-alpha size="mini"></el-color-picker>
                {{editItem.color}}
              </el-form-item>
            </template>
            <template v-if="editItem.type === 'TEXT_VERSION'">
              <el-form-item label="大小" prop="size">
                <el-input-number v-model="editItem.size" :min="8" :max="56"></el-input-number>
              </el-form-item>
              <el-form-item label="颜色" prop="color">
                <el-color-picker v-model="editItem.color" show-alpha size="mini"></el-color-picker>
                {{editItem.color}}
              </el-form-item>
            </template>
            <template v-if="editItem.type === 'IMAGE' ||
              editItem.type === 'BUTTON' ||
              editItem.type === 'IMAGE_QR_CODE' ||
              editItem.type === 'COMMON_LOGIN_BY_MOBILE' ||
              editItem.type === 'COMMON' ">
              <el-form-item label="上传背景图片">
                <el-upload
                  class="upload-demo"
                  :action="getActionUrl()"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
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
                <el-upload
                  class="upload-demo"
                  :action="getActionUrl()"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
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
            </template>
            <template v-if="
            editItem.type === 'COMMON'||
            editItem.type === 'IMAGE_QR_CODE'||
            editItem.type === 'COMMON_LOGIN_BY_MOBILE'">
              <el-form-item>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCommonBg">清除背景图</el-button>
              </el-form-item>

              <el-form-item label="背景颜色" prop="color">
                <el-color-picker v-model="editItem.color" show-alpha size="mini"></el-color-picker>
                {{editItem.color}}
              </el-form-item>
            </template>
            <el-form-item v-if="editItem !== editLoginLayout.commonBg">
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
        功能操作区域
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
  import {UiContentData, UiItemData, UiItemType, UiPageData} from "../../../types";
  import {AppModule} from "../../../store/modules/app";
  import {Dictionary} from "vuex";
  import {getFullToken} from "../../../utils/auth";

  @Component({
    name: 'NativeViewEdit',
    components: {},
  })
  export default class NativeViewEdit extends Vue {
    get commonStyle() {
      let comBg = this.editLoginLayout.commonBg;
      return {
        width: comBg.w + 'px',
        height: comBg.h + 'px',
        left: comBg.x + 'px',
        top: comBg.y + 'px',
        background: 'url(' + comBg.imgUrl + ') center center',
        zIndex: 0,
        backgroundColor: comBg.color
      }
    }

    rules: any = {};
    newComType: UiItemType = "IMAGE";
    editItem: UiItemData | null = null;
    maxPageId = 1;
    currentEditPage: UiPageData | null = null;

    uploadError(res) {
      const msg = (res != null ? res.message : null) || '上传文件失败';
      this.$message.error(msg);
    }

    removeCommonBg() {
      this.editItem.imgUrl = '';
      this.editItem.imgMd5 = '';
      this.editItem.imgName = '';
    }

    /**
     * 调整层次位置
     */
    justZIndex(down: boolean) {
      if (this.editItem === null || this.currentEditPage === null || this.currentEditPage.itemList === null) {
        return;
      }
      for (let i = 0; i < this.currentEditPage.itemList.length; i++) {
        let item = this.currentEditPage.itemList[i];
        if (this.editItem == item) {
          //交换数组位置
          if (down === true) {
            if (i === 0) {
              //第一个
              this.$message.info("已经是最底层了");
            } else {
              let prev = this.currentEditPage.itemList[i - 1];
              this.currentEditPage.itemList[i - 1] = item;
              this.$set(this.currentEditPage.itemList, i, prev);
            }
          } else {
            if (i === this.currentEditPage.itemList.length - 1) {
              this.$message.info("已经是最上层了");
            } else {
              let next = this.currentEditPage.itemList[i + 1];
              this.currentEditPage.itemList[i + 1] = item;
              this.$set(this.currentEditPage.itemList, i, next);
            }
          }
          break;
        }
      }
    }

    removeComponent() {
      if (this.editItem === null || this.currentEditPage === null || this.currentEditPage.itemList === null) {
        return;
      }
      for (let i = 0; i < this.currentEditPage.itemList.length; i++) {
        let item = this.currentEditPage.itemList[i];
        if (this.editItem == item) {
          this.currentEditPage.itemList.splice(i, 1);
          this.editItem = null;
          break;
        }
      }
    }

    addComponent() {
      if (this.currentEditPage == null) {
        return;
      }
      const newCom = this.newComFromType(this.newComType);
      if (null == this.currentEditPage.itemList) {
        this.currentEditPage.itemList = [];
      }
      this.currentEditPage.itemList.push(newCom);
    }

    newComFromType(type: UiItemType): UiItemData {
      //根据不同
      //'COMMON'|'TEXT'| 'IMAGE'| 'BUTTON'| 'TEXT_VERSION'|'IMAGE_QR_CODE'|'COMMON_LOGIN_BY_MOBILE'
      let itemData = {
        type: type,
        w: 200,
        h: 60,
        x: 100,
        y: 100,
        text: '新添加的组件',
        size: 16,
        color: '#ff8a24',
        bold: false,
        isBG: false,
        imgUrl: '',
        imgMd5: '',
        imgName: '',
        focusImgUrl: '',
        focusImgMd5: '',
        focusImgName: '',
        clickAction: '',
      };
      switch (type) {
        case "IMAGE":
          itemData.w = 300;
          itemData.h = 300;
          break;
        case "IMAGE_QR_CODE":
          itemData.w = 430;
          itemData.h = 430;
          itemData.y = 325;
          itemData.x = 745;
          break;
        case "COMMON_LOGIN_BY_MOBILE":
          itemData.w = 714;
          itemData.h = 742;
          itemData.y = 169;
          itemData.x = 600;
          break;
        case "TEXT_VERSION":
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
        case 37:
          return "左";
        case 38:
          return "上";
        case 39:
          return "右";
        case 40:
          return "下";

      }
    }

    removePage() {
      if (this.editLoginLayout == null) {
        return;
      }
      if (this.editLoginLayout.pageList.length <= 1) {
        this.$message.error("无法删除最后一个页面");
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
        for (let i = 0; i < this.editLoginLayout.pageList.length; i++) {
          let item = this.editLoginLayout.pageList[i];
          if (item.id === this.currentEditPage.id) {
            //删除此页面

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
      })
    }

    /**
     * 重新构建每个页面中的导航数据
     */
    rebuildSwitchPageData() {
      console.log('rebuildSwitchPageData');
      const length = this.editLoginLayout.pageList.length;
      if (length == 1) {
        this.editLoginLayout.pageList[0].switchPage = [];
      } else if (length > 1) {
        let preCode = 37, nextCode = 39;
        if (this.editLoginLayout.switchType === 'up_down') {
          preCode = 38;
          nextCode = 40;
        }
        if (length > 2) {
          //多余2个的中间的都加上2个导航
          for (let start = 1; start < length - 1; start++) {
            let pre = this.editLoginLayout.pageList[start - 1];
            let next = this.editLoginLayout.pageList[start + 1];
            let cur = this.editLoginLayout.pageList[start];
            cur.switchPage = [];
            cur.switchPage.push({keyCode: preCode, toPageId: pre.id, name: pre.name});
            cur.switchPage.push({keyCode: nextCode, toPageId: next.id, name: next.name});
          }
        }
        let first = this.editLoginLayout.pageList[0];
        let sec = this.editLoginLayout.pageList[1];
        let last = this.editLoginLayout.pageList[length - 1];
        let preLast = this.editLoginLayout.pageList[length - 2];
        first.switchPage = [{keyCode: nextCode, toPageId: sec.id, name: sec.name}];
        last.switchPage = [{keyCode: preCode, toPageId: preLast.id, name: preLast.name}];
      }
    }

    initProperties() {
      let id = 1;
      for (let i = 0; i < this.editLoginLayout.pageList.length; i++) {
        let item = this.editLoginLayout.pageList[i];
        if (id < item.id) {
          id = item.id;
        }
      }
      this.maxPageId = id;
      if (this.editLoginLayout.pageList.length > 0) {
        this.currentEditPage = this.editLoginLayout.pageList[0];
      } else {
        this.addNewPage();
      }
      this.rebuildSwitchPageData();
    }

    defaultPageChange(newValue: boolean, changeItem: UiPageData) {
      for (let i = 0; i < this.editLoginLayout.pageList.length; i++) {
        let item = this.editLoginLayout.pageList[i];
        if (item.id !== changeItem.id) {
          item.isDefault = false;
        }
      }
    }

    /**
     * 添加新的编辑页面，并将当前页面作为最新编辑的页面。
     */
    addNewPage(): UiPageData {
      let newId = this.getNewPageId();
      let newpage = {
        id: newId, name: '新页面' + newId, isDefault: false, itemList: [], switchPage: []
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
      this.initProperties();
    }

    handleFocusSuccess(res, file, editItem) {
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
      let headerInfo = {Authorization: getFullToken()};
      return headerInfo;
    }

    getActionUrl(): string {
      return AppModule.uploadAction;
    }

    handleSuccess(res, file, editItem) {
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

    handleRemove(file, fileList) {
      console.log(file, fileList);
    }

    handlePreview(file) {
      console.log(file);
    }

    editItemProp(item: UiItemData) {
      this.editItem = item;
    }

    getItemStyle(item: UiItemData, extend?: number): any {
      let attr: any = {};
      extend = extend | 0;
      attr.width = (item.w + extend) + 'px';
      attr.height = (item.h + extend) + 'px';
      attr.left = item.x + 'px';
      attr.top = item.y + 'px';
      attr.color = item.color;
      if (item.zIndex != null) {
        attr.zIndex = item.zIndex;
      }
      switch (item.type) {
        case 'TEXT':
          attr.fontSize = item.size + 'px';
          break;
        case '':
          break;

      }
      return attr;
    }

    editLoginLayout: UiContentData = {
      switchType: 'up_down',
      commonBg: {
        type: 'COMMON',
        x: 0,
        y: 0,
        w: 1920,
        h: 1080,
        imgUrl: 'http://pic1.win4000.com/wallpaper/4/59881599deed4.jpg'
      },
      pageList: [{
        id: 1, name: '二维码页面', isDefault: true,
        itemList: [
          {
            type: 'TEXT',
            x: 0,
            y: 0,
            w: 100,
            h: 40,
            text: '请登录信息',
            color: '#f04441',
            size: 16
          },
          {
            type: 'IMAGE',
            x: 200,
            y: 500,
            w: 300,
            h: 300,
            imgUrl: 'http://mp3.iqiyipic.com/image/20181006/90/63/ppu_530389340102_pp_601_300_300.jpg',
            focusImgUrl: '',
          },
          {
            type: 'IMAGE',
            x: 200,
            y: 100,
            w: 300,
            h: 300,
            imgUrl: 'http://mp3.iqiyipic.com/image/20181006/90/63/ppu_530389340102_pp_601_300_300.jpg',
            focusImgUrl: '',
          },
        ],
        switchPage: []
      }, {
        id: 2, name: '手机号页面', isDefault: false,
        itemList: [
          {
            type: 'TEXT',
            x: 0,
            y: 0,
            w: 100,
            h: 40,
            text: '请登录信息',
            color: '#f04441',
            size: 16
          },
          {
            type: 'IMAGE',
            x: 200,
            y: 200,
            w: 300,
            h: 300,
            imgUrl: 'http://mp3.iqiyipic.com/image/20181006/90/63/ppu_530389340102_pp_601_300_300.jpg',
            focusImgUrl: '',
          },
          {
            type: 'IMAGE',
            x: 600,
            y: 300,
            w: 300,
            h: 300,
            imgUrl: 'http://mp3.iqiyipic.com/image/20181006/90/63/ppu_530389340102_pp_601_300_300.jpg',
            focusImgUrl: '',
          },
        ],
        switchPage: []
      }]
    };

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
    .el-form-item--mini.el-form-item{
      margin-bottom:4px;
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
  }

  .cc-page-edit-con {
    .el-button--mini {
      margin: 5px 0px 5px 10px;
    }
  }

  .default-page-border {
    border: solid 1px #fa7b11;
  }

  .cc-view-page-con {
    width: 768px;
  }

  .current-edit-com {
    border: 4px dashed red;
    padding: 4px;
    margin: -8px;
  }
</style>

