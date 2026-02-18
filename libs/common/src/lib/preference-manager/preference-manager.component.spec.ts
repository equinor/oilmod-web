import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivePreferencePipe } from './active-preference.pipe';
import { Preference, createPreference } from './preference';
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

  it('should display placeholder when no preference is selected', () => {
    const buttonDe = fixture.debugElement.query(By.css('button.filter-title'));
    const text = buttonDe.nativeElement.textContent.replace(/\s+/g, ' ').trim();
    expect(text).toContain('No filter selected');
  });

  it('should update placeholder value via input signal', waitForAsync(async () => {
    // verify default first
    let buttonDe = fixture.debugElement.query(By.css('button.filter-title'));
    let text = buttonDe.nativeElement.textContent.replace(/\s+/g, ' ').trim();
    expect(text).toContain('No filter selected');

    // use setInput to properly update OnPush component with signal inputs
    fixture.componentRef.setInput('placeholder', 'Custom placeholder');
    await fixture.whenStable();
    fixture.detectChanges();

    buttonDe = fixture.debugElement.query(By.css('button.filter-title'));
    text = buttonDe.nativeElement.textContent.replace(/\s+/g, ' ').trim();
    expect(text).toContain('Custom placeholder');
  }));

  it('should display active preference name when activePreferenceId is set', waitForAsync(async () => {
    fixture.componentRef.setInput('preferences', preferences);
    fixture.componentRef.setInput('activePreferenceId', 'uuid');
    await fixture.whenStable();
    fixture.detectChanges();

    const buttonDe = fixture.debugElement.query(By.css('button.filter-title'));
    const text = buttonDe.nativeElement.textContent.replace(/\s+/g, ' ').trim();
    expect(text).toContain('A filter');
  }));

  it('should display placeholder when no activePreferenceId is set', waitForAsync(async () => {
    fixture.componentRef.setInput('preferences', preferences);
    await fixture.whenStable();
    fixture.detectChanges();

    const buttonDe = fixture.debugElement.query(By.css('button.filter-title'));
    const text = buttonDe.nativeElement.textContent.replace(/\s+/g, ' ').trim();
    expect(text).toContain('No filter selected');
  }));

  it('should show (modified) indicator when dirty is true', waitForAsync(async () => {
    fixture.componentRef.setInput('dirty', true);
    await fixture.whenStable();
    fixture.detectChanges();

    const buttonDe = fixture.debugElement.query(By.css('button.filter-title'));
    const text = buttonDe.nativeElement.textContent.replace(/\s+/g, ' ').trim();
    expect(text).toContain('(modified)');
  }));

  it('should show loading indicator when loadingIndicator is true', waitForAsync(async () => {
    fixture.componentRef.setInput('loadingIndicator', true);
    await fixture.whenStable();
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('mat-progress-spinner'));
    expect(spinner).toBeTruthy();
  }));

  it('should initialize signal state to null', () => {
    expect(component.editIndex()).toBeNull();
    expect(component.newPreference()).toBeNull();
  });

  it('should set editIndex signal when renaming a preference', () => {
    const pref = preferences[0];
    fixture.componentRef.setInput('preferences', preferences);
    fixture.detectChanges();

    component.renamePreference(pref);
    expect(component.editIndex()).toBe(0);
    expect(component.newPreference()).toBeNull();
  });

  it('should reset editIndex signal when canceling rename', () => {
    component.editIndex.set(0);
    component.cancelRename();
    expect(component.editIndex()).toBeNull();
  });

  it('should set newPreference signal when adding a new preference', () => {
    fixture.componentRef.setInput('identifierKey', 'test_key');
    fixture.detectChanges();

    component.addPreference();
    const newPref = component.newPreference();
    expect(newPref).toBeTruthy();
    expect(newPref?.identifierKey).toBe('test_key');
  });

  it('should reset newPreference signal when canceling new preference', () => {
    component.newPreference.set(createPreference('test'));
    component.cancelNewPreference();
    expect(component.newPreference()).toBeNull();
  });

  it('should emit selectPreference output', (done) => {
    component.selectPreference.subscribe((id: string) => {
      expect(id).toBe('test-id');
      done();
    });
    component.selectPreference.emit('test-id');
  });

  it('should emit editPreference output when overwriting', (done) => {
    const pref = preferences[0];
    component.editPreference.subscribe((p: Preference) => {
      expect(p).toEqual(pref);
      done();
    });
    component.overwrite(pref);
  });

  it('should emit setDefaultPreference output with default toggled to true when preference is not default', (done) => {
    const pref = preferences[0]; // Not default
    component.setDefaultPreference.subscribe((p: Preference) => {
      expect(p.default).toBe(true);
      expect(p.name).toBe(pref.name);
      done();
    });
    component.toggleDefault(pref);
  });

  it('should emit setDefaultPreference output with default toggled to false when preference is default', (done) => {
    const pref = preferences[1]; // Already default
    component.setDefaultPreference.subscribe((p: Preference) => {
      expect(p.default).toBe(false);
      expect(p.name).toBe(pref.name);
      done();
    });
    component.toggleDefault(pref);
  });

  function createComponents() {
    fixture = TestBed.createComponent(PreferenceManagerComponent);
    component = fixture.componentInstance;

    // Use setInput for signal-based inputs instead of direct property assignment
    fixture.componentRef.setInput('preferences', preferences);

    // detectChanges after potential pre-test state modifications
    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      // Opening the menu in all tests added style/log noise and interfered with a simple placeholder assertion.
      // Tests that need the menu can explicitly invoke openMenu().
    });
  }
});
