import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialModule } from '@testing/material.module.ts';
import { StoDatatableBodyComponent } from './sto-datatable-body.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { StoDatatableBodyRowComponent } from './sto-datatable-body-row/sto-datatable-body-row.component';
import { ExecPipe } from '../exec.pipe';
import { columns, rows } from '../../../testing/utils';
import { SelectionModes } from '../selection-modes';

let comp: StoDatatableBodyComponent;
let fixture: ComponentFixture<StoDatatableBodyComponent>;
let wrapFixture: ComponentFixture<WrapperComponent>;
let page: Page;

@Component({
  selector: 'sto-spec-wrap',
  template: ''
})
class WrapperComponent {
}

describe('StoDatatableBodyComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [ CommonModule, MaterialModule, ScrollingModule ],
        declarations: [ StoDatatableBodyComponent, StoDatatableBodyRowComponent, WrapperComponent, ExecPipe ]
      })
      .overrideComponent(StoDatatableBodyComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents()
      .then(createComponent);
  }));

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should emit selection on row click', fakeAsync(() => {
    spyOn(comp.rowSelected, 'emit');
    const event = new Event('click') as MouseEvent;
    page.rowEls[ 0 ].dispatchEvent(event);
    fixture.detectChanges();
    const expected = {
      row: comp.rows[ 0 ],
      rowEl: page.rowEls[ 0 ] as HTMLDivElement,
      event,
      index: 0
    };
    comp.selectRow(event, expected);
    tick(50);
    expect(comp.rowSelected.emit).toHaveBeenCalledWith(expected);
  }));

  it('should emit activation on keydown events', () => {
    spyOn(comp.activate, 'emit');
    const event = new Event('keydown') as KeyboardEvent;
    ( <any>event ).key = 'B';
    const rowEl = page.rowEls[ 0 ];
    const expected = {
      event,
      rowEl,
      row: comp.rows[ 0 ],
      index: 0
    };
    rowEl.dispatchEvent(event);
    fixture.detectChanges();
    expect(comp.activate.emit).toHaveBeenCalledWith(expected);
  });

});

function createComponent() {
  fixture = TestBed
    .createComponent(StoDatatableBodyComponent);
  // wrapFixture = TestBed.createComponent(WrapperComponent);
  comp = fixture.componentInstance;
  comp.rows = rows;
  comp.columns = columns;
  comp.height = 500;
  comp.rowHeight = 36;
  comp.virtualScroll = true;
  comp.selectionMode = SelectionModes.Click;

  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page = new Page();
  });
}

class Page {
  public rowEls: HTMLElement[];

  constructor() {
    const rowsDe = fixture.debugElement.queryAll(By.directive(StoDatatableBodyRowComponent));
    this.rowEls = rowsDe.map(rowDe => rowDe.nativeElement);
  }
}
