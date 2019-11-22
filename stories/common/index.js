import {storiesOf} from '@storybook/angular';
import {MatIconModule} from "@angular/material/icon";
import {boolean, select, text, withKnobs} from "@storybook/addon-knobs";
import {action} from '@storybook/addon-actions';
import {StoMessagePanelComponent} from "../../projects/stoui-common/src/lib/sto-message-panel/sto-message-panel.component";
import {StoAppHeaderModule} from "../../projects/stoui-common/src/lib/sto-app-header/sto-app-header.module";
import {APP_BASE_HREF} from "@angular/common";
import {RouterTestingModule} from "@angular/router/testing";
import {StoActionFooterModule} from "../../projects/stoui-common/src/lib/sto-action-footer/sto-action-footer.module";
import footerReadme from "../../projects/stoui-common/src/lib/sto-action-footer/sto-action-footer.component.md";
import {MatButtonModule, MatFormFieldModule, MatInputModule} from "@angular/material";
import {StoFilterPanelModule} from "../../projects/stoui-common/src/lib/sto-filter/sto-filter-panel.module";
import filterReadme from "../../projects/stoui-common/src/lib/sto-filter/sto-filter-panel.component.md";
import messagePanelReadme from "../../projects/stoui-common/src/lib/sto-message-panel/sto-message-panel.component.md";
import appHeaderReadme from "../../projects/stoui-common/src/lib/sto-app-header/sto-app-header.component.md";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";

const stories = storiesOf('Common', module)
  .addDecorator(withKnobs);

stories
  .add('Message panel', () => ({
    moduleMetadata: {
      declarations: [StoMessagePanelComponent],
      imports: [MatIconModule]
    },
    template: `<div style="width: 350px;"><sto-message-panel [dismissable]="dismissable" (dismissed)="dismissed()" [severity]="severity">{{ text }}</sto-message-panel></div>`,
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
  }), {
    notes: {markdown: messagePanelReadme}
  });

stories.add('AppHeader & BreadCrumbs', () => ({
    moduleMetadata: {
      imports: [StoAppHeaderModule, RouterTestingModule, HttpClientModule],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'},
        // {provide: NAVIGATION_HOME_ICON, useValue: {svgIcon: 'lcs', text: 'EIMS'}}
      ]
    },
    template: `<sto-app-header [testEnvironment]="test"
[environmentName]="envName"
[breadCrumbs]="breadCrumbs"
[homeBreadCrumbConfig]="home"></sto-app-header>`,
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
<button mat-button (click)="save()" color="primary">Save</button>
<button mat-button (click)="cancel()">Cancel</button>
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
    imports: [StoFilterPanelModule, BrowserAnimationsModule, MatFormFieldModule, MatInputModule]
  },
  template: `<sto-filter-panel class="sto-form" [expandable]="true" (toggled)="toggled()">
<sto-filter-title>{{ title }}</sto-filter-title>
<mat-form-field floatLabel="always" class="sto-form__field">
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
