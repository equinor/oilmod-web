module.exports = {
  "stories": [
    "../stories/**/*.stories.@(ts|tsx)",
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-storysource",
    '@storybook/addon-notes/register'
  ],
  performance: {
    maxAssetSize: 10000000,
    maxEntrypointSize: 10000000,
    hints: "false"
  }
}
