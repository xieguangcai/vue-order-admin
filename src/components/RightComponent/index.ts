
import {Component, Vue} from 'vue-property-decorator';
import {checkRole} from "@/utils/auth";

@Component
export default class RightComponent extends Vue {

  checkUserRole(role: string){
    return checkRole(role);
  }
}
