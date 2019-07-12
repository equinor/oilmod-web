import {storiesOf} from '@storybook/angular';
import {boolean, number, radios, text, withKnobs} from '@storybook/addon-knobs';
import {action} from '@storybook/addon-actions';
import {StoDrawerModule} from "../../projects/stoui-drawer/src/lib/sto-drawer/sto-drawer.module";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule} from "@angular/material/button";
import {StoNavigationModule} from "../../projects/stoui-drawer/src/lib/sto-navigation/sto-navigation.module";
import {navigation, subNavigation} from './navigation';
import {MatIconModule} from "@angular/material";
import {USE_HASH_ROUTING} from "../../projects/stoui-drawer/src/lib/sto-navigation/tokens";
import readmeDrawer from '../../projects/stoui-drawer/src/lib/sto-drawer/sto-drawer.component.md';

const stories = storiesOf('Drawer', module)
  .addDecorator(withKnobs);

stories.add('Drawer', () => ({
    moduleMetadata: {
      declarations: [],
      imports: [StoDrawerModule, MatCardModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule, MatButtonModule]
    },
    template: `
<sto-drawer [ignoreEscKey]="ignoreEscKey" (submit)="submitKey()" (cancel)="cancelKey()" [position]="position" [width]="width + 'px'">
<sto-drawer-header>
<h2>{{ title }}</h2>
</sto-drawer-header>
<mat-card class="sto-card sto-form">
<mat-card-title class="sto-card__title">Content title</mat-card-title>
<mat-form-field class="sto-form__field">
<mat-label>Input</mat-label>
<input matInput value="Test input">
</mat-form-field>
</mat-card>
<sto-drawer-footer>
<button mat-raised-button color="primary" (click)="submit()">Save</button>
<button mat-button (click)="cancel()">Cancel</button>
</sto-drawer-footer>
</sto-drawer>`,
    props: {
      position: radios('Position', ['left', 'right'], 'left'),
      width: number('Width', 500),
      title: text('Drawer title', 'New drawer'),
      ignoreEscKey: boolean('Ignore escape', false),
      submit: action('Submit'),
      cancel: action('Cancel'),
      submitKey: action('Submit from shortcut'),
      cancelKey: action('Cancel from shortcut'),
    }
  }),
  {
    notes: {markdown: readmeDrawer}
  }
);

stories.add('Navigation', () => ({
  moduleMetadata: {
    declarations: [],
    imports: [StoDrawerModule, StoNavigationModule, MatIconModule, MatButtonModule, BrowserAnimationsModule],
    providers: [{provide: USE_HASH_ROUTING, useValue: false}]
  },
  template: `<sto-drawer>
<sto-drawer-header>
<div class="sto-drawer__header__infix">
        <button *ngIf="activePane === 'right'; else topIcon"
                type="button"
                mat-icon-button
                (click)="toggle(); activePane = 'left'">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <ng-template #topIcon>
          <a href="#" mat-icon-button (click)="$event.preventDefault(); topsNav()">
            <mat-icon class="sto-main-icon"
                      [class.sto-main-icon--test-environment]="testEnvironment">settings</mat-icon>
          </a>
        </ng-template>
      </div>
<div class="sto-drawer__header__title">
        <ng-container *ngIf="activePane === 'right'; else leftName;">
          <span *ngIf="activePane === 'right'">
           {{rightMenu.name}}
         </span>
        </ng-container>
        <ng-template #leftName>
         <span *ngIf="activePane === 'left'">
           {{leftMenu.name}}
         </span>
        </ng-template>
      </div>
      <div class="sto-drawer__header__suffix">
        <button type="button"
                mat-icon-button
                (click)="closeMenu()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
</sto-drawer-header>
<sto-slide-panel class="sto-slide-panel"
                     [activePane]="activePane">
<sto-navigation-menu [menu]="subNavigation"
*ngIf="activePane === 'right'"
                         (onCommand)="handleCommand('internal', $event.command)"
                         rightPane></sto-navigation-menu>
<sto-navigation-menu [menu]="navigation"
*ngIf="activePane === 'left'"
                         (onCommand)="activePane = 'right'; handleCommand('root', $event.command)"
                         leftPane></sto-navigation-menu>
                         </sto-slide-panel>
</sto-drawer>`,
  props: {
    navigation: navigation,
    subNavigation,
    handleCommand: action('Link pressed'),
    topsNav: action('Open tops landing'),
    toggle: action('Switch side'),
    closeMenu: action('Close menu'),
    activePane: radios('Active pane', ['right', 'left'], 'right'),
    rightMenu: {
      name: 'Application 2'
    },
    leftMenu: {
      name: 'Application list'
    }
  }
}), {});
