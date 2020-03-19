import {configure, setAddon} from '@storybook/angular';
import '../src/styles.scss';
import storySourceAddon from '@storybook/addon-storysource';

setAddon(storySourceAddon);

function loadStories() {
  document.body.classList.add('mat-typography', 'mat-app-background');
  // document.body.style.padding = '30px';

  require('../stories/core/index.js');
  require('../stories/common/index.js');
  require('../stories/form/index.js');
  require('../stories/drawer/index.js');
  require('../stories/datatable/index.js');
  require('../stories/datatable/complex.js');
  require('../stories/error-handler/index.js');
  // You can require as many stories as you need.
}

configure(loadStories, module);
