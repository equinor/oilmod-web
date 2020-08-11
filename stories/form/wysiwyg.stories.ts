import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { StoWysiwygModule, WysiwygComponent } from '../../projects/stoui-form/src/public_api';

export default {
  title: 'form/Wysiwyg',
  component: WysiwygComponent,
  decorators: [
    moduleMetadata({
      imports: [ StoWysiwygModule, ReactiveFormsModule, MatCardModule, MatButtonModule ],
    })
  ]
} as Meta;

const Template: Story<WysiwygComponent> = (args) => {
  return {
    component: WysiwygComponent,
    props: args,
    template: args.template ? args.template() : null
  };
};

export const Usage = Template.bind({});
Usage.args = {};
