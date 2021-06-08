import { Injectable, InjectionToken } from '@angular/core';
import { ThemeModel, ThemeName, TypographyName } from './models';
import { Observable, of } from 'rxjs';

type ReturnValue<T> = Promise<T> | Observable<T> | T;

export interface ThemeSaver<T = ReturnValue<ThemeModel>> {
  save(model: ThemeModel): T;

  load(type?: 'typography' | 'theme'): T;

  remove?(): ReturnValue<void>;
}

export const THEME_SAVER = new InjectionToken<ThemeSaver>('sto__theme__typo');

@Injectable({ providedIn: 'root' })
export class ThemeSaverService implements ThemeSaver {
  load(type: 'typography' | 'theme'): Observable<ThemeModel> {
    let value = localStorage.getItem('tops__' + type) as TypographyName | ThemeName;
    if ( !value ) {
      value = type === 'typography' ? 'medium' : 'light';
    }
    return of({ value, type });
  }

  save(model: ThemeModel): Observable<ThemeModel> {
    localStorage.setItem('tops__' + model.type, model.value);
    return of(model);
  }
}
