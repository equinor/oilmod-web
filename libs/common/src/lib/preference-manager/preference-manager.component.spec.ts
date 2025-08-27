import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivePreferencePipe } from './active-preference.pipe';
import { Preference } from './preference';
import { PreferenceManagerComponent } from './preference-manager.component';

const preferences: Preference[] = [
  {
    name: 'A filter',
    id: 'uuid',
    identifierKey: 'reports_filter',
    user: 'Bobby B',
    payload: {},
  },
  {
    name: 'Another filter',
    id: 'uuid-2',
    identifierKey: 'reports_filter',
    user: 'Bobby B',
    default: true,
    payload: {},
  },
];

describe('PreferenceManagerComponent', () => {
  let component: PreferenceManagerComponent;
  let fixture: ComponentFixture<PreferenceManagerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        PreferenceManagerComponent,
        ActivePreferencePipe,
        NoopAnimationsModule,
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

  it('should have default value for placeholder which can be changed', waitForAsync(async () => {
    // verify default first
    let buttonDe = fixture.debugElement.query(By.css('button.filter-title'));
    let text = buttonDe.nativeElement.textContent.replace(/\s+/g, ' ').trim();
    expect(text).toContain('No filter selected');
    // use setInput to properly update OnPush component
    fixture.componentRef.setInput('placeholder', 'Test');
    await fixture.whenStable();
    fixture.detectChanges();
    buttonDe = fixture.debugElement.query(By.css('button.filter-title'));
    text = buttonDe.nativeElement.textContent.replace(/\s+/g, ' ').trim();
    expect(text).toContain('Test');
  }));

  // This needs more tests - need to look into how to use ComponentHarnesses from @angular/material
  // https://material.angular.io/components/menu/api#MatMenuHarness

  function createComponents() {
    fixture = TestBed.createComponent(PreferenceManagerComponent);
    component = fixture.componentInstance;
    component.preferences = preferences;

    // detectChanges after potential pre-test state modifications
    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      // Opening the menu in all tests added style/log noise and interfered with a simple placeholder assertion.
      // Tests that need the menu can explicitly invoke openMenu().
    });
  }
});
