import { ModuleWithProviders, NgModule } from '@angular/core';
import { StoUserPreferenceService } from './sto-user-preference.service';
import { CommonModule } from '@angular/common';
import { StoUserPreferenceComponent } from './sto-user-preference.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, MatExpansionModule, ReactiveFormsModule, FormsModule],
  exports: [StoUserPreferenceComponent],
  declarations: [StoUserPreferenceComponent]
})
export class StoUserPreferenceModule {
  static forRoot(): ModuleWithProviders<StoUserPreferenceModule> {
    return {
      ngModule: StoUserPreferenceModule,
      providers: [StoUserPreferenceService]
    };
  }
}
