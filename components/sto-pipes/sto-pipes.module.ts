import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberFormatPipe } from './number-format.pipe';
import { KeysPipe } from './keys.pipe';
import { DateFormatPipe } from './date-format.pipe';
import { QualityNamePipe } from './quality-name.pipe';
import { TankNamePipe } from './tank-name.pipe';
import { TankStatePipe } from './tank-state.pipe';
import { ExcludeUnit, GetUnit } from './with-unit';
import { YesNoPipe } from './yes-no';

@NgModule({
  imports: [CommonModule],
  declarations: [
    DateFormatPipe,
    KeysPipe,
    NumberFormatPipe,
    QualityNamePipe,
    TankNamePipe,
    TankStatePipe,
    GetUnit,
    ExcludeUnit,
    YesNoPipe
  ],
  exports: [
    DateFormatPipe,
    KeysPipe,
    NumberFormatPipe,
    QualityNamePipe,
    TankNamePipe,
    TankStatePipe,
    GetUnit,
    ExcludeUnit,
    YesNoPipe
  ]
})
export class StoPipesModule {
}