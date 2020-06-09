import { Component, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { StoFormModule } from '../../projects/stoui-form/src/lib/sto-form/sto-form.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { NumberInputModule } from '../../projects/stoui-form/src/lib/number-input/number-input.module';

@Component({
  selector: 'wrapper',
  template: '<mat-card [formGroup]="form"><mat-form-field><sto-number-unit-input formControlName="ctrl"></sto-number-unit-input></mat-form-field></mat-card>'
})
export class WrapperComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    const s = new Subject();
    this.form = this.fb.group({
      ctrl: []
    });
  }
}

@NgModule({
  imports: [ BrowserAnimationsModule, MatFormFieldModule, NumberInputModule, MatCardModule, StoFormModule, ReactiveFormsModule ],
  exports: [ BrowserAnimationsModule, MatFormFieldModule, NumberInputModule, MatCardModule, StoFormModule, ReactiveFormsModule, WrapperComponent ],
  declarations: [ WrapperComponent ],
})
export class WrapperModule {
}
