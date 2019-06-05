import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialModule } from '@testing/material.module.ts';
import { StoAppHeaderComponent } from './sto-app-header.component';
import { StoBreadcrumbsComponent } from '../sto-breadcrumbs/sto-breadcrumbs.component';
import { RouterTestingModule } from '@angular/router/testing';
import { breadCrumbs } from '../../test-utils';
import { StoBreadcrumbsModule } from '../sto-breadcrumbs/sto-breadcrumbs.module';

let comp: StoAppHeaderComponent;
let fixture: ComponentFixture<StoAppHeaderComponent>;
// let wrapFixture: ComponentFixture<WrapperComponent>;
let page: Page;

@Component({
  selector: 'sto-spec-wrap',
  template: ''
})
class WrapperComponent {
}

describe('StoAppHeaderComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [ CommonModule, MaterialModule, StoBreadcrumbsModule, RouterTestingModule ],
        declarations: [ StoAppHeaderComponent, WrapperComponent ]
      })
      .overrideComponent(StoAppHeaderComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents()
      .then(createComponent);
  }));

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should render breadcrumbs', () => {
    const debugEl = fixture.debugElement.query(By.directive(StoBreadcrumbsComponent));
    const bcComp = debugEl.componentInstance;
    expect(bcComp).toBeTruthy();
  });

  it('should get outlined if test environment is true and show env name uppercased', () => {
    comp.testEnvironment = true;
    comp.environmentName = 'Test Env';
    fixture.detectChanges();
    const envNameDe = fixture.debugElement.query(By.css('.sto-header__environment--label'));
    const envNameEl = envNameDe.nativeElement as HTMLElement;
    expect(envNameEl).toBeTruthy();
    expect(envNameEl.innerText).toEqual('TEST ENV');
    expect(page.nativeEl.classList.contains('sto-header--test-environment')).toBeTruthy();
  });

});

function createComponent() {
  fixture = TestBed
    .createComponent(StoAppHeaderComponent);
  comp = fixture.componentInstance;
  comp.homeBreadCrumbConfig = {
    command: () => {
    }
  };
  comp.breadCrumbs = breadCrumbs;

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
