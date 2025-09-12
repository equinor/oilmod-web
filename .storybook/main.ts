import type { StorybookConfig } from '@storybook/angular';

// Simple delegating main that just re-exports the app-level storybook config
// This allows running `npx storybook` from the workspace root of oilmod-web
// which looks for `.storybook/main.ts` at the project root.

const projectConfig: StorybookConfig =
  require('./../apps/oilmod-web/.storybook/main.ts').default;

export default projectConfig;
