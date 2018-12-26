
import {Component, Vue} from 'vue-property-decorator';
import {ElForm} from 'element-ui/types/form';
import {AxiosPromise} from 'axios';
import {AppModule} from '@/store/modules/app';

@Component
export default class BaseEdit extends Vue {
  loadingData: boolean = true;
  loadingText: string = '正在加载数据...';

  showLoading() {
    this.loadingData = true;
  }
  hiddenLoading() {
    this.loadingData = false;
  }

  get formLabelWidth() {
    return AppModule.formLabelWidth;
  }

  get recordeStatus() {
    return AppModule.recordeStatus;
  }
  get formSize() {
    return AppModule.formSize;
  }

  saveThenNew() {
    this.saveForm(() => this.$emit('save-success-then-new'));
  }
  getEditForm(): ElForm {
    return  this.$refs.editForm as ElForm;
  }

  cancel() {
    const form = this.getEditForm();
    form.resetFields();
    this.hiddenLoading();
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
        const oldText = this.loadingText;
        this.loadingText = '正在保存数据...';
        this.showLoading();
        await this.saveFormData().finally(() => {
          this.hiddenLoading();
          this.loadingText = oldText;
        });
        this.$message.success('保存成功');
        form.resetFields();
        cb();
      }
    });
  }

  saveFormData(): Promise<any>  | any {  }
}
