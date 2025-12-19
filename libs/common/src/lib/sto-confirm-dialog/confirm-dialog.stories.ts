import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmModule, ConfirmService } from '@ngx-stoui/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

@Component({
  selector: 'app-confirm-demo',
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 1rem; max-width: 600px;"
    >
      <h3>Confirm Dialog Variations</h3>

      <div>
        <button (click)="showDelete()" matButton="filled" color="warn">
          Delete (with cancel)
        </button>
        <p style="font-size: 0.875rem; color: #666; margin-top: 0.5rem;">
          Standard confirm with title, custom button text, and cancel option
        </p>
      </div>

      <div>
        <button (click)="showSimple()" matButton="filled">
          Simple Alert (no cancel)
        </button>
        <p style="font-size: 0.875rem; color: #666; margin-top: 0.5rem;">
          Single button confirmation without cancel option
        </p>
      </div>

      <div>
        <button (click)="showNoTitle()" matButton="filled">
          No Title Variant
        </button>
        <p style="font-size: 0.875rem; color: #666; margin-top: 0.5rem;">
          Minimal dialog with only message and actions
        </p>
      </div>

      <div>
        <button (click)="showWithResponse()" matButton="filled" color="primary">
          Show Response Handling
        </button>
        <p style="font-size: 0.875rem; color: #666; margin-top: 0.5rem;">
          Demonstrates Observable result handling (check console)
        </p>
      </div>

      @if (lastResult !== null) {
        <div style="padding: 1rem; background: #f5f5f5; border-radius: 4px;">
          <strong>Last result:</strong>
          {{ lastResult ? 'Confirmed' : 'Cancelled' }}
        </div>
      }
    </div>
  `,
})
class ConfirmDemoComponent {
  private readonly confirm = inject(ConfirmService);

  lastResult: boolean | null = null;

  showDelete() {
    this.confirm
      .confirm(
        'This action cannot be undone. Are you sure?',
        'Confirm delete',
        'Delete',
        true,
      )
      .subscribe();
  }

  showSimple() {
    this.confirm
      .confirm('This is an informational message', 'Information', 'OK', false)
      .subscribe();
  }

  showNoTitle() {
    this.confirm
      .confirm('Quick confirmation without a title', '', 'Got it', true)
      .subscribe();
  }

  showWithResponse() {
    this.lastResult = null;
    this.confirm
      .confirm(
        'Choose an option to see the result',
        'Response Example',
        'Confirm',
        true,
      )
      .subscribe((result) => {
        this.lastResult = result;
        console.log('Dialog result:', result);
      });
  }
}

const meta: Meta<ConfirmDemoComponent> = {
  title: 'common/Confirm Service',
  component: ConfirmDemoComponent,
  decorators: [
    moduleMetadata({
      imports: [ConfirmModule, MatButtonModule],
    }),
  ],
};
export default meta;

type StoryType = StoryObj<ConfirmDemoComponent>;
export const AllFeatures: StoryType = {
  render: (args) => ({
    props: args,
  }),
};
