import { FormGroup } from '@angular/forms';
import { FormSerializeValidator } from '../form-serialize-validator';
import { StoDrawerComponent } from '@ngx-stoui/drawer';
export interface UnsavedChanges {

  form: FormGroup;
  drawer?: StoDrawerComponent;
  ignoreUnsavedChanges?: boolean;
  formSerializeValidator: FormSerializeValidator;
  beforeClose?();
  initFormSerializeValidator();
  globalUnsavedChanges($event: any);

}
