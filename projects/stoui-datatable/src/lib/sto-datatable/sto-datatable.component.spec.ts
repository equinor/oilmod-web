import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy, Component, DebugElement, TemplateRef, ViewChild } from '@angular/core';
import { StoDatatableComponent } from './sto-datatable.component';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { StoDatatableBodyComponent } from './sto-datatable-body/sto-datatable-body.component';
import { ExecPipe } from './exec.pipe';
import { StoDatatableBodyRowComponent } from './sto-datatable-body/sto-datatable-body-row/sto-datatable-body-row.component';
import { columns, rows } from '../../testing/utils';
import { SelectionModes } from './selection-modes';
import { MaterialModule } from '@testing/material.module';
import { StoDatatableHeaderComponent } from './sto-datatable-header/sto-datatable-header.component';
import { StoDatatableHeaderGroupComponent } from './sto-datatable-header-group/sto-datatable-header-group.component';

let comp: StoDatatableComponent;
let fixture: ComponentFixture<StoDatatableComponent>;
let wrapFixture: ComponentFixture<WrapperComponent>;
let wrapperComp: WrapperComponent;
let page: Page;

@Component({
  selector: 'sto-wrap',
  template: `
    <div [style.width.px]="width">
      <sto-datatable [rows]="rows"
                     [columns]="columns"
                     [responsive]="true"
                     [responsiveView]="responsiveTmpl"
                     [rowHeight]="36"
                     [headerHeight]="36"
                     [height]="500"></sto-datatable>
      <ng-template #responsiveTmpl
                   let-row="row">{{ row | json }}</ng-template>
    </div>
  `
})
class WrapperComponent {
  @ViewChild('responsiveTmpl', { static: true })
  responsiveTmpl: TemplateRef<any>;
  public width = 1000;
  public columns: any;
  public rows: any;
}

describe('StoDatatableComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
          CommonModule,
          ScrollingModule,
          MaterialModule
        ],
        declarations: [
          StoDatatableComponent
          , StoDatatableBodyComponent
          , ExecPipe
          , StoDatatableBodyRowComponent
          , StoDatatableHeaderComponent
          , StoDatatableHeaderGroupComponent
        ],
      })
      .overrideComponent(StoDatatableComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents()
      .then(createComponent);
  }));

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should render a table', () => {
    expect(page.body).toBeTruthy();
    expect(page.body.rows.length).toEqual(rows.length);
  });

  it('should scroll to a given element', () => {
    page.scroller.checkViewportSize();
    fixture.detectChanges();
    const scrollToIndex = 50;
    const scrollTo = rows[ scrollToIndex ];
    let range = page.scroller.getRenderedRange();
    expect(scrollToIndex).toBeGreaterThan(range.end);
    comp.scrollTo(scrollTo, 'auto');
    // Update scroller - normally Angular takes care of this via regular change detection
    page.scroller.checkViewportSize();
    fixture.detectChanges();
    range = page.scroller.getRenderedRange();
    expect(scrollToIndex).toBeLessThan(range.end);
    expect(scrollToIndex).toBeGreaterThan(range.start);
    comp.scrollTo(0, 'auto');
  });

  it('should emit a select event when a row is clicked', fakeAsync(() => {
    spyOn(comp.select, 'emit');
    const firstRow = page.rowElements[ 0 ];
    const event = new Event('click');
    firstRow.dispatchEvent(event);
    const expected = {
      row: rows[ 0 ],
      event,
      index: 0,
      rowEl: firstRow
    };
    tick(50);
    expect(comp.select.emit).toHaveBeenCalledWith(expected);
  }));

  it('should emit on dblclick if configured, but not on single click', fakeAsync(() => {
    comp.selectionMode = SelectionModes.DoubleClick;
    fixture.detectChanges();

    spyOn(comp.select, 'emit');
    const firstRow = page.rowElements[ 0 ];
    const clickEvent = new Event('click');
    firstRow.dispatchEvent(clickEvent);
    expect(comp.select.emit).toHaveBeenCalledTimes(0);
    const event = new Event('dblclick');
    firstRow.dispatchEvent(event);
    const expected = {
      row: rows[ 0 ],
      event,
      index: 0,
      rowEl: firstRow
    };
    tick(50);
    expect(comp.select.emit).toHaveBeenCalledWith(expected);
  }));

  it('should emit a contextmenu event when a row is right clicked', fakeAsync(() => {
    spyOn(comp.rowContextMenu, 'emit');
    const firstRow = page.rowElements[ 0 ];
    const firstCell = firstRow.querySelector('.sto-mdl-table__body__row__cell');
    const event = new Event('contextmenu');
    firstCell.dispatchEvent(event);
    const expected = {
      row: rows[ 0 ],
      event,
      index: 0,
      column: comp.columns[ 0 ]
    };
    tick(50);
    expect(comp.rowContextMenu.emit).toHaveBeenCalledWith(expected);
  }));

  it('should sort when the header emits', () => {
    comp.sortable = true;
    fixture.detectChanges();
    const first = comp.rows[ 0 ];
    expect(comp.rows.indexOf(first)).toEqual(0);
    page.header.sortByColumn(comp.columns[ 0 ]);
    expect(comp.rows.indexOf(first)).toBeGreaterThan(0);
  });

  it('should not mutate the original rows when sorting', () => {
    comp.sortable = true;
    fixture.detectChanges();
    const first = comp.rows[ 0 ];
    expect(comp.rows.indexOf(first)).toEqual(0);
    expect(comp[ '_rows' ].indexOf(first)).toEqual(0);
    page.header.sortByColumn(comp.columns[ 0 ]);
    expect(comp.rows.indexOf(first)).toBeGreaterThan(0);
    expect(comp[ '_rows' ].indexOf(first)).toEqual(0);
  });

  it('should reset sort when new rows are passed in', () => {
    comp.sortable = true;
    fixture.detectChanges();
    const first = comp.rows[ 0 ];
    expect(comp.rows.indexOf(first)).toEqual(0);
    page.header.sortByColumn(comp.columns[ 0 ]);
    expect(comp.rows.indexOf(first)).toBeGreaterThan(0);
    comp.rows = [ ...rows ];
    expect(comp.rows.indexOf(first)).toEqual(0);
  });

});

function createComponent() {
  fixture = TestBed.createComponent(StoDatatableComponent);
  comp = fixture.componentInstance;
  comp.columns = columns;
  comp.rows = rows;
  comp.rowHeight = 36;
  comp.headerHeight = 36;
  comp.height = 500;

  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page = new Page(fixture);
  });
}

describe('StoDatatableComponent with automatic height', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
          CommonModule,
          ScrollingModule,
          MaterialModule
        ],
        declarations: [
          StoDatatableComponent
          , StoDatatableBodyComponent
          , ExecPipe
          , StoDatatableBodyRowComponent
          , StoDatatableHeaderComponent
          , StoDatatableHeaderGroupComponent
        ],
      })
      .overrideComponent(StoDatatableComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents()
      .then(createAutosizeComponent);
  }));

  it('should create', () => {
    page.scroller.checkViewportSize();
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  });

  it('should update an offset', fakeAsync(() => {
    page.scroller.checkViewportSize();
    fixture.detectChanges();
    const origHeight = page.scroller.getViewportSize();
    comp.autoSizeOffset = 300;
    window.dispatchEvent(new Event('resize'));
    tick(100);
    fixture.detectChanges();
    // Wait for table to finish repaint
    page.scroller.checkViewportSize();
    fixture.detectChanges();
    const updatedHeight = page.scroller.getViewportSize();
    expect(updatedHeight).toBeLessThan(origHeight);
    expect(comp).toBeTruthy();
  }));

});

function createAutosizeComponent() {
  fixture = TestBed.createComponent(StoDatatableComponent);
  comp = fixture.componentInstance;
  comp.columns = columns;
  comp.rows = rows;
  comp.rowHeight = 36;
  comp.headerHeight = 36;
  comp.autoSize = true;

  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page = new Page(fixture);
  });
}

describe('StoDatatableComponent with responsive template height', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
          CommonModule,
          ScrollingModule,
          MaterialModule
        ],
        declarations: [
          StoDatatableComponent
          , StoDatatableBodyComponent
          , ExecPipe
          , StoDatatableBodyRowComponent
          , WrapperComponent
          , StoDatatableHeaderComponent
          , StoDatatableHeaderGroupComponent
        ],
      })
      .compileComponents()
      .then(createResponsiveComponent);
  }));

  it('should show as a responsive view when container width is below 400px', (done: DoneFn) => {
    wrapperComp.width = 350;
    wrapFixture.detectChanges();
    setTimeout(() => {
      const r = document.querySelectorAll('.sto-mdl-table__body__row--compressed');
      // const r = wrapFixture.debugElement.queryAll(By.css('.sto-mdl-table__body__row--compressed'));
      expect(r.length).toBeGreaterThan(1);
      done();
    }, 50);
  });

});

function createResponsiveComponent() {
  wrapFixture = TestBed.createComponent(WrapperComponent);
  wrapperComp = wrapFixture.componentInstance;
  wrapperComp.rows = rows;
  wrapperComp.columns = columns;
  wrapperComp.width = 1000;

  wrapFixture.detectChanges();

  return wrapFixture.whenStable().then(() => {
    wrapFixture.detectChanges();
    page = new Page(wrapFixture);
  });
}

class Page {
  public body: StoDatatableBodyComponent;
  public header: StoDatatableHeaderComponent;
  public scroller: CdkVirtualScrollViewport;
  public rowElements: HTMLElement[];

  constructor(compFixture: ComponentFixture<StoDatatableComponent | WrapperComponent>) {
    let tableDebugElement: DebugElement;
    if ( compFixture.componentInstance instanceof StoDatatableComponent ) {
      tableDebugElement = compFixture.debugElement;
    } else {
      tableDebugElement = compFixture.debugElement.query(By.directive(StoDatatableComponent));
    }
    const bodyDe = tableDebugElement.query(By.directive(StoDatatableBodyComponent));
    this.body = bodyDe.componentInstance;
    const rowDeElements = bodyDe.queryAll(By.directive(StoDatatableBodyRowComponent));
    this.rowElements = rowDeElements.map(el => el.nativeElement);
    this.scroller = this.body.vScroller;
    const headerDe = tableDebugElement.query(By.directive(StoDatatableHeaderComponent));
    this.header = headerDe.componentInstance;
  }
}
