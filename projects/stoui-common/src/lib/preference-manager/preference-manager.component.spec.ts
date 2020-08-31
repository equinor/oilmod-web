import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceManagerComponent } from './preference-manager.component';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivePreferencePipe } from './active-preference.pipe';
import { Preference } from './preference';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const preferences: Preference[] = [
  { name: 'A filter', id: 'uuid', identifierKey: 'reports_filter', user: 'Bobby B', payload: {} },
  { name: 'Another filter', id: 'uuid-2', identifierKey: 'reports_filter', user: 'Bobby B', default: true, payload: {} },
];

describe('PreferenceManagerComponent', () => {
  let component: PreferenceManagerComponent;
  let fixture: ComponentFixture<PreferenceManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
          CommonModule,
          MatMenuModule,
          MatIconModule,
          MatButtonModule,
          MatFormFieldModule,
          MatInputModule,
          MatProgressSpinnerModule,
          NoopAnimationsModule,
        ],
        declarations: [ PreferenceManagerComponent, ActivePreferencePipe ]
      })
      .compileComponents()
      .then(createComponents);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
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
