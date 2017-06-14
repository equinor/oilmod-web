import { Component, ElementRef, NgModule, Renderer, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Menubar } from 'ngx-stoui/vendor/primeface/components/menubar/menubar';
import { DomHandler } from 'ngx-stoui/vendor/primeface/components/dom/domhandler';
import { StoNavbarSubComponent } from './sto-navbar-sub/sto-navbar-sub.component';


@Component({
    selector: 'sto-navbar',
    templateUrl: 'sto-navbar.component.html',
    styleUrls: ['sto-navbar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DomHandler]
})
export class StoNavbarComponent extends Menubar {



    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer) {
        super(el, domHandler, renderer);
    }
}

@NgModule({
    imports: [CommonModule, RouterModule],
    exports: [StoNavbarComponent, StoNavbarSubComponent, RouterModule],
    declarations: [StoNavbarComponent, StoNavbarSubComponent]
})
export class StoNavbarModule {
}
