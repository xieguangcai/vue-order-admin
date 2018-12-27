<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
             label-position="left">
      <h3 class="title">欢迎使用coocaa智能订单系统</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon name="user"/>
        </span>
        <el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" placeholder="请输入登录账号"/>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon name="password"/>
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="请输入密码"
          @keyup.enter.native="handleLogin"/>
        <span class="show-pwd" @click="showPwd">
          <svg-icon name="eye"/>
        </span>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          点击进入系统
        </el-button>
      </el-form-item>
      <div class="tips">

      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import {isValidUsername} from '@/utils/validate';
import {Component, Vue, Watch} from 'vue-property-decorator';
import {UserModule} from '@/store/modules/user';
import {Form as ElForm} from 'element-ui';
import {handlerCommonError} from '../../utils/auth-interceptor';

const validateUsername = (rule: any, value: string, callback: any) => {
  if (!isValidUsername(value)) {
    callback(new Error('请输入正确的用户名'));
  } else {
    callback();
  }
};
const validatePass = (rule: any, value: string, callback: any) => {
  if (value.length < 5) {
    callback(new Error('密码不能小于5位'));
  } else {
    callback();
  }
};

@Component
export default class Login extends Vue {
  loginForm = {
    username: '',
    password: '',
  };
  loginRules = {
    username: [{required: true, trigger: 'blur', validator: validateUsername}],
    password: [{required: true, trigger: 'blur', validator: validatePass}],
  };
  loading = false;
  pwdType = 'password';

  showPwd() {
    if (this.pwdType === 'password') {
      this.pwdType = '';
    } else {
      this.pwdType = 'password';
    }
  }

  handleLogin() {
    (this.$refs.loginForm as ElForm).validate(async (valid: boolean) => {
      if (valid) {
        this.loading = true;
        UserModule.Login(this.loginForm).then(()=>{
          this.loading = false;
          this.$router.push({path: '/'});
        })
      } else {
        console.error('Login: error submit!!');
        return false;
      }
    });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  @import '../../../src/styles/variables.scss';

  $bg: $mainBg;
  $light_gray: #ee832d;

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: rgba(0, 0, 0, 0.77);
        height: 47px;
        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $inputBg inset !important;
          -webkit-box-shadow: 0 0 0px 1000px $inputBg inset !important;
          -webkit-text-fill-color: #ff7744 !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: $inputBg;
      border-radius: 5px;
      color: #454545;
    }
  }
  $dark_gray: #889aa4;
  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 520px;
      max-width: 100%;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
