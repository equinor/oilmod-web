import { NumberFormatPipe } from './number-format.pipe';
import { CurrencyFormatPipe } from './currency-format.pipe';
import { KeysPipe } from './keys.pipe';
import { DateFormatPipe } from './date-format.pipe';
import { ExcludeUnit, GetUnit } from './with-unit';
import { YesNoPipe } from './yes-no';


import { NgModule } from '@angular/core';

@NgModule({
  imports: [
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
