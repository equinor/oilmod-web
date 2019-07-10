import {configure} from '@storybook/angular';

function loadStories() {
  require('../stories/common/index.js');
  require('../stories/form/index.js');
  require('../stories/datatable/index.js');
  // You can require as many stories as you need.
}

configure(loadStories, module);
