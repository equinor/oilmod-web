import { Component } from '@angular/core';
import { DomHandler } from '../../../vendor/primeface/components/dom/domhandler';
import { MenubarSub } from '../../../vendor/primeface/components/menubar/menubar';


@Component({
    selector: 'sto-menubarSub',
    templateUrl: 'sto-menubar-sub.component.html',
    providers: [DomHandler]
})
export class StoMenubarSubComponent extends MenubarSub {
    constructor(public domHandler: DomHandler) {
        super(domHandler);
    }

}
