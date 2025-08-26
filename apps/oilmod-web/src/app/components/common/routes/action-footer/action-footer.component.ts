import { Component } from '@angular/core';
import { DemoComponent } from '../../../demo.component';
import { StoActionFooterComponent } from '@ngx-stoui/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

const code = `import { Component } from '@angular/core';
import { DemoComponent } from '../../../demo.component';
import { StoActionFooterComponent } from '@ngx-stoui/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  template: \`
    <sto-demo [code]="code">
      <mat-checkbox [checked]="loading"
                    (change)="loading = $event.checked">Loading indicator
      </mat-checkbox>
      <mat-checkbox [checked]="addClass"
                    (change)="addClass = $event.checked">Add body-overflow class
      </mat-checkbox>

      <sto-action-footer [isLoading]="loading"
                         [shouldAddClass]="addClass">
        <button color="primary" mat-flat-button>Save</button>
        <button color="primary" mat-button>Reset</button>
      </sto-action-footer>
    </sto-demo>


  \`,
  standalone: true,
  imports: [
    DemoComponent,
    DemoComponent,
    StoActionFooterComponent,
    MatCheckboxModule,
    MatButtonModule
  ]
})
export class ActionFooterDemoComponent {
  public loading: boolean;
  public addClass: boolean;
  public code = code;
}
`;

@Component({
    template: `
    <sto-demo [code]="code">
      <mat-checkbox [checked]="loading"
                    (change)="loading = $event.checked">Loading indicator
      </mat-checkbox>
      <mat-checkbox [checked]="addClass"
                    (change)="addClass = $event.checked">Add body-overflow class
      </mat-checkbox>

      <sto-action-footer [isLoading]="loading"
                         [shouldAddClass]="addClass">
        <button color="primary"
                mat-flat-button>Save
        </button>
        <button color="primary"
                mat-button>Reset
        </button>
      </sto-action-footer>
    </sto-demo>


  `,
    imports: [
        DemoComponent,
        DemoComponent,
        StoActionFooterComponent,
        MatCheckboxModule,
        MatButtonModule
    ]
})
export class ActionFooterDemoComponent {
  public loading: boolean;
  public addClass: boolean;
  public code = code;
}
