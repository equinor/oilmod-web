import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { StoDrawerComponent, StoDrawerModule, StoNavigationModule } from '../../projects/stoui-drawer/src/public_api';
import { action } from '@storybook/addon-actions';
import { navigation, subNavigation } from './navigation';

export default {
  title: 'Drawer/Navigation',
  decorators: [
    moduleMetadata({
      imports: [
        StoDrawerModule, StoNavigationModule, MatIconModule, MatButtonModule, BrowserAnimationsModule, MatCardModule
      ],
    })
  ],
} as Meta;

const Template: Story<StoDrawerComponent> = (args: StoDrawerComponent) => {
  const actions = {
    handleCommand: action('Link pressed'),
    topsNav: action('Open tops landing'),
    toggle: action('Switch side'),
    closeMenu: action('Close menu'),
  };
  return {
    component: StoDrawerComponent,
    props: { ...args, ...actions, navigation, subNavigation },
    template: `<div>
  <sto-drawer [open]="open" [animation]="animation" [backdrop]="backdrop">
<sto-drawer-header>
<div class="sto-drawer__header__infix">
        <button *ngIf="activePane === 'right'; else topIcon"
                type="button"
                mat-icon-button
                (click)="toggle(); activePane = 'left'">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <ng-template #topIcon>
          <button mat-icon-button
          type="button"
          (click)="topsNav()">
            <mat-icon [class.sto-main-icon--test-environment]="testEnvironment">settings</mat-icon>
          </button>
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
                (click)="closeMenu(); open = false">
          <mat-icon>close</mat-icon>
        </button>
      </div>
</sto-drawer-header>
<sto-slide-panel class="sto-slide-panel"
                     [activePane]="activePane">
                     {{activePane}}
<sto-navigation-menu [menu]="subNavigation"
*ngIf="activePane === 'right'"
                         (onCommand)="handleCommand('internal', $event.command)"
                         rightPane></sto-navigation-menu>
<sto-navigation-menu [menu]="navigation"
*ngIf="activePane === 'left'"
                         (onCommand)="activePane = 'right'; handleCommand('root', $event.command)"
                         leftPane></sto-navigation-menu>
                         </sto-slide-panel>
</sto-drawer>


<mat-card class="sto-card sto-form">
<mat-card-title class="sto-card__title">Content title</mat-card-title>
</mat-card>
<mat-card class="sto-card sto-form">
<mat-card-title class="sto-card__title">Content title</mat-card-title>
</mat-card>
</div>`
  };
};

export const NormalUse = Template.bind({});
NormalUse.args = {
  open: true,
  animation: true,
  backdrop: true,

  activePane: 'right',
  rightMenu: {
    name: 'Application 2'
  },
  leftMenu: {
    name: 'Application list'
  }
};


