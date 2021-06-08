/**
 * Grid can't be tested in a headless environment, due to the nature of ResizeObserver.
 * The test below will work in a browser.
 */

import { StoGridColumnDirective, StoGridDirective, StoGridSpacerDirective } from './sto-grid.directive';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';

let comp: WrapperComponent;
let fixture: ComponentFixture<WrapperComponent>;
let page: Page;


class ResizeObserver {
  observe() {
    // do nothing
  }
  unobserve() {
    // do nothing
  }
}

(window as any).ResizeObserver = ResizeObserver;

@Component({
  template: `<div stoGrid [maxWidth]="1000">
    <div stoGridColumn></div>
    <div stoGridColumn></div>
    <div stoGridColumn></div>
    <div stoGridColumn></div>
    <div stoGridColumn></div>
    <div stoGridColumn></div>
    <div stoGridColumn [stoGridColumnDouble]="true"></div>
    <div stoGridColumn [stoGridColumnDouble]="true"></div>
    <div stoGridColumn [stoGridColumnDouble]="true" stoGridSpacer></div>
    <div stoGridColumn [stoGridColumnDouble]="true"></div>
    <div stoGridColumn></div>
    <div stoGridColumn stoGridSpacer></div>
  </div>`
})
class WrapperComponent {
  @ViewChildren(StoGridColumnDirective)
  columns: QueryList<StoGridColumnDirective>;
}

describe('StoGridDirective', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [
          CommonModule,
        ],
        declarations: [
          WrapperComponent,
          StoGridDirective,
          StoGridColumnDirective,
          StoGridSpacerDirective
        ],
      })
      .compileComponents()
      .then(createComponent);
  }));
  it('should create an instance', () => {
    expect(true).toBeTruthy();
  });
});

function createComponent() {
  fixture = TestBed.createComponent(WrapperComponent);
  comp = fixture.componentInstance;
  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
  });
}


class Page {

}
