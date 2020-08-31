import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import {
  Preference,
  PreferenceManagerComponent,
  PreferenceManagerModule,
  StoFilterPanelModule
} from '../../projects/stoui-common/src/public_api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

export default {
  title: 'common/Preference Manager',
  component: PreferenceManagerComponent,
  decorators: [
    moduleMetadata({
      imports: [
        PreferenceManagerModule,
        BrowserAnimationsModule,
        StoFilterPanelModule,
        ReactiveFormsModule
      ],
    })
  ],
  argTypes: {
    filterList: { table: { disable: true } }
  },
  parameters: {},
} as Meta;

export const Usage: Story<PreferenceManagerComponent> = (args: PreferenceManagerComponent) => {
  return {
    props: {
      ...args,
      filterForm: new FormControl(),
      onSelect: function (id: string) {
        this.activePreferenceId = id;
        this.filterForm.reset();
        action('Select preference')(id);
      },
      onSetDefault: function (pref: Preference) {
        const index = this.preferences.findIndex(p => p.id === pref.id);
        const prefs = [ ...this.preferences ].map(p => ( { ...p, default: false } ));
        prefs[ index ] = pref;
        this.loadingIndicator = true;
        action('Set default preference')(pref.name);
        setTimeout(() => {
          this.preferences = prefs;
          this.loadingIndicator = false;
        }, 300);
      },
      onEdit: function (pref: Preference) {
        const index = this.preferences.findIndex(p => p.id === pref.id);
        const prefs = [ ...this.preferences ];
        prefs[ index ] = pref;
        // Set preference in payload
        this.loadingIndicator = true;
        this.filterForm.markAsPristine();
        action('Edit preference')(`${pref.name} with id ${pref.id}`);

        setTimeout(() => {
          this.preferences = prefs;
          this.loadingIndicator = false;
        }, 300);
      },
      onDeletePreference: function (id: string) {
        action('Delete preference')(id);
        const index = this.preferences.findIndex(p => p.id === id);
        const prefs = [ ...this.preferences ];
        prefs.splice(index, 1);
        this.preferences = prefs;
      },
      onAdd: function (preference: Preference) {
        action('Create preference')(preference);
        preference.id = Date.now().toString(10);
        this.preferences = [ ...this.preferences, preference ];
      }
    },
    component: PreferenceManagerComponent,
    template: `
<sto-filter-panel [expandable]="true" [expanded]="true">
  <sto-filter-title><sto-preference-manager [loadingIndicator]="loadingIndicator"
                                            (editPreference)="onEdit($event)"
                                            (addNewPreference)="onAdd($event)"
                                            [dirty]="filterForm.dirty"
                                            (deletePreference)="onDeletePreference($event)"
                                            (selectPreference)="onSelect($event)"
                                            (setDefaultPreference)="onSetDefault($event)"
                                            [activePreferenceId]="activePreferenceId"
                                            [preferences]="preferences"></sto-preference-manager></sto-filter-title>
  <input [formControl]="filterForm" placeholder="Write stuff here to trigger modified">
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
`
  };
};
const preferences: Preference[] = [
  { name: 'A filter', id: 'uuid', identifierKey: 'reports_filter', user: 'Bobby B', payload: {} },
  { name: 'Another filter', id: 'uuid-2', identifierKey: 'reports_filter', user: 'Bobby B', default: true, payload: {} },
];
Usage.args = {
  preferences,
  activePreferenceId: null,
  loadingIndicator: false,
};
Usage.argTypes = {
  activePreferenceId: { control: { type: 'text' } }
};
