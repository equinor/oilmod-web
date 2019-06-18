import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

let comp: StoFilterPanelComponent;
let fixture: ComponentFixture<StoFilterPanelComponent>;
let wrapFixture: ComponentFixture<WrapperComponent>;
let page: Page;

@Component({
  selector: 'sto-spec-wrap',
  template: `
    <div style="background: white">
      <sto-filter-panel [expandable]="true">
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
        <form class="sto-form sto-grid sto-grid--6">
          <div class="sto-grid__column">
            Content
          </div>
        </form>
      </sto-filter-panel>
    </div>`
})
class WrapperComponent {
}

describe('StoFilterPanelComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
          CommonModule
          , BrowserAnimationsModule
          , MatExpansionModule
          , MatIconModule
          , MatButtonModule
          , MatButtonToggleModule
          , MatTooltipModule
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
    const toggleBtnDe = wrapFixture.debugElement.query(By.directive(MatButtonToggle));
    this.toggleButton = toggleBtnDe.nativeElement;
    const panelDe = wrapFixture.debugElement.query(By.directive(StoFilterPanelComponent));
    this.stoFilterPanel = panelDe.componentInstance;
    const btnDe = wrapFixture.debugElement.query(By.directive(MatButton));
    this.newButton = btnDe.componentInstance;
  }
}
