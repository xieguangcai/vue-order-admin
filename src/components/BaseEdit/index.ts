
import {Component, Vue} from 'vue-property-decorator';
import {ElForm} from 'element-ui/types/form';
import {AxiosPromise} from 'axios';
import any = jasmine.any;

@Component
export default class BaseEdit extends Vue {

  saveThenNew() {
    this.saveForm(() => this.$emit('save-success-then-new'));
  }
  getEditForm(): ElForm {
    return  this.$refs.editForm as ElForm;
  }

  cancel() {
    const form = this.getEditForm();
    form.resetFields();
    this.$emit('cancel');
  }

  save() {
    this.saveForm(() => this.$emit('save-success'));
  }

  saveForm(cb: () => void): void {
    const form = this.getEditForm();
    form.validate(async (valid) => {
      if (!valid) {
        return false;
      } else {
        await this.saveFormData();
        this.$message.success('保存成功');
        form.resetFields();
        cb();
      }
    });
  }

  saveFormData(): AxiosPromise  | any {  }
}
