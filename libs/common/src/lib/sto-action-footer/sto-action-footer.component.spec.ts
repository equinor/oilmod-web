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

@Component({
  selector: 'sto-wrap-action-footer',
  template: ` <sto-action-footer>
    <button matButton="filled">Save</button>
  </sto-action-footer>`,
  imports: [MatButtonModule, StoActionFooterComponent],
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

  afterEach(() => {
    // Clean up body class after each test
    document.body.classList.remove('sto-has-action-footer');
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should have a loading indicator when isLoading is true', () => {
    comp.isLoading.set(true);
    fixture.detectChanges();
    const de = fixture.debugElement.query(By.directive(MatProgressBar));
    expect(de).toBeTruthy();
  });

  it('should not show loading indicator when isLoading is false', () => {
    comp.isLoading.set(false);
    fixture.detectChanges();
    const de = fixture.debugElement.query(By.directive(MatProgressBar));
    expect(de).toBeNull();
  });

  it('should project contents', () => {
    const btnDe = wrapFixture.debugElement.query(By.directive(MatButton));
    const el = btnDe.nativeElement;
    expect(el).toBeTruthy();
  });

  it('should add body class when shouldAddClass is true', () => {
    expect(document.body.classList.contains('sto-has-action-footer')).toBe(
      true,
    );
  });

  it('should not add body class when shouldAddClass is false', () => {
    // Clean up existing instance
    fixture.destroy();
    document.body.classList.remove('sto-has-action-footer');

    // Create new instance with shouldAddClass = false
    fixture = TestBed.createComponent(StoActionFooterComponent);
    fixture.componentRef.setInput('shouldAddClass', false);
    fixture.detectChanges();

    expect(document.body.classList.contains('sto-has-action-footer')).toBe(
      false,
    );
  });

  it('should remove body class on destroy when shouldAddClass is true', () => {
    expect(document.body.classList.contains('sto-has-action-footer')).toBe(
      true,
    );
    fixture.destroy();
    expect(document.body.classList.contains('sto-has-action-footer')).toBe(
      false,
    );
  });

  it('should set position style from input', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.style.position).toBe('fixed');

    fixture.componentRef.setInput('position', 'absolute');
    fixture.detectChanges();
    expect(element.style.position).toBe('absolute');
  });

  it('should have sto-action-footer class', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.classList.contains('sto-action-footer')).toBe(true);
  });
});

function createComponent() {
  fixture = TestBed.createComponent(StoActionFooterComponent);
  wrapFixture = TestBed.createComponent(WrapperComponent);
  comp = fixture.componentInstance;

  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
  });
}
