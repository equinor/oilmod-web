import { Component, ElementRef, NgModule, Renderer, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { Menubar } from '../../vendor/primeface/components/menubar/menubar';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';
import { StoMenubarSubComponent } from './sto-menubar-sto/sto-menubar-sub.component';


@Component({
    selector: 'sto-menubar',
    templateUrl: 'sto-menubar.component.html',
    styleUrls : ['sto-menubar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DomHandler]
})
export class StoMenubarComponent extends Menubar {
    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer) {
        super(el, domHandler, renderer);
    }
}

@NgModule({
    imports: [CommonModule, RouterModule],
    exports: [StoMenubarComponent, StoMenubarSubComponent, RouterModule],
    declarations: [StoMenubarComponent, StoMenubarSubComponent]
})
export class StoMenubarModule {
}