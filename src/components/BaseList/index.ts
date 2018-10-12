
import {Component, Vue} from 'vue-property-decorator';

@Component
export default class BaseList extends Vue {

  mutipleSelection: any[] = [];


  handleSelectionChange(val: any) {
    console.log(val);
    this.mutipleSelection = val;
  }

  handleDel() {
    console.log('正在删除列表信息');
    this.handleDelRows(this.mutipleSelection);
  }

  handleDelRows(row: any){

  }

}
