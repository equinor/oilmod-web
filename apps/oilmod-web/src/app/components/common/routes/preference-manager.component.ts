import { Component } from '@angular/core';
import { Preference, PreferenceManagerComponent as StoPreferenceManagerComponent, StoFilterPanelModule } from '@ngx-stoui/common';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { preferenceManagerComponentCode } from './preference-manager.component.code';
import { HighlightModule } from 'ngx-highlightjs';
import { DemoComponent } from '../../demo.component';

@Component({
    template: `
    <sto-demo [code]="preferenceManagerComponentCode">
      <sto-filter-panel [expandable]="true"
                        [expanded]="true">
        <sto-filter-title>
          <sto-preference-manager [loadingIndicator]="loadingIndicator"
                                  (editPreference)="onEdit($event)"
                                  (addNewPreference)="onAdd($event)"
                                  [dirty]="filterForm.dirty"
                                  (deletePreference)="onDeletePreference($event)"
                                  (selectPreference)="onSelect($event)"
                                  (setDefaultPreference)="onSetDefault($event)"
                                  [activePreferenceId]="activePreferenceId"
                                  [preferences]="preferences"></sto-preference-manager>
        </sto-filter-title>
        <input [formControl]="filterForm"
               placeholder="Write stuff here to trigger modified">
        <button (click)="filterForm.reset(); filterForm.markAsPristine()">And click to clear</button>
      </sto-filter-panel>

      <sto-preference-manager [loadingIndicator]="loadingIndicator"
                              (editPreference)="onEdit($event)"
                              (addNewPreference)="onAdd($event)"
                              [dirty]="filterForm.dirty"
                              (deletePreference)="onDeletePreference($event)"
                              (selectPreference)="onSelect($event)"
                              (setDefaultPreference)="onSetDefault($event)"
                              [activePreferenceId]="activePreferenceId"
                              [preferences]="preferences"></sto-preference-manager>

    </sto-demo>


  `,
    imports: [
        StoFilterPanelModule,
        StoPreferenceManagerComponent,
        ReactiveFormsModule,
        MatExpansionModule,
        HighlightModule,
        DemoComponent
    ]
})
export class PreferenceManagerComponent {
  preferenceManagerComponentCode = preferenceManagerComponentCode;
  filterForm = new UntypedFormControl();
  preferences: Preference[] = [
    { name: 'A filter', id: 'uuid', identifierKey: 'reports_filter', user: 'Bobby B', payload: {} },
    { name: 'Another filter', id: 'uuid-2', identifierKey: 'reports_filter', user: 'Bobby B', default: true, payload: {} },
  ];
  activePreferenceId: string;
  loadingIndicator = false;

  onSelect(id: string) {
    this.activePreferenceId = id;
    this.filterForm.reset();
  }

  onSetDefault(pref: Preference) {
    const preferences = this.preferences as Preference[];
    const index = preferences.findIndex(p => p.id === pref.id);
    const prefs: Preference[] = [ ...preferences ].map(p => ( { ...p, default: false } ));
    prefs[ index ] = pref;
    this.loadingIndicator = true;
    setTimeout(() => {
      this.preferences = prefs;
      this.loadingIndicator = false;
    }, 300);
  }

  onEdit(pref: Preference) {
    const preferences = this.preferences as Preference[];
    const index = preferences.findIndex(p => p.id === pref.id);
    const prefs = [ ...preferences ];
    prefs[ index ] = pref;
    // Set preference in payload
    this.loadingIndicator = true;
    this.filterForm.markAsPristine();

    setTimeout(() => {
      this.preferences = prefs;
      this.loadingIndicator = false;
    }, 300);
  }

  onDeletePreference(id: string) {
    const preferences = this.preferences as Preference[];
    const index = preferences.findIndex(p => p.id === id);
    const prefs = [ ...preferences ];
    prefs.splice(index, 1);
    this.preferences = prefs;
  }

  onAdd(preference: Preference) {
    preference.id = Date.now().toString(10);
    this.preferences = [ ...this.preferences, preference ];
  }
}
