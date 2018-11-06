<template>
  <div class="cc-me-changepwd">
    <h3>修改账户密码</h3>
    <el-form :model="domainInfo" ref="editForm" :rules="rules" :size="formSize">
      <el-form-item label="旧密码" :label-width="formLabelWidth" prop="oldPwd">
        <el-input type="password" v-model="domainInfo.oldPwd" auto-complete="off" placeholder="请输入旧密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPwd">
        <el-input type="password" v-model="domainInfo.newPwd" auto-complete="off" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" :label-width="formLabelWidth" prop="confirmPwd">
        <el-input type="password" v-model="domainInfo.confirmPwd" auto-complete="off" placeholder="请确认新密码"></el-input>
      </el-form-item>
      <div class="cc-edit-button">
        <el-button type="primary" icon="el-icon-edit" @click="save">保存</el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang='ts'>
  import {Component, Vue} from 'vue-property-decorator';
  import BaseEdit from '../components/BaseEdit';
  import {Message} from 'element-ui';
  import {ElForm} from 'element-ui/types/form';
  import {changePwd} from '../api/login';

  export interface UserChangePwd {
    oldPwd: string;
    newPwd: string;
    confirmPwd: string;
  }

  @Component({
    name: 'ChangePwd',
    mixins: [BaseEdit],
  })
  export default class ChangePwd extends Vue {
    domainInfo: UserChangePwd = {oldPwd: '', newPwd: '', confirmPwd: ''};

    rules = {
      oldPwd: [{required: true, message: '请输入旧密码', trigger: 'blur'}, {
        max: 50,
        min: 6,
        message: '密码长度在8-50个字符',
        trigger: 'blur',
      }],
      newPwd: [{required: true, message: '请输入新密码', trigger: 'blur'}, {
        min: 6,
        max: 50,
        message: '密码长度在8-50个字符',
        trigger: 'blur',
      }],
      confirmPwd: [
        {required: true, message: '请输入新密码', trigger: 'blur'},
        {
          validator: (rule: any, value: string, cb: any) => {
            if (this.domainInfo.newPwd !== value) {
              cb(new Error('两次输入密码不一致'));
            } else {
              cb();
            }
          },
        }, {
          min: 6,
          max: 50,
          message: '两次密码输入不一致',
          trigger: 'blur',
        }],
    };

    getEditForm(): ElForm {
      return this.$refs.editForm as ElForm;
    }

    save() {
      const form = this.getEditForm();
      form.validate(async (valid) => {
        if (!valid) {
          return false;
        } else {
          await changePwd(this.domainInfo.oldPwd, this.domainInfo.newPwd);
          form.resetFields();
          Message.success('密码修改成功');
        }
      });
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .cc-me-changepwd {
    max-width: 500px;
    margin: 10px;
    h3 {
      text-align: center;
    }
  }
</style>
