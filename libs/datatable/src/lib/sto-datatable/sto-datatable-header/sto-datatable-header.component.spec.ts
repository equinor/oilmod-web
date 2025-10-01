import { ChangeDetectionStrategy, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatSortModule } from '@angular/material/sort';
import { By } from '@angular/platform-browser';
import { columns } from '../../../testing/utils';
import { ColumnStylePipe } from '../column-style.pipe';
import { ExecPipe } from '../exec.pipe';
import { GetGroupFlexPipe } from '../get-group-flex.pipe';
import { StoDatatableHeaderComponent } from './sto-datatable-header.component';
import { StoDatatableResizeDirective } from './sto-datatable-resize.directive';

let comp: StoDatatableHeaderComponent<unknown>;
let fixture: ComponentFixture<StoDatatableHeaderComponent<unknown>>;
let page: Page;

describe('StoDatatableHeaderComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MatSortModule,
        StoDatatableHeaderComponent,
        ExecPipe,
        StoDatatableResizeDirective,
        ColumnStylePipe,
        GetGroupFlexPipe,
      ],
    })
      .overrideComponent(StoDatatableHeaderComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents()
      .then(createComponent);
  }));

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should emit sort when cell is clicked', () => {
    jest.spyOn(comp.sort, 'emit');
    page.firstCell.click();
    fixture.detectChanges();
    expect(comp.sort.emit).toHaveBeenCalled();
  });

  it('should render all columns', () => {
    expect(page.renderedCells).toEqual(columns.length);
  });

  it('should emit headerContextMenu when context menu is triggered', () => {
    jest.spyOn(comp.headerContextMenu, 'emit');
    const ev = new Event('contextmenu');
    page.firstCell.dispatchEvent(ev);
    fixture.detectChanges();
    expect(comp.headerContextMenu.emit).toHaveBeenCalled();
  });
});

function createComponent() {
  fixture = TestBed.createComponent(StoDatatableHeaderComponent);
  comp = fixture.componentInstance;
  const compRef = fixture.componentRef;
  compRef.setInput('columns', columns);
  compRef.setInput('sortable', true);
  compRef.setInput('headerHeight', 36);

  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    const cells = fixture.debugElement.queryAll(
      By.css('.sto-mdl-table__header__row__cell'),
    );
    page = new Page(cells);
  });
}

class Page {
  public firstCell: HTMLDivElement;
  public renderedCells: number;

  constructor(cells: DebugElement[]) {
    const first = cells[0];
    this.firstCell = first.nativeElement;
    this.renderedCells = cells.length;
  }
}
