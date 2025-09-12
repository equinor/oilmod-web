import type { StorybookConfig } from '@storybook/angular';

type WebpackEntries = { [key: string]: string[] };

const config: StorybookConfig = {
  stories: [
    '../../../libs/**/src/lib/**/*.stories.@(ts|tsx|js|jsx|mdx)',
    '../../../libs/**/src/**/*.stories.@(ts|tsx|js|jsx|mdx)',
    '../src/**/*.stories.@(ts|tsx|js|jsx|mdx)',
  ],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  docs: {
    defaultName: 'Docs',
  },
};

export default config;
