import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoActionFooterComponent } from './sto-action-footer.component';

let comp: StoActionFooterComponent;
let fixture: ComponentFixture<StoActionFooterComponent>;
let wrapFixture: ComponentFixture<WrapperComponent>;
let page: Page;

@Component({
    selector: 'sto-wrap-action-footer',
    template: '<sto-action-footer><button mat-button>Save</button></sto-action-footer>',
    imports: [MatButtonModule,
        StoActionFooterComponent]
})
class WrapperComponent {}

describe('StoActionFooterComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        MatButtonModule,
        StoActionFooterComponent,
        NoopAnimationsModule,
        WrapperComponent,
    ],
})
      .overrideComponent(StoActionFooterComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents()
      .then(createComponent);
  }));

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should have a loading indicator', () => {
    comp.isLoading = true;
    fixture.changeDetectorRef.detectChanges();
    fixture.detectChanges();
    const de = fixture.debugElement.query(By.directive(MatProgressBar));
    const el = de.nativeElement;
    expect(el).toBeTruthy();
  });

  it('should project contents', () => {
    const btnDe = wrapFixture.debugElement.query(By.directive(MatButton));
    const el = btnDe.nativeElement;
    expect(el).toBeTruthy();
  });
});

function createComponent() {
  fixture = TestBed.createComponent(StoActionFooterComponent);
  wrapFixture = TestBed.createComponent(WrapperComponent);
  comp = fixture.componentInstance;

  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page = new Page();
  });
}

class Page {
  constructor() {}
}
