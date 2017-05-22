import { Component, ContentChildren, NgModule, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabView, TabViewModule } from '../../vendor/primeface/components/tabview/tabview';
import { StoTabViewNav } from './sto-tabview-nav/sto-tabview-nav.component';
import { StoTabPanel } from 'ngx-stoui/components/sto-tabview/sto-tabpanel/sto-tabpanel.component';

@Component({
    selector: 'sto-tabView',
    styleUrls: ['sto-tabview.component.scss'],
    templateUrl: 'sto-tabview.component.html',
})
export class StoTabView extends TabView {
    @ContentChildren(StoTabPanel) tabPanels: QueryList<StoTabPanel>;
}


@NgModule({
    imports: [CommonModule, TabViewModule],
    exports: [StoTabView, StoTabPanel, StoTabViewNav],
    declarations: [StoTabView, StoTabPanel, StoTabViewNav]
})
export class StoTabViewModule {
}