import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

const preferenceKey = 'TOPS_IM:UserPreferences';

@Injectable()
export class StoUserPreferenceService {

  public hasSelectTextOnFocusEnabled = new BehaviorSubject<boolean>(true);
  public preferences: any;
  public default = {
    hasSelectTextOnFocusEnabled: true
  };

  public setHasSelectTextOnFocusEnabled(value: boolean) {
    this.hasSelectTextOnFocusEnabled.next(value);
    this.preferences.hasSelectTextOnFocusEnabled = value;
    this.setPreferences(this.preferences);
  }

  public getPreferences() {
    return sessionStorage.getItem(preferenceKey);
  }

  public setPreferences(value) {
    sessionStorage.setItem(preferenceKey, JSON.stringify(value));
  }


  constructor() {
      let sessionPreferences = {};
      const sessionPreferencesString = this.getPreferences();
      try {
        sessionPreferences = JSON.parse(sessionPreferencesString);
      } catch (e) {
        console.error('Unable to parse the preferences from local storage. Loading default');
      }
      this.preferences = {...this.default, ...sessionPreferences};
      this.setHasSelectTextOnFocusEnabled(this.preferences.hasSelectTextOnFocusEnabled);
  }
}
