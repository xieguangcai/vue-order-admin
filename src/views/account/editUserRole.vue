<template>
  <div class="cc-edit-form">
    <el-checkbox-group v-model="userRoles">
      <div v-for="(role, index) in roles" class="cc-application-container">
        <div v-if="checkPrevAppId(role.application.appId, index)" class="cc-application-title">
          {{role.application.name}}
        </div>
        <el-checkbox :label="role.roleId">[{{role.roleKey}}]-{{role.name}}
        </el-checkbox>
      </div>
    </el-checkbox-group>
    <div class="cc-edit-button">
      <el-button type="primary" icon="el-icon-edit" @click="save">保存</el-button>
      <el-button type="info" icon="el-icon-close" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import {RoleInfo} from '../../types/index';
import {RoleModule} from '@/store/modules/role';
import {getAccountRoles, saveAccountRoles} from '../../api/account';

let groupPrevAppId: number = 0;

@Component({
  name: 'EditUserRole',
})
export default class EditUserRole extends Vue {
  @Prop({type: Number, default: 0})
  accountId: number = 0;
  userRoles: Array<number | undefined> = [];

  cancel() {
    this.$emit('cancel');
  }

  get roles(): RoleInfo[] {
    return RoleModule.roles;
  }

  checkPrevAppId(appId: number, index: number): boolean {
    if (0 === index) {
      groupPrevAppId = appId;
      return true;
    }
    if (appId !== groupPrevAppId) {
      groupPrevAppId = appId;
      return true;
    }
    return false;
  }

  async save() {
    if (this.accountId != null) {
      await saveAccountRoles(this.accountId, this.userRoles);
      this.$message.success('用户角色修改成功');

      this.$emit('save-success');
    }
  }

  @Watch('accountId', {immediate: true})
  handleAccountInfoChange(newVal: number | undefined, oldVal: number | undefined) {

    RoleModule.GetAllValidRoles(false);

    if (null == newVal || newVal === 0) {
      this.userRoles = [];
    } else {
      getAccountRoles(this.accountId).then((resolve) => {
        console.log(resolve.data.data);
        const roles: RoleInfo[] = resolve.data.data;
        this.userRoles = [];
        if (null != roles) {
          roles.sort((a, b) => {
            if (null != a.application && null != b.application) {
              if (a.application.appId != null && b.application.appId != null) {
                return a.application.appId - b.application.appId;
              } else {
                return 0;
              }
            } else {
              return 0;
            }
          });
          for (const role of roles) {
            this.userRoles.push(role.roleId);
          }
        }
      });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .cc-application-title {
    font-size: 16px;
    margin: 5px 0px;
  }

  .cc-application-container .el-checkbox {
    margin-left: 20px;
  }

  .cc-edit-button {
    margin-top: 30px;
  }
</style>
