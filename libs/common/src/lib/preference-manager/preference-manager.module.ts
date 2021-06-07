import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferenceManagerComponent } from './preference-manager.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivePreferencePipe } from './active-preference.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [ PreferenceManagerComponent, ActivePreferencePipe ],
  exports: [ PreferenceManagerComponent ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ]
})
export class PreferenceManagerModule {
}
