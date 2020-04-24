import {storiesOf} from '@storybook/angular';
import {MatIconModule} from "@angular/material/icon";
import {boolean, select, text, withKnobs} from "@storybook/addon-knobs/angular";
import {action} from '@storybook/addon-actions';
import {StoAppHeaderModule} from "../../projects/stoui-common/src/lib/sto-app-header/sto-app-header.module";
import {APP_BASE_HREF} from "@angular/common";
import {RouterTestingModule} from "@angular/router/testing";
import {StoActionFooterModule} from "../../projects/stoui-common/src/lib/sto-action-footer/sto-action-footer.module";
import footerReadme from "../../projects/stoui-common/src/lib/sto-action-footer/sto-action-footer.component.md";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {StoFilterPanelModule, StoMessagePanelModule} from "../../projects/stoui-common/src/public_api";
import filterReadme from "../../projects/stoui-common/src/lib/sto-filter/sto-filter-panel.component.md";
import messagePanelReadme from "../../projects/stoui-common/src/lib/sto-message-panel/sto-message-panel.component.md";
import appHeaderReadme from "../../projects/stoui-common/src/lib/sto-app-header/sto-app-header.component.md";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {MatCardModule} from "@angular/material/card";
import {StoFormModule} from "../../projects/stoui-form/src/public_api";
import {ReactiveFormsModule} from "@angular/forms";
import {FilterPanelComponent} from "./filter-panel";
import {MatSelectModule} from "@angular/material/select";
import {StoDirectivesModule} from "../../projects/stoui-core/src/public_api";
import {MatMenuModule} from "@angular/material/menu";

const stories = storiesOf('Common', module)
  .addDecorator(withKnobs);

stories
  .add('Message panel', () => ({
    moduleMetadata: {
      declarations: [],
      imports: [MatIconModule, StoMessagePanelModule, MatCardModule]
    },
    template: `<mat-card style="width: 350px;"><sto-message-panel [dismissable]="dismissable" (dismissed)="dismissed()" [icon]="icon" [color]="color">{{ text }}</sto-message-panel></mat-card>`,
    props: {
      text: text(`text`, `A warning`),
      dismissed: action('dismissed'),
      dismissable: boolean('dismissable', true),
      color: select('severity', {
        Warning: 'warning',
        Error: 'danger',
        'Accent (info)': 'accent',
        Primary: 'primary',
        Success: 'success'
      }, 'accent'),
      icon: select('icon', {
        Warning: 'warning',
        Error: 'error',
        Info: 'info',
        Success: 'check'
      }, 'info')
    }
  }), {
    notes: {markdown: messagePanelReadme}
  });

stories.add('AppHeader & BreadCrumbs', () => ({
    moduleMetadata: {
      imports: [StoAppHeaderModule, RouterTestingModule, HttpClientModule, MatButtonModule, MatMenuModule, MatIconModule, BrowserAnimationsModule],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'},
        // {provide: NAVIGATION_HOME_ICON, useValue: {svgIcon: 'lcs', text: 'EIMS'}}
      ]
    },
    template: `<sto-app-header [testEnvironment]="test"
[environmentName]="envName"
[breadCrumbs]="breadCrumbs"
[userMenu]="menuUser"
[homeBreadCrumbConfig]="home">
<button mat-icon-button>
  <mat-icon>account_circle</mat-icon>
</button>
</sto-app-header>
<mat-menu #menuUser="matMenu">
<button mat-menu-item class="dense">User Name</button>
</mat-menu>
`,
    props: {
      test: boolean('Style as test environment', false),
      envName: 'Systemtest',
      home: {command: () => action('Clicked home')},
      breadCrumbs: [
        {label: 'Home', segment: 'home'},
        {label: 'Step 2', segment: 'step2'}
      ]
    }
  }),
  {
    notes: {markdown: appHeaderReadme}
  });

stories.add('ActionFooter', () => ({
  moduleMetadata: {
    imports: [StoActionFooterModule, MatButtonModule],
  },
  template: `<sto-action-footer [isLoading]="loading">
<button mat-raised-button (click)="save()" color="primary">Save</button>
<button mat-raised-button (click)="cancel()" color="accent">Cancel</button>
<button mat-raised-button (click)="cancel()" color="error">Cancel</button>
<button mat-raised-button (click)="cancel()" color="warning">Cancel</button>
<button mat-raised-button (click)="cancel()" color="success">Cancel</button>
</sto-action-footer>`,
  props: {
    save: action('Save clicked'),
    cancel: action('Cancel clicked'),
    loading: boolean('Show loading indicator', false)
  }
}), {
  notes: {markdown: footerReadme}
});

stories.add('Filter Panel', () => ({
  moduleMetadata: {
    imports: [StoFilterPanelModule, BrowserAnimationsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, StoFormModule,]
  },
  template: `<sto-filter-panel class="sto-form" [expandable]="true" (toggled)="toggled()">
<sto-filter-title>{{ title }}</sto-filter-title>
<sto-filter-table-actions>
<button mat-icon-button><mat-icon>add</mat-icon></button>
</sto-filter-table-actions>
<mat-form-field floatLabel="always" stoFormField>
<mat-label>Input label</mat-label>
<input matInput>
</mat-form-field>
</sto-filter-panel>`,
  props: {
    toggled: action('Toggled filter panel'),
    title: text('Title', 'Filter title')
  }
}), {
  notes: {markdown: filterReadme}
});


stories.add('Filter Form Panel', () => ({
  moduleMetadata: {
    declarations: [FilterPanelComponent],
    imports: [StoFilterPanelModule, BrowserAnimationsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, StoFormModule, ReactiveFormsModule, MatSelectModule, StoDirectivesModule]
  },
  template: `<filter-panel></filter-panel>`,
  props: {
    toggled: action('Toggled filter panel'),
    title: text('Title', 'Filter title')
  }
}), {
  notes: {markdown: filterReadme}
});
