import {getModule, Module, MutationAction, VuexModule} from 'vuex-module-decorators';
import store from '../index';
import {RoleInfo} from '../../types/index';
import {getAllValidRoleList} from '../../api/account';


export interface IRoleState {
    roles: RoleInfo[];
}

@Module({ dynamic: true, store, name: 'role' })
class Role extends VuexModule {
    roles: IRoleState['roles'] = [];

    @MutationAction({ mutate: [ 'roles'] })
    async GetAllValidRoles(refresh: boolean) {
        if (refresh || this.roles.length === 0) {
            const {data} = await getAllValidRoleList();
            if (data.data) {
                return {
                    roles: data.data,
                };
            } else {
                throw Error('GetAllValidRoles: data must be a non-null array!');
            }
        }
    }
}

export const RoleModule = getModule(Role.prototype);
