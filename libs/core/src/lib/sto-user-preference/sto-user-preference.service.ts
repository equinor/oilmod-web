import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const preferenceKey = 'TOPS_IM:UserPreferences';

@Injectable()
export class StoUserPreferenceService {

  public hasSelectTextOnFocusEnabled = new BehaviorSubject<boolean>(true);
  public preferences: {
    hasSelectTextOnFocusEnabled: boolean;
  };
  public default = {
    hasSelectTextOnFocusEnabled: true
  };


  constructor() {
    let sessionPreferences = {};
    const sessionPreferencesString = this.getPreferences();
    try {
      sessionPreferences = JSON.parse(sessionPreferencesString);
    } catch ( e ) {
      console.error('Unable to parse the preferences from local storage. Loading default');
    }
    this.preferences = { ...this.default, ...sessionPreferences };
    this.setHasSelectTextOnFocusEnabled(this.preferences.hasSelectTextOnFocusEnabled);
  }

  public setHasSelectTextOnFocusEnabled(value: boolean) {
    this.hasSelectTextOnFocusEnabled.next(value);
    this.preferences.hasSelectTextOnFocusEnabled = value;
    this.setPreferences(this.preferences);
  }

  public getPreferences() {
    return sessionStorage.getItem(preferenceKey) || '{}';
  }

  public setPreferences(value: Record<string, unknown>) {
    sessionStorage.setItem(preferenceKey, JSON.stringify(value));
  }
}
