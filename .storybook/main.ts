// This file has been automatically migrated to valid ESM format by Storybook.
import { createRequire } from "node:module";
import type { StorybookConfig } from '@storybook/angular';

const require = createRequire(import.meta.url);

// Simple delegating main that just re-exports the app-level storybook config
// This allows running `npx storybook` from the workspace root of oilmod-web
// which looks for `.storybook/main.ts` at the project root.

const projectConfig: StorybookConfig =
  require('./../apps/oilmod-web/.storybook/main.ts').default;

export default projectConfig;
