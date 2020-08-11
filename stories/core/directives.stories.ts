import { Meta, Story } from '@storybook/angular/types-6-0';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { StoDirectivesModule } from '../../projects/stoui-core/src/public_api';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

export default {
  title: 'core/Directives',
  decorators: [
    moduleMetadata({
      imports: [ BrowserAnimationsModule, CommonModule, StoDirectivesModule, MatCardModule, MatMenuModule, MatButtonModule ],
    })
  ]
} as Meta;

const Template: Story<any> = (args) => {
  return {
    props: args,
    template: args.template()
  };
};


export const StoGrid = Template.bind({});
StoGrid.args = {
  template: () => `<mat-card class="sto-card">
<div style="background: white;" stoGrid [maxWidth]="1000" [breakpoints]="breakpoints">
<div stoGridColumn style="background: lightblue;">1 (col)</div>
<div stoGridColumn style="background: lightblue;">2 (col)</div>
<div stoGridColumn style="background: lightblue;">3 (col)</div>
<div stoGridColumn style="background: lightblue;">4 (col)</div>
<div stoGridColumn style="background: lightblue;">5 (col)</div>
<div stoGridColumn style="background: lightblue;">6 (col)</div>
<div stoGridColumn [stoGridColumnDouble]="true" style="background: lightblue;">7 (double col)</div>
<div stoGridColumn [stoGridColumnDouble]="true" style="background: lightblue;">8 (double col)</div>
<div stoGridColumn [stoGridColumnDouble]="true" stoGridSpacer>9 (double spacer, hidden on 2-col)</div>
<div stoGridColumn [stoGridColumnDouble]="true" style="background: lightblue;">10 (double col)</div>
<div stoGridColumn style="background: lightblue;">11 (col)</div>
<div stoGridColumn stoGridSpacer>12 (spacer, hidden on 1-col)</div>
<div stoGridColumn style="background: transparent;" class="sto-form"></div>
<div stoGridColumn stoGridSpacer style="background: lightblue;">13 (col spacer, hidden on 1-col grid)</div>
<div stoGridColumn stoGridSpacer style="background: lightblue;" [stoGridColumnDouble]="true" >14 (double spacer, hidden on 2-col)</div>
</div>
</mat-card>`
};

export const StoMenu = Template.bind({});
StoMenu.args = {
  closed: action('Menu closed'),
  log: action('Active menu info'),
  template: () => `<mat-card>
  <button
#overlay="stoMenuOverlay"
[matMenuTriggerRestoreFocus]="false"
(menuClosed)="closed()"
mat-button stoMenuOverlay #trigger="matMenuTrigger" [matMenuTriggerFor]="menu">Menu trigger button</button>
<br>
<br>
<p>
  Active Menu Index {{ activeMenuInfo }}
</p>
<br>
<br>
<div style="width: 500px; display: flex; justify-content: space-between">
<span [menuContext]="{index: 0}" [overlayDirective]="overlay" [menuTrigger]="trigger" stoContextMenu>Context 0</span>
<span [menuContext]="{index: 1}" [overlayDirective]="overlay" [menuTrigger]="trigger" stoContextMenu>Context 1</span>
<span [menuContext]="{index: 2}" [overlayDirective]="overlay" [menuTrigger]="trigger" stoContextMenu>Context 2</span>
<span [menuContext]="{index: 3}" [overlayDirective]="overlay" [menuTrigger]="trigger" stoContextMenu>Context 3</span>
</div>

<mat-menu [backdropClass]="'backdrop-remove'" [hasBackdrop]="false" #menu="matMenu">
  <ng-template matMenuContent let-index="index">
    <button mat-menu-item (click)="activeMenuInfo = index; log('index', index, $event)">Index {{ index }}</button>
    <button mat-menu-item (click)="activeMenuInfo = index; log(1, $event)">Item 1</button>
    <button mat-menu-item (click)="activeMenuInfo = index; log(2, $event)">Item 2</button>
  </ng-template>
</mat-menu>
</mat-card>`
};
