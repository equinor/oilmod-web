import { Component, ContentChildren, ElementRef, NgModule, QueryList, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabView } from '../../vendor/primeface/components/tabview/tabview';
import { StoTabViewNav } from './sto-tabview-nav/sto-tabview-nav.component';
import { StoTabPanel } from '../../components/sto-tabview/sto-tabpanel/sto-tabpanel.component';

@Component({
  selector: 'sto-tabView',
  styleUrls: ['sto-tabview.component.scss'],
  templateUrl: 'sto-tabview.component.html',
  encapsulation: ViewEncapsulation.None
})
export class StoTabView extends TabView {
  @ContentChildren(StoTabPanel) tabPanels: QueryList<StoTabPanel>;

  constructor(public el: ElementRef) {
    super(el);
  }
}


@NgModule({
  imports: [CommonModule],
  exports: [StoTabView, StoTabPanel, StoTabViewNav],
  declarations: [StoTabView, StoTabPanel, StoTabViewNav]
})
export class StoTabViewModule {
}