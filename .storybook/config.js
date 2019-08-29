import {configure} from '@storybook/angular';
import '../src/styles.scss';

function loadStories() {
  document.body.classList.add('mat-typography');
  document.body.style.padding = '30px';

  // require('../stories/core/index.js');
  // require('../stories/common/index.js');
  // require('../stories/form/index.js');
  require('../stories/datatable/index.js');
  // require('../stories/drawer/index.js');
  // You can require as many stories as you need.
}

configure(loadStories, module);
