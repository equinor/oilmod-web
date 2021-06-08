import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberFormatPipe } from './number-format.pipe';
import { CurrencyFormatPipe } from './currency-format.pipe';
import { KeysPipe } from './keys.pipe';
import { DateFormatPipe } from './date-format.pipe';
import { ExcludeUnit, GetUnit } from './with-unit';
import { YesNoPipe } from './yes-no';

@NgModule({
  imports: [CommonModule],
  declarations: [
    DateFormatPipe,
    KeysPipe,
    NumberFormatPipe,
    CurrencyFormatPipe,
    GetUnit,
    ExcludeUnit,
    YesNoPipe
  ],
  exports: [
    DateFormatPipe,
    KeysPipe,
    NumberFormatPipe,
    CurrencyFormatPipe,
    GetUnit,
    ExcludeUnit,
    YesNoPipe
  ]
})
export class StoPipesModule {
}
