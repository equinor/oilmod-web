import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoThemeService } from './theme.service';
import { ThemeSaverService } from './theme-saver.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class StoThemeModule {
  static forRoot(): ModuleWithProviders<StoThemeModule> {
    return {
      ngModule: StoThemeModule,
      providers: [
        StoThemeService,
        ThemeSaverService
      ]
    };
  }
}
