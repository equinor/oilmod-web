import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferenceManagerComponent } from './preference-manager.component';


@NgModule({
  declarations: [ PreferenceManagerComponent ],
  exports: [ PreferenceManagerComponent ],
  imports: [
    CommonModule
  ]
})
export class PreferenceManagerModule {
}
