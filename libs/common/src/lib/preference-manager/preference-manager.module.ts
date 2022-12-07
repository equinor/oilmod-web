import { PreferenceManagerComponent } from './preference-manager.component';
import { ActivePreferencePipe } from './active-preference.pipe';

/**
 * @deprecated PreferenceManagerComponent has been made standalone, and this module will be deleted in a later release.
 * Migrate to importing PreferenceManagerComponent directly.
 */
import { NgModule } from '@angular/core';

@NgModule({
  imports: [ PreferenceManagerComponent, ActivePreferencePipe ],
  exports: [ PreferenceManagerComponent, ActivePreferencePipe ]
})
export class PreferenceManagerModule {
}

