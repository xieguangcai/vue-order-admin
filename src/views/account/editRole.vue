<template>
  <div>
    <el-checkbox-group v-model="roles">
      <el-checkbox v-for="role in roles" :label="role.name" :key="role.roleId">[{{role.roleKey}}]-{{role.name}}
      </el-checkbox>
    </el-checkbox-group>
    <div class="cc-edit-button">
      <el-button type="primary" icon="el-icon-edit" @click="save">保存</el-button>
      <el-button type="info" icon="el-icon-close" @click="cancel">取消</el-button>
      <el-button type="success" icon="el-icon-edit" @click="saveThenNew">保存并新增</el-button>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {RoleInfo} from '../../types/index';
  import {RoleModule} from '@/store/modules/role';

  @Component({
    name: 'EditRole',
  })
  export default class EditRole extends Vue {
    @Prop()
    role: RoleInfo = {status: 1};

    get roles() {
      RoleModule.GetAllValidRoles(false);
      return RoleModule.roles;
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
