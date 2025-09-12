import type { Preview } from '@storybook/angular';
import { withGlobals } from './with-body-class';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      expanded: true,
      sort: 'requiredFirst',
    },
    layout: 'padded',
  },
  decorators: [withGlobals],
};

export default preview;
