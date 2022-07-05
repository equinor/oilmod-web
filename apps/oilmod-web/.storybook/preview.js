import {setCompodocJson} from "@storybook/addon-docs/angular";
import docJson from "./documentation.json";

setTimeout(() => {
  document.body.classList.add("mat-typography", "mat-app-background")
  document.body.style.paddingLeft = '0';
  document.body.style.height = '100vh';
}, 0);

setCompodocJson(docJson);

export const parameters = {
  actions: {argTypesRegex: "^on[A-Z].*"},
  angularLegacyRendering: true,
  backgrounds: {
    disable: true,
    default: 'eds-light',
    values: [
      {
        name: 'eds-light',
        value: '#F7F7F7',
      },
      {
        name: 'eds-dark',
        value: '#132634',
      },
    ],
  },
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      // Array of plain string values or MenuItem shape (see below)
      items: ['light', 'dark'],
      // Property that specifies if the name of the item will be displayed
      showName: true,
    },
  },
};

const withThemeProvider = (Story, context) => {
  const theme = context.globals.theme;
  const body = document.querySelector('body');
  if (theme === 'dark' && !body.classList.contains('sto-dark-theme')) {
    body.classList.add('sto-dark-theme');
  } else if (theme === 'light') {
    body.classList.remove('sto-dark-theme');
  }
  return Story(context);
}
export const decorators = [withThemeProvider];
