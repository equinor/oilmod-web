import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import {
  Preference,
  PreferenceManagerComponent,
  StoFilterPanelModule,
} from '@ngx-stoui/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';

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
  {
    name: 'External filter',
    id: 'uuid-3',
    identifierKey: 'reports_filter',
    user: 'External System',
    external: true,
    payload: {},
  },
];

const meta: Meta<PreferenceManagerComponent> = {
  title: 'common/Preference Manager',
  component: PreferenceManagerComponent,
  decorators: [
    moduleMetadata({
      imports: [
        PreferenceManagerComponent,
        StoFilterPanelModule,
        ReactiveFormsModule,
      ],
    }),
  ],
  argTypes: {
    preferences: {
      control: 'object',
      description: 'List of available preferences',
    },
    activePreferenceId: {
      control: 'select',
      options: [undefined, 'uuid', 'uuid-2', 'uuid-3'],
      description:
        'ID of the currently selected preference (changes display name)',
    },
    loadingIndicator: {
      control: 'boolean',
      description: 'Shows a loading spinner next to the title',
    },
    dirty: {
      control: 'boolean',
      description: 'Shows "(modified)" indicator when true',
    },
    placeholder: {
      control: 'text',
      description: 'Text to display when no preference is selected',
    },
    identifierKey: {
      table: { disable: true },
      description:
        'Internal: Preference identifier used when creating new preferences (not visible)',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
Preference Manager component allows users to manage saved preferences/filters.

Features:
- Select, create, edit, rename, and delete preferences
- Set a default preference
- Share preferences (requires implementation)
- Shows loading indicator during operations
- Shows modified state indicator
- Supports external (read-only) preferences

**Interactive Controls:**
- **activePreferenceId**: Changes which preference name is displayed
- **loadingIndicator**: Shows/hides spinner (note: operations in story also trigger this temporarily)
- **dirty**: Shows/hides "(modified)" indicator (note: typing in input also triggers this)
- **placeholder**: Changes text shown when no preference is selected
        `,
      },
    },
  },
};
export default meta;

type Story = StoryObj<PreferenceManagerComponent>;

export const Usage: Story = {
  render: (args) => {
    // Create mutable state from args - must be reactive for Angular to detect changes
    let preferences = [...args.preferences];
    let activePreferenceId = args.activePreferenceId;
    let loadingIndicator = args.loadingIndicator;
    let dirty = args.dirty;

    return {
      props: {
        ...args,
        preferences,
        activePreferenceId,
        loadingIndicator,
        dirty,
        filterForm: new UntypedFormControl(),
        onSelect: function (id: string) {
          this.activePreferenceId = id;
          this.filterForm.reset();
          action('selectPreference')(id);
        },
        onSetDefault: function (pref: Preference) {
          const index = this.preferences.findIndex(
            (p: Preference) => p.id === pref.id,
          );
          const prefs: Preference[] = [...this.preferences].map((p) => ({
            ...p,
            default: false,
          }));
          prefs[index] = { ...pref, default: true };
          this.loadingIndicator = true;
          action('setDefaultPreference')(pref.name);
          setTimeout(() => {
            this.preferences = prefs;
            this.loadingIndicator = false;
          }, 300);
        },
        onEdit: function (pref: Preference) {
          const index = this.preferences.findIndex(
            (p: Preference) => p.id === pref.id,
          );
          const prefs = [...this.preferences];
          prefs[index] = pref;
          this.loadingIndicator = true;
          this.dirty = false;
          this.filterForm.markAsPristine();
          action('editPreference')(`${pref.name} with id ${pref.id}`);
          setTimeout(() => {
            this.preferences = prefs;
            this.loadingIndicator = false;
          }, 300);
        },
        onDeletePreference: function (id: string) {
          action('deletePreference')(id);
          const index = this.preferences.findIndex(
            (p: Preference) => p.id === id,
          );
          const prefs = [...this.preferences];
          prefs.splice(index, 1);
          this.preferences = prefs;
          if (this.activePreferenceId === id) {
            this.activePreferenceId = undefined;
          }
        },
        onAdd: function (preference: Preference) {
          action('addNewPreference')(preference);
          preference.id = Date.now().toString(10);
          this.preferences = [...this.preferences, preference];
          this.dirty = false;
          this.filterForm.markAsPristine();
        },
        onShare: function (id: string) {
          action('sharePreference')(id);
          const pref = this.preferences.find((p: Preference) => p.id === id);
          alert(
            `Share functionality not implemented. Would share: ${pref?.name}`,
          );
        },
      },
      template: `
      <div style="margin-bottom: 2rem;">
        <h3>Inside Filter Panel</h3>
        <sto-filter-panel [expandable]="true" [expanded]="true">
          <sto-filter-title>
            <sto-preference-manager
              [preferences]="preferences"
              [activePreferenceId]="activePreferenceId"
              [loadingIndicator]="loadingIndicator"
              [dirty]="dirty || filterForm.dirty"
              [placeholder]="placeholder"
              [identifierKey]="identifierKey"
              (selectPreference)="onSelect($event)"
              (editPreference)="onEdit($event)"
              (addNewPreference)="onAdd($event)"
              (setDefaultPreference)="onSetDefault($event)"
              (deletePreference)="onDeletePreference($event)"
              (sharePreference)="onShare($event)">
            </sto-preference-manager>
          </sto-filter-title>
          <input
            [formControl]="filterForm"
            placeholder="Type here to see dirty state (OR use the dirty control)">
          <button
            (click)="filterForm.reset(); filterForm.markAsPristine()">
            Clear input and mark as pristine
          </button>
        </sto-filter-panel>
      </div>

      <div>
        <h3>Standalone</h3>
        <sto-preference-manager
          [preferences]="preferences"
          [activePreferenceId]="activePreferenceId"
          [loadingIndicator]="loadingIndicator"
          [dirty]="dirty"
          [placeholder]="placeholder"
          [identifierKey]="identifierKey"
          (selectPreference)="onSelect($event)"
          (editPreference)="onEdit($event)"
          (addNewPreference)="onAdd($event)"
          (setDefaultPreference)="onSetDefault($event)"
          (deletePreference)="onDeletePreference($event)"
          (sharePreference)="onShare($event)">
        </sto-preference-manager>
      </div>
    `,
    };
  },
  args: {
    preferences,
    activePreferenceId: undefined,
    loadingIndicator: false,
    dirty: false,
    placeholder: 'No filter selected',
    identifierKey: 'reports_filter',
  },
};
