export const preferenceManagerComponentCode = `@Component({
  template: \`
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
                            [preferences]="preferences"></sto-preference-manager>\`,
  standalone: true,
  imports: [
    StoFilterPanelModule,
    StoPreferenceManagerComponent,
    ReactiveFormsModule
  ]
})
export class PreferenceManagerComponent {
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
    action('Select preference')(id);
  }

  onSetDefault(pref: Preference) {
    const preferences = this.preferences as Preference[];
    const index = preferences.findIndex(p => p.id === pref.id);
    const prefs: Preference[] = [ ...preferences ].map(p => ( { ...p, default: false } ));
    prefs[ index ] = pref;
    this.loadingIndicator = true;
    action('Set default preference')(pref.name);
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
    action('Delete preference')(id);
    const preferences = this.preferences as Preference[];
    const index = preferences.findIndex(p => p.id === id);
    const prefs = [ ...preferences ];
    prefs.splice(index, 1);
    this.preferences = prefs;
  }

  onAdd(preference: Preference) {
    action('Create preference')(preference);
    preference.id = Date.now().toString(10);
    this.preferences = [ ...this.preferences, preference ];
  }
}`;
