/*
import { addDecorator } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';

addDecorator(withKnobs);

setTimeout(() => {
  document.body.classList.add("mat-typography", "mat-app-background")
  document.body.style.paddingLeft = '0';
}, 0);

*/


import {setCompodocJson} from "@storybook/addon-docs/angular";
import docJson from "./documentation.json";
import darkTheme from './sto-dark';
import lightTheme from './sto-light';

import addons from '@storybook/addons';

setTimeout(() => {
  document.body.classList.add("mat-typography", "mat-app-background")
  document.body.style.paddingLeft = '0';
}, 0);

setCompodocJson(docJson);

export const parameters = {
  actions: {argTypesRegex: "^on[A-Z].*"},
  darkMode: {
    dark: darkTheme,
    light: lightTheme,
  }
}

// get channel to listen to event emitter
const channel = addons.getChannel();

channel.on('DARK_MODE', dark => {
  const currentDark = document.body.classList.contains('sto-dark-theme');
  if (dark && !currentDark) {
    document.body.classList.add('sto-dark-theme');
  } else if (dark && currentDark) {
  } else if (!dark) {
    document.body.classList.remove('sto-dark-theme');
  }
});
