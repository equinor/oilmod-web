import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TabMenu } from '../../vendor/primeface/components/tabmenu/tabmenu';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';

@Component({
    selector: 'sto-tabmenu',
    templateUrl: 'sto-tabmenu.component.html',
    styleUrls: ['sto-tabmenu.component.scss'],
    providers: [DomHandler]
})
export class StoTabMenuComponent extends TabMenu {

}

@NgModule({
    imports: [CommonModule, RouterModule],
    exports: [StoTabMenuComponent, RouterModule],
    declarations: [StoTabMenuComponent]
})
export class StoTabMenuModule {
}
