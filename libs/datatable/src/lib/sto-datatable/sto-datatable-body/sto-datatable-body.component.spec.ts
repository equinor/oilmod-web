import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '@ngx-stoui/testing';
import { columns, rows } from '../../../testing/utils';
import { StoRowWidthHelper } from '../../sto-row-width.helper';
import { ColumnStylePipe } from '../column-style.pipe';
import { ExecPipe } from '../exec.pipe';
import { SelectionModesEnum } from '../selection-modes';
import { StoDatatableBodyRowComponent } from './sto-datatable-body-row/sto-datatable-body-row.component';
import { StoDatatableBodyComponent } from './sto-datatable-body.component';

let comp: StoDatatableBodyComponent<object>;
let fixture: ComponentFixture<StoDatatableBodyComponent<object>>;
let wrapFixture: ComponentFixture<WrapperComponent>;
let page: Page;

@Component({
  selector: 'sto-spec-wrap',
  template: '',
  imports: [MaterialModule, ScrollingModule],
})
class WrapperComponent {}

describe('StoDatatableBodyComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MaterialModule,
        ScrollingModule,
        StoDatatableBodyComponent,
        StoDatatableBodyRowComponent,
        WrapperComponent,
        ExecPipe,
        ColumnStylePipe,
      ],
      providers: [StoRowWidthHelper],
    })
      .overrideComponent(StoDatatableBodyComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents()
      .then(createComponent);
  }));

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should emit selection on row click', fakeAsync(() => {
    jest.spyOn(comp.rowSelected, 'emit');
    const event = new Event('click') as MouseEvent;
    page.rowEls[0].dispatchEvent(event);
    fixture.detectChanges();
    const expected = {
      row: comp.rows()[0],
      rowEl: page.rowEls[0] as HTMLDivElement,
      event,
      index: 0,
    };
    comp.selectRow(event, expected);
    tick(50);
    expect(comp.rowSelected.emit).toHaveBeenCalledWith(expected);
  }));

  it('should emit activation on keydown events', () => {
    jest.spyOn(comp.activate, 'emit');
    const event = new Event('keydown') as KeyboardEvent;
    (<any>event).key = 'B';
    const rowEl = page.rowEls[0];
    const expected = {
      event,
      rowEl,
      row: comp.rows()[0],
      index: 0,
    };
    rowEl.dispatchEvent(event);
    fixture.detectChanges();
    expect(comp.activate.emit).toHaveBeenCalledWith(expected);
  });
});

function createComponent() {
  fixture = TestBed.createComponent(StoDatatableBodyComponent);
  // wrapFixture = TestBed.createComponent(WrapperComponent);
  comp = fixture.componentInstance;
  const compRef = fixture.componentRef;
  compRef.setInput('rows', rows);
  compRef.setInput('columns', columns);
  compRef.setInput('height', 500);
  compRef.setInput('rowHeight', 36);
  compRef.setInput('virtualScroll', true);
  compRef.setInput('selectionMode', SelectionModesEnum.Click);

  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page = new Page();
  });
}

class Page {
  public rowEls: HTMLElement[];

  constructor() {
    const rowsDe = fixture.debugElement.queryAll(
      By.directive(StoDatatableBodyRowComponent),
    );
    this.rowEls = rowsDe.map((rowDe) => rowDe.nativeElement);
  }
}
