import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy, Component, DebugElement } from '@angular/core';
import { MaterialModule } from '@ngx-stoui/testing';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ExecPipe } from '../exec.pipe';
import { columns } from '../../../testing/utils';
import { StoDatatableHeaderComponent } from './sto-datatable-header.component';
import { StoDatatableResizeDirective } from './sto-datatable-resize.directive';
import { ColumnStylePipe } from '../column-style.pipe';

let comp: StoDatatableHeaderComponent<unknown>;
let fixture: ComponentFixture<StoDatatableHeaderComponent<unknown>>;
let page: Page;

@Component({
  selector: 'sto-spec-wrap',
  template: ''
})
class WrapperComponent {
}

describe('StoDatatableHeaderComponent', () => {

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [ CommonModule, MaterialModule, ScrollingModule ],
        declarations: [ StoDatatableHeaderComponent, WrapperComponent, ExecPipe, StoDatatableResizeDirective, ColumnStylePipe ]
      })
      .overrideComponent(StoDatatableHeaderComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents()
      .then(createComponent);
  }));

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should emit sort when cell is clicked', () => {
    spyOn(comp.sort, 'emit');
    page.firstCell.click();
    fixture.detectChanges();
    expect(comp.sort.emit).toHaveBeenCalled();
  });

  it('should render all columns', () => {
    expect(page.renderedCells).toEqual(columns.length);
  });

  it('should emit headerContextMenu when context menu is triggered', () => {
    spyOn(comp.headerContextMenu, 'emit');
    const ev = new Event('contextmenu');
    page.firstCell.dispatchEvent(ev);
    fixture.detectChanges();
    expect(comp.headerContextMenu.emit).toHaveBeenCalled();
  });

});

function createComponent() {
  fixture = TestBed
    .createComponent(StoDatatableHeaderComponent);
  comp = fixture.componentInstance;
  comp.columns = columns;
  comp.sortable = true;
  comp.headerHeight = 36;

  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    const cells = fixture.debugElement.queryAll(By.css('.sto-mdl-table__header__row__cell'));
    page = new Page(cells);
  });
}

class Page {
  public firstCell: HTMLDivElement;
  public renderedCells: number;

  constructor(cells: DebugElement[]) {
    const first = cells[ 0 ];
    this.firstCell = first.nativeElement;
    this.renderedCells = cells.length;
  }
}
