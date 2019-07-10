import {storiesOf} from '@storybook/angular';
import {MatIconModule} from "@angular/material/icon";
import {boolean, select, text, withKnobs} from "@storybook/addon-knobs";
import {action} from '@storybook/addon-actions';
import {StoMessagePanelComponent} from "../../projects/stoui-common/src/lib/sto-message-panel/sto-message-panel.component";

storiesOf('Common - Message panel', module)
  .addDecorator(withKnobs)
  .add('Usage', () => ({
    moduleMetadata: {
      declarations: [StoMessagePanelComponent],
      imports: [MatIconModule]
    },
    template: `<div style="width: 350px; margin: 50px"><sto-message-panel [dismissable]="dismissable" (dismissed)="dismissed()" [severity]="severity">{{ text }}</sto-message-panel></div>`,
    props: {
      text: text(`text`, `A warning`),
      dismissed: action('dismissed'),
      dismissable: boolean('dismissable', false),
      severity: select('severity', {
        Warning: 'warning',
        Error: 'error',
        Info: 'info'
      }, 'info')
    }
  }));

