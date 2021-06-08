import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideToggleComponent } from './slide-toggle.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ SlideToggleComponent ],
  exports: [ SlideToggleComponent ],
  imports: [
    CommonModule,
    MatSlideToggleModule,
    ReactiveFormsModule
  ]
})
export class SlideToggleModule {
}
