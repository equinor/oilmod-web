import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  framework: '@storybook/angular',
  stories: ['../**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
};

export default config;
