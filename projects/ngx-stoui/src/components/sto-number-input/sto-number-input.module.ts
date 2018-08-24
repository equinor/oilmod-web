import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MatInputModule} from '@angular/material';

import {StoNumberInputPipe} from './sto-number-input.pipe';
import {StoNumberInputDirective} from './sto-number-input.directive';
import {StoNumberInputComponent} from './sto-number-input.component';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { StoDirectivesModule } from '../sto-directives/directives.module';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, StoDirectivesModule],
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
