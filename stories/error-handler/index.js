import {storiesOf} from '@storybook/angular';
import {boolean, withKnobs} from '@storybook/addon-knobs';
import {HttpErrorHandlerModule} from "../../projects/stoui-error-handler/src/lib/sto-http-error-handler/http-error-handler.module";
import {WrapperModule} from "./wrapper";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

const stories = storiesOf('StoErrorHandler', module)
  .addDecorator(withKnobs);


stories.add('Error handler', () => ({
  moduleMetadata: {
    declarations: [],
    imports: [HttpErrorHandlerModule.forRoot(), WrapperModule, BrowserAnimationsModule]
  },
  template: `
  <wrapper></wrapper>
  `,
  props: {
    withClasses: boolean('Use styling', true),
    disabled: boolean('disabled', false),
    readonly: boolean('readonly', false),
  }
}), {
  notes: 'Card with sto-style is largely used for input fields, to align the title with labels.'
});
