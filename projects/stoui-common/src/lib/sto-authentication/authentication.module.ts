import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdalConfigService } from './adal-config.service';
import { AuthInterceptorService } from './auth-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationGuard } from './authentication.guard';
import { StoCallbackComponent } from './callback/sto-callback.component';
import { ADAL_DISABLED } from './adal.config';

@NgModule({
  declarations: [ StoCallbackComponent ],
  imports: [
    CommonModule
  ],
  exports: [ StoCallbackComponent ]
})
export class StoAuthenticationModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: StoAuthenticationModule,
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
        { provide: ADAL_DISABLED, useValue: false },
        // { provide: ADAL_LOGOUT_URL, useValue: window.location.origin },
        AdalConfigService,
        AuthenticationGuard,
      ]
    };
  }
}
