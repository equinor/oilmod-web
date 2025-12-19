import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipListbox, MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterForm, FilterList } from './filter';
import {
  StoFilterActions,
  StoFilterActionsBar,
  StoFilterPanelComponent,
  StoFilterTableActions,
  StoFilterTitle,
} from './sto-filter-panel.component';

let comp: StoFilterPanelComponent;
let fixture: ComponentFixture<StoFilterPanelComponent>;
let wrapFixture: ComponentFixture<WrapperComponent>;
let page: Page;

@Component({
  selector: 'sto-spec-wrap',
  template: ` <div style="background: white">
    <sto-filter-panel [expandable]="true" [filterList]="filter$ | async">
      <sto-filter-title>Filter Title</sto-filter-title>
      <sto-filter-table-actions>
        <button matButton="filled">
          New
          <mat-icon>add</mat-icon>
        </button>
      </sto-filter-table-actions>
      <sto-filter-actions>
        <button matIconButton>
          <mat-icon>refresh</mat-icon>
        </button>
      </sto-filter-actions>
      <div class="sto-form sto-grid sto-grid--6" [formGroup]="form">
        <div class="sto-grid__column">
          <input formControlName="field" />
        </div>
      </div>
    </sto-filter-panel>
  </div>`,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatChipsModule,
    StoFilterPanelComponent,
    StoFilterTitle,
    StoFilterTableActions,
    StoFilterActions,
    StoFilterActionsBar,
  ],
})
class WrapperComponent extends FilterForm<{ field: string }> {
  formConfig = { field: [] };
  serializer: OperatorFunction<{ field: string }, FilterList[]> = map((val) => {
    if (val.field) {
      return [{ value: 'Field1 has a value', key: 'field' }];
    }
    return [];
  });
}

describe('StoFilterPanelComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatExpansionModule,
        MatIconModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatTooltipModule,
        ReactiveFormsModule,
        MatChipsModule,
        StoFilterPanelComponent,
        StoFilterTitle,
        StoFilterActions,
        StoFilterActionsBar,
        StoFilterTableActions,
        WrapperComponent,
      ],
    })
      .overrideComponent(StoFilterPanelComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents()
      .then(createComponent);
  }));

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should hide when toggle button is closed', () => {
    // initial state should be expanded (expanded=true)
    expect(page.stoFilterPanel._expanded()).toBeTruthy();
    // close
    page.toggleButton.click();
    wrapFixture.detectChanges();
    expect(page.stoFilterPanel._expanded()).toBeFalsy();
    // open again
    page.toggleButton.click();
    wrapFixture.detectChanges();
    expect(page.stoFilterPanel._expanded()).toBeTruthy();
  });

  it('should render a matButton="filled"', () => {
    expect(page.newButton).toBeTruthy();
  });

  it('should render chips when value is set, and panel is closed', () => {
    const wrap = wrapFixture.componentInstance;
    wrap.form.get('field')?.setValue('A value!');
    wrapFixture.detectChanges();
    page.stoFilterPanel._expanded.set(false);
    wrapFixture.detectChanges();
    const chips = wrapFixture.debugElement.query(By.directive(MatChipListbox));
    expect(chips).toBeDefined();
  });
});

function createComponent() {
  fixture = TestBed.createComponent(StoFilterPanelComponent);
  wrapFixture = TestBed.createComponent(WrapperComponent);
  comp = fixture.componentInstance;
  // Set filterList to empty array to avoid null reference
  fixture.componentRef.setInput('filterList', []);

  fixture.detectChanges();
  wrapFixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    wrapFixture.detectChanges();
    page = new Page();
  });
}

class Page {
  public toggleButton: HTMLButtonElement;
  public stoFilterPanel: StoFilterPanelComponent;
  public newButton: MatButton;

  constructor() {
    const toggleBtnDe = wrapFixture.debugElement.query(
      By.css('button.toggle-expand-button'),
    );
    this.toggleButton = toggleBtnDe.nativeElement;
    const panelDe = wrapFixture.debugElement.query(
      By.directive(StoFilterPanelComponent),
    );
    this.stoFilterPanel = panelDe.componentInstance;
    const btnDe = wrapFixture.debugElement.query(By.directive(MatButton));
    this.newButton = btnDe.componentInstance;
  }
}
