import { FormGroup } from '@angular/forms';
import { FormSerializeValidator } from './form-serialize-validator';
import { StoDrawerComponent } from '../sto-drawer/sto-drawer.component';

/**
 * Properties required in components behind the {@link UnsavedChangesGuard}
 */
export interface UnsavedChanges {

  form: FormGroup;
  drawer?: StoDrawerComponent;
  ignoreUnsavedChanges?: boolean;
  beforeClose?();
  formSerializeValidator: FormSerializeValidator;
  initFormSerializeValidator();
  globalUnsavedChanges($event: any);

}
