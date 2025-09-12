// Adds the required Material host background class for CSS variable theming
// Applied once per story render lifecycle.
import type { Decorator } from '@storybook/angular';

export const withGlobals: Decorator = (storyFn) => {
  if (typeof document !== 'undefined') {
    document.body.classList.add('mat-app-background', 'mat-typography');
  }
  return storyFn();
};
