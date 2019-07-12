import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';

import { StoNumberInputPipe } from './sto-number-input.pipe';
import { StoNumberInputDirective } from './sto-number-input.directive';
import { StoNumberInputComponent } from './sto-number-input.component';
import { CommonModule } from '@angular/common';
import { StoDirectivesModule } from '@ngx-stoui/core';
import { StoFormModule } from '../sto-form/sto-form.module';

@NgModule({
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, StoDirectivesModule, StoFormModule ],
  declarations: [
    StoNumberInputPipe, StoNumberInputDirective, StoNumberInputComponent
  ],
  exports: [
      StoNumberInputDirective,
      StoNumberInputComponent
  ],
  providers: [StoNumberInputPipe]

})
export class StoNumberInputModule { }
