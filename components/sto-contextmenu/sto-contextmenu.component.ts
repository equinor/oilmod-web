import { Component, ElementRef, forwardRef, Inject, NgModule, Renderer } from '@angular/core';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContextMenu, ContextMenuSub } from '../../vendor/primeface/components/contextmenu/contextmenu';

@Component({
  selector: 'sto-contextMenuSub',
  template: `
	  <ul [ngClass]="{'ui-helper-reset':root, 'ui-widget-content ui-corner-all ui-helper-clearfix ui-menu-child ui-shadow':!root}" class="ui-menu-list"
		  (click)="listClick($event)">
		  <ng-template ngFor let-child [ngForOf]="(root ? item : item.items)">
			  <li #item [ngClass]="{'ui-menuitem ui-widget ui-corner-all':true,'ui-menu-parent':child.items,'ui-menuitem-active':item==activeItem}"
				  (mouseenter)="onItemMouseEnter($event,item,child)" (mouseleave)="onItemMouseLeave($event,item)">
				  <a *ngIf="!child.routerLink" [href]="child.url||'#'" class="ui-menuitem-link ui-corner-all" [attr.target]="child.target"
					 [ngClass]="{'ui-state-disabled':child.disabled}" (click)="itemClick($event, child)">
					  <span class="ui-submenu-icon fa fa-fw fa-caret-right" *ngIf="child.items"></span>
					  <span class="ui-menuitem-icon fa fa-fw" *ngIf="child.icon" [ngClass]="child.icon"></span>
					  <span class="ui-menuitem-text">{{child.label}}</span>
				  </a>
				  <a *ngIf="child.routerLink" [routerLink]="child.routerLink" [routerLinkActive]="'ui-state-active'" class="ui-menuitem-link ui-corner-all" [attr.target]="child.target"
					 [ngClass]="{'ui-state-disabled':child.disabled}" (click)="itemClick($event, child)">
					  <span class="ui-submenu-icon fa fa-fw fa-caret-right" *ngIf="child.items"></span>
					  <span class="ui-menuitem-icon fa fa-fw" *ngIf="child.icon" [ngClass]="child.icon"></span>
					  <span class="ui-menuitem-text">{{child.label}}</span>
				  </a>
				  <sto-contextMenuSub class="ui-submenu" [item]="child" *ngIf="child.items"></sto-contextMenuSub>
			  </li>
		  </ng-template>
	  </ul>
  `,
  providers: [DomHandler]
})
export class StoContextMenuSubComponent extends ContextMenuSub {
  constructor(public domHandler: DomHandler, @Inject(forwardRef(() => StoContextMenuComponent)) public contextMenu: StoContextMenuComponent) {
    super(domHandler, contextMenu);
  }
}

@Component({
  selector: 'sto-contextMenu',
  template: `
	  <div #container [ngClass]="'ui-contextmenu ui-menu ui-widget ui-widget-content ui-corner-all ui-helper-clearfix ui-menu-dynamic ui-shadow'"
		   [class]="styleClass" [ngStyle]="style" [style.display]="visible ? 'block' : 'none'">
		  <sto-contextMenuSub [item]="model" root="root"></sto-contextMenuSub>
	  </div>
  `,
  styleUrls: ['../sto-menu/sto-menu.component.scss'],
  providers: [DomHandler]
})
export class StoContextMenuComponent extends ContextMenu {
  constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer) {
    super(el, domHandler, renderer);
  }
}

@NgModule({
  imports: [CommonModule,RouterModule],
  exports: [StoContextMenuComponent, RouterModule],
  declarations: [StoContextMenuComponent,StoContextMenuSubComponent]
})
export class StoContextMenuModule { }