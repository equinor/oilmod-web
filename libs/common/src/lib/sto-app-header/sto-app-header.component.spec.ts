import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { breadCrumbs } from '../../test-utils';
import { StoBreadcrumbsComponent } from '../sto-breadcrumbs/sto-breadcrumbs.component';
import { StoAppHeaderComponent } from './sto-app-header.component';

let comp: StoAppHeaderComponent;
let fixture: ComponentFixture<StoAppHeaderComponent>;
// let wrapFixture: ComponentFixture<WrapperComponent>;
let page: Page;

describe('StoAppHeaderComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoAppHeaderComponent,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
    })
      .overrideComponent(StoAppHeaderComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents()
      .then(createComponent);
  }));

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should render breadcrumbs', () => {
    const debugEl = fixture.debugElement.query(
      By.directive(StoBreadcrumbsComponent),
    );
    const bcComp = debugEl.componentInstance;
    expect(bcComp).toBeTruthy();
  });

  it('should get outlined if test environment is true and show env name', () => {
    fixture.componentRef.setInput('testEnvironment', true);
    fixture.componentRef.setInput('environmentName', 'Test Env');
    fixture.detectChanges();
    const envNameDe = fixture.debugElement.query(
      By.css('.sto-header__environment--label'),
    );
    const envNameEl = envNameDe.nativeElement as HTMLElement;
    expect(envNameEl).toBeTruthy();
    expect(envNameEl.textContent?.trim()).toEqual('Test Env'); // jest uses jsdom, so no layout engine
    expect(
      page.nativeEl.classList.contains('sto-header--test-environment'),
    ).toBeTruthy();
  });
});

function createComponent() {
  fixture = TestBed.createComponent(StoAppHeaderComponent);
  comp = fixture.componentInstance;
  fixture.componentRef.setInput('homeBreadCrumbConfig', {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    command: () => {},
  });
  fixture.componentRef.setInput('breadCrumbs', breadCrumbs);

  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page = new Page();
  });
}

class Page {
  public nativeEl: HTMLDivElement;

  constructor() {
    const debugEl = fixture.debugElement.query(By.css('.sto-header'));
    this.nativeEl = debugEl.nativeElement;
  }
}
