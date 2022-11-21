import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreferenceManagerComponent } from './preference-manager.component';
import { ActivePreferencePipe } from './active-preference.pipe';
import { Preference } from './preference';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const preferences: Preference[] = [
  { name: 'A filter', id: 'uuid', identifierKey: 'reports_filter', user: 'Bobby B', payload: {} },
  { name: 'Another filter', id: 'uuid-2', identifierKey: 'reports_filter', user: 'Bobby B', default: true, payload: {} },
];

describe('PreferenceManagerComponent', () => {
  let component: PreferenceManagerComponent;
  let fixture: ComponentFixture<PreferenceManagerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [
          PreferenceManagerComponent, ActivePreferencePipe, NoopAnimationsModule
        ],
      })
      .compileComponents()
      .then(createComponents);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('can handle placeholder being null', () => {
    component.placeholder = null;
    expect(component).toBeTruthy();
  });

  it('should have default value for placeholder which can be changed', () => {
    const debugElementButton = fixture.debugElement.query(By.css('button.filter-title'));
    const buttonEl = debugElementButton.nativeElement;
    expect(component.placeholder).toBe('No filter selected');
    expect(buttonEl.textContent).toContain('No filter selected');
    component.placeholder = 'Test';
    fixture.detectChanges();
    expect(buttonEl.textContent).toContain('Test');
  });

  // This needs more tests - need to look into how to use ComponentHarnesses from @angular/material
  // https://material.angular.io/components/menu/api#MatMenuHarness


  function createComponents() {
    fixture = TestBed.createComponent(PreferenceManagerComponent);
    component = fixture.componentInstance;
    component.preferences = preferences;

    fixture.detectChanges();
    return fixture.whenStable()
      .then(() => {
        component.openMenu();
        fixture.detectChanges();
      });
  }
});
