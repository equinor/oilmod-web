import { Pipe, PipeTransform } from '@angular/core';
import { Preference } from './preference';

@Pipe({
  name: 'activePreference'
})
export class ActivePreferencePipe implements PipeTransform {

  transform(preferences: Preference[], activePreferenceId: string | null): Preference | null {
    let active: Preference | undefined;
    if ( !preferences ) {
      return null;
    }
    if ( activePreferenceId ) {
      active = preferences.find(p => p.id === activePreferenceId);
    }
    return active ?? null;
  }

}
