import {
  ReactiveFormsModule,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { StoWysiwygModule, WysiwygComponent } from '@ngx-stoui/form';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

type ContentType = 'empty' | 'basic' | 'formatted' | 'malicious';

interface StoryArgs {
  initialContent: ContentType;
  readonly: boolean;
  disabled: boolean;
  required: boolean;
}

const meta: Meta<WysiwygComponent & StoryArgs> = {
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
  argTypes: {
    initialContent: {
      control: 'select',
      options: ['empty', 'basic', 'formatted', 'malicious'],
      description: 'Initial content to load',
    },
    readonly: {
      control: 'boolean',
      description: 'Enable/disable readonly mode',
    },
    disabled: {
      control: 'boolean',
      description: 'Enable/disable the form control',
    },
    required: {
      control: 'boolean',
      description: 'Mark field as required (for validation demo)',
    },
  },
  args: {
    initialContent: 'formatted',
    readonly: false,
    disabled: false,
    required: false,
  },
};
export default meta;

const contentExamples: Record<ContentType, string> = {
  empty: '',
  basic: '<p>Simple text without formatting.</p>',
  formatted: `<p>This demonstrates <b>bold</b>, <i>italic</i>, and <u>underline</u> formatting.</p>
<ul>
  <li>Unordered list item 1</li>
  <li>Unordered list item 2</li>
</ul>
<ol>
  <li>Ordered list item 1</li>
  <li>Ordered list item 2</li>
</ol>
<p>You can also add <a href="https://example.com">links</a>.</p>`,
  malicious: `<iframe srcdoc="<script>alert('XSS attempt - but it gets sanitized!')</script>"></iframe>
<script>console.log('This script tag will be removed');</script>
<b>This bold text is safe and will remain.</b>
<img src="x" onerror="alert('XSS')">`,
};

export const Interactive: StoryObj<WysiwygComponent & StoryArgs> = {
  args: {
    initialContent: 'formatted',
    readonly: false,
    disabled: false,
    required: false,
  },
  render: (args) => {
    const content = contentExamples[args.initialContent];
    const validators = args.required ? [Validators.required] : [];
    const ctrl = new UntypedFormControl(
      { value: content, disabled: args.disabled },
      validators,
    );

    return {
      props: {
        ctrl,
        content,
        readonly: args.readonly,
        clearContent() {
          ctrl.setValue('');
        },
        resetContent() {
          ctrl.setValue(content);
        },
        toggleDisabled() {
          ctrl.disabled ? ctrl.enable() : ctrl.disable();
        },
      },
      template: `
<mat-card>
  <mat-card-header>
    <mat-card-title>WYSIWYG Editor</mat-card-title>
    <mat-card-subtitle>
      Rich text editor with formatting controls
    </mat-card-subtitle>
  </mat-card-header>
  <mat-card-content>
    <sto-wysiwyg [readonly]="readonly" [formControl]="ctrl"></sto-wysiwyg>

    <div style="margin-top: 16px; display: flex; gap: 8px; align-items: center;">
      <button mat-raised-button (click)="clearContent()">Clear</button>
      <button mat-raised-button (click)="resetContent()">Reset</button>
    </div>

    <div style="margin-top: 24px;">
      <h3>Form State</h3>
      <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px; font-family: monospace; font-size: 12px;">
        <span>Value:</span>
        <span>{{ ctrl.value || '(empty)' }}</span>
        <span>Valid:</span>
        <span [style.color]="ctrl.valid ? 'green' : 'red'">{{ ctrl.valid }}</span>
        <span>Touched:</span>
        <span>{{ ctrl.touched }}</span>
        <span>Dirty:</span>
        <span>{{ ctrl.dirty }}</span>
        <span>Disabled:</span>
        <span>{{ ctrl.disabled }}</span>
      </div>
    </div>

    <div style="margin-top: 24px;">
      <h3>HTML Sanitization Demo</h3>
      <p style="font-size: 14px; color: #666;">
        Try the "malicious" content option to see how dangerous HTML is automatically sanitized.
        Scripts, iframes, and event handlers are removed for security.
      </p>
      <details>
        <summary style="cursor: pointer; user-select: none; padding: 8px; background: #f5f5f5; border-radius: 4px;">
          View Raw HTML Output
        </summary>
        <pre style="background: #f5f5f5; padding: 12px; border-radius: 4px; overflow-x: auto; margin-top: 8px;"><code>{{ ctrl.value }}</code></pre>
      </details>
    </div>

    <div style="margin-top: 24px;">
      <h3>Supported Features</h3>
      <ul style="font-size: 14px;">
        <li><b>Bold</b>, <i>Italic</i>, <u>Underline</u> text formatting</li>
        <li>Bulleted (unordered) lists</li>
        <li>Numbered (ordered) lists</li>
        <li>Hyperlinks</li>
        <li>Remove formatting</li>
        <li>Tab/Shift+Tab for indent/outdent</li>
        <li>Automatic XSS protection via HTML sanitization</li>
        <li>Reactive Forms integration (FormControl)</li>
        <li>Readonly/disabled state</li>
      </ul>
    </div>
  </mat-card-content>
</mat-card>
`,
    };
  },
};
