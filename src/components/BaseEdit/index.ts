
import {Component, Vue} from 'vue-property-decorator';
import {ElForm} from 'element-ui/types/form';

@Component({
  name: 'BaseEdit',
})
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

  saveForm(cb: () => {}) {
    const form = this.getEditForm();
    form.validate((valid) => {
      if (!valid) {
        return false;
      } else {
        this.saveFormData();
        this.$message.success('保存成功');
        form.resetFields();
        cb();
      }
    });
  }

  saveFormData() {
    console.warn('正在保存数据...子组件应该重写此方法实现保存逻辑');
  }
}
