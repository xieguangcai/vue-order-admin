<template>
  <div class="cc-edit-form">
    <div>
      <slot name="form-title"/>
    </div>
    <div class="cc-edit-form-con">
      <slot />
    </div>
    <div class="cc-edit-button">
      <template v-if="useDefaultAction">
        <el-button type="primary" icon="el-icon-edit" @click="save">保存</el-button>
        <el-button type="info" icon="el-icon-close" @click="cancel">取消</el-button>
        <el-button type="success" icon="el-icon-edit" @click="saveThenNew">保存并新增</el-button>
      </template>
      <slot name="form-actions"/>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({
    name: 'EditFormPane',
  })
  export default class EditFormPane extends Vue {
    @Prop()
    useDefaultAction: boolean = true;

    saveThenNew() {
      this.$emit('save-then-new');
    }

    cancel() {
      this.$emit('cancel');
    }

    save() {
      this.$emit('save');
    }
  }
</script>
