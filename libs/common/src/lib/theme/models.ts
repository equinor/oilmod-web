export type ThemeName = 'light' | 'dark';
export type ThemeClassName = 'sto-light-theme' | 'sto-dark-theme';
export type TypographyName = 'small' | 'medium' | 'large';
export type TypographyClassName = 'sto-sm-typography' | 'sto-m-typography' | 'sto-l-typography';

export const themes = new Map<ThemeName, ThemeClassName>([
  [ 'light', 'sto-light-theme' ],
  [ 'dark', 'sto-dark-theme' ],
]);

export const typography = new Map<TypographyName, TypographyClassName>([
  [ 'small', 'sto-sm-typography' ],
  [ 'medium', 'sto-m-typography' ],
  [ 'large', 'sto-l-typography' ],
]);

export interface ThemeModel<T = ThemeName | TypographyName> {
  id?: string;
  type: 'typography' | 'theme';
  value: T;
}
