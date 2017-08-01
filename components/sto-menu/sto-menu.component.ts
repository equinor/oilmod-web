import { Component, ElementRef, EventEmitter, NgModule, Renderer, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { Menu } from '../../vendor/primeface/components/menu/menu';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';

@Component({
    selector: 'sto-menu',
    templateUrl: 'sto-menu.component.html',
    styleUrls : ['sto-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DomHandler],
    host: {'(window:resize)': 'onResize($event)'}
})
export class StoMenuComponent extends Menu {

    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer) {
        super(el, domHandler, renderer);
    }

}

@NgModule({
    imports: [CommonModule, RouterModule],
    exports: [StoMenuComponent, RouterModule],
    declarations: [StoMenuComponent]
})
export class StoMenuModule {
}