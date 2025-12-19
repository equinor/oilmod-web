import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  framework: '@storybook/angular',
  stories: [
    '../../../libs/**/src/lib/**/*.stories.@(ts|tsx|js|jsx|mdx)',
    '../../../libs/**/src/**/*.stories.@(ts|tsx|js|jsx|mdx)',
    '../src/**/*.stories.@(ts|tsx|js|jsx|mdx)',
  ],
  addons: ['@storybook/addon-docs'],
  docs: {
    defaultName: 'Docs',
  },
};

export default config;
