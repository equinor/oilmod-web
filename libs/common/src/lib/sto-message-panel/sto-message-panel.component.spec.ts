import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { MaterialModule } from '@ngx-stoui/testing';
import { StoMessagePanelComponent } from './sto-message-panel.component';

let comp: StoMessagePanelComponent;
let fixture: ComponentFixture<StoMessagePanelComponent>;
let page: Page;

describe('StoMessagePanelComponent', () => {

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [ CommonModule, MaterialModule ],
        declarations: [ StoMessagePanelComponent ]
      })
      .overrideComponent(StoMessagePanelComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents()
      .then(createComponent);
  }));

  it('should default to info', () => {
    expect(comp.info).toBeTruthy();
  });

  it('should get a warning state', () => {
    comp.severity = 'warning';
    fixture.detectChanges();
    expect(comp.warning).toBeTruthy();
  });

  it('should get a error state', () => {
    comp.severity = 'error';
    fixture.detectChanges();
    expect(comp.error).toBeTruthy();
  });

  it('should get a info state', () => {
    comp.severity = 'info';
    fixture.detectChanges();
    expect(comp.info).toBeTruthy();
  });

});

function createComponent() {
  fixture = TestBed
    .createComponent(StoMessagePanelComponent);
  comp = fixture.componentInstance;

  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page = new Page();
  });
}

class Page {
  constructor() {
  }
}
