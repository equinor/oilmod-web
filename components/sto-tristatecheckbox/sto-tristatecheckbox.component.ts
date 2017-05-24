import { ChangeDetectorRef, Component, forwardRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TriStateCheckbox } from '../../vendor/primeface/components/tristatecheckbox/tristatecheckbox';

export const TRISTATECHECKBOX_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => StoTriStateCheckboxComponent),
  multi: true
};

@Component({
  selector: 'sto-triStateCheckbox',
  templateUrl: 'sto-tristatecheckbox.component.html',
  providers: [TRISTATECHECKBOX_VALUE_ACCESSOR]
})
export class StoTriStateCheckboxComponent extends TriStateCheckbox {
}

@NgModule({
  imports: [CommonModule],
  exports: [StoTriStateCheckboxComponent],
  declarations: [StoTriStateCheckboxComponent]
})
export class StoTriStateCheckboxModule {
}