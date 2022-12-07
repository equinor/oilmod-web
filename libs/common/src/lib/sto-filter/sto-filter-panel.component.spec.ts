import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  StoFilterActions,
  StoFilterActionsBar,
  StoFilterPanelComponent,
  StoFilterTableActions,
  StoFilterTitle
} from './sto-filter-panel.component';
import { MatLegacyButton as MatButton, MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilterForm, FilterList } from './filter';
import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { MatLegacyChipList as MatChipList, MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';

let comp: StoFilterPanelComponent;
let fixture: ComponentFixture<StoFilterPanelComponent>;
let wrapFixture: ComponentFixture<WrapperComponent>;
let page: Page;

@Component({
  selector: 'sto-spec-wrap',
  template: `
    <div style="background: white">
      <sto-filter-panel [expandable]="true"
                        [filterList]="filter$ | async">
        <sto-filter-title>Filter Title</sto-filter-title>
        <sto-filter-table-actions>
          <button mat-button>
            New
            <mat-icon>add</mat-icon>
          </button>
        </sto-filter-table-actions>
        <sto-filter-actions>
          <button mat-icon-button>
            <mat-icon>refresh</mat-icon>
          </button>
        </sto-filter-actions>
        <div class="sto-form sto-grid sto-grid--6"
             [formGroup]="form">
          <div class="sto-grid__column">
            <input formControlName="field">
          </div>
        </div>
      </sto-filter-panel>
    </div>`
})
class WrapperComponent extends FilterForm<{ field: string }> {
  formConfig = { field: [] };
  serializer: OperatorFunction<{ field: string; }, FilterList[]> = map(val => {
    if ( val.field ) {
      return [ { value: 'Field1 has a value', key: 'field' } ];
    }
    return [];
  });

  constructor(fb: UntypedFormBuilder) {
    super(fb);
  }
}

describe('StoFilterPanelComponent', () => {

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [
          CommonModule
          , BrowserAnimationsModule
          , MatExpansionModule
          , MatIconModule
          , MatButtonModule
          , MatButtonToggleModule
          , MatTooltipModule
          , ReactiveFormsModule
          , MatChipsModule
        ],
        declarations: [
          StoFilterPanelComponent
          , StoFilterTitle
          , StoFilterActions
          , StoFilterActionsBar
          , StoFilterTableActions
          , WrapperComponent
        ]
      })
      .overrideComponent(StoFilterPanelComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents()
      .then(createComponent);
  }));

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should hide when toggle button is closed', () => {
    expect(page.stoFilterPanel.expanded).toBeTruthy();
    page.toggleButton.click();
    wrapFixture.detectChanges();
    expect(page.stoFilterPanel.expanded).toBeFalsy();
  });

  it('should render a mat-button', () => {
    expect(page.newButton).toBeTruthy();
  });

  it('should render chips when value is set, and panel is closed', () => {
    const wrap = wrapFixture.componentInstance;
    wrap.form.get('field')?.setValue('A value!');
    wrapFixture.detectChanges();
    page.stoFilterPanel.expanded = false;
    wrapFixture.detectChanges();
    const chips = wrapFixture.debugElement.query(By.directive(MatChipList));
    expect(chips).toBeDefined();
  });

});

function createComponent() {
  fixture = TestBed
    .createComponent(StoFilterPanelComponent);
  wrapFixture = TestBed.createComponent(WrapperComponent);
  comp = fixture.componentInstance;

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
    const toggleBtnDe = wrapFixture.debugElement.query(By.css('button.toggle-expand-button'));
    this.toggleButton = toggleBtnDe.nativeElement;
    const panelDe = wrapFixture.debugElement.query(By.directive(StoFilterPanelComponent));
    this.stoFilterPanel = panelDe.componentInstance;
    const btnDe = wrapFixture.debugElement.query(By.directive(MatButton));
    this.newButton = btnDe.componentInstance;
  }
}
