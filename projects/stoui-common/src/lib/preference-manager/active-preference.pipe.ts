import { Pipe, PipeTransform } from '@angular/core';
import { Preference } from './preference';

@Pipe({
  name: 'activePreference'
})
export class ActivePreferencePipe implements PipeTransform {

  transform(preferences: Preference[], activePreferenceId: string): Preference {
    let active: Preference;
    if ( !preferences ) {
      return null;
    }
    if ( activePreferenceId ) {
      active = preferences.find(p => p.id === activePreferenceId);
    } else {
      active = preferences.find(p => p.default);
    }
    return active ? active : preferences.find(p => p.name);
  }

}
