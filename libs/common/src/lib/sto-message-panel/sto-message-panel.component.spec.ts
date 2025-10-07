import { ChangeDetectionStrategy, ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoMessagePanelComponent } from './sto-message-panel.component';

let comp: StoMessagePanelComponent;
let fixture: ComponentFixture<StoMessagePanelComponent>;
let compRef: ComponentRef<StoMessagePanelComponent>;
let page: Page;

describe('StoMessagePanelComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [StoMessagePanelComponent, NoopAnimationsModule],
      declarations: [],
    })
      .overrideComponent(StoMessagePanelComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents()
      .then(createComponent);
  }));

  it('should render', () => {
    // Testing anything else in this component does not make sense as it is just a visual component
    // and contains no logic.
    expect(fixture).toBeTruthy();
    expect(comp).toBeTruthy();
    expect(compRef).toBeTruthy();
  });
});

function createComponent() {
  fixture = TestBed.createComponent(StoMessagePanelComponent);
  comp = fixture.componentInstance;
  compRef = fixture.componentRef;

  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page = new Page();
  });
}

class Page {
  constructor() {}
}
