import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  QueryList,
  ViewEncapsulation,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  MatMenu,
  MatMenuItem,
  MatMenuModule,
  MatMenuTrigger,
} from '@angular/material/menu';
import { take } from 'rxjs/operators';
import { Preference, createPreference } from './preference';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivePreferencePipe } from './active-preference.pipe';

@Component({
  selector: 'sto-preference-manager',
  templateUrl: './preference-manager.component.html',
  styleUrl: './preference-manager.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'openMenu()',
  },
  imports: [
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ActivePreferencePipe,
  ],
})
export class PreferenceManagerComponent {
  /**
   * List of the available preferences
   */
  readonly preferences = input<Preference[]>([]);
  /**
   * The preference identifier (typically application area).
   * If missing, will be set to null
   */
  readonly identifierKey = input<string>();
  /**
   * ID of the selected preference
   */
  readonly activePreferenceId = input<string>();
  /**
   * Whether to show a progress spinner besides the title
   */
  readonly loadingIndicator = input<boolean>();
  /**
   * If the current preference has been modified
   */
  readonly dirty = input<boolean>();
  /**
   * Text to display when no preference is selected
   */
  readonly placeholder = input<string | null>('No filter selected');
  /**
   * selectPreference emits whenever a preference is selected
   */
  readonly selectPreference = output<string>();
  /**
   * editPreference emits any changed (existing) preference
   */
  readonly editPreference = output<Preference>();
  /**
   * setDefaultPreference emits when the user determines a new default preference
   */
  readonly setDefaultPreference = output<Preference>();
  /**
   * deletePreference emits when a preference is deleted
   */
  readonly deletePreference = output<string>();
  /**
   * addNewPreference emits when the user creates a new preference.
   * This does *not* include the current setup - that needs to be added by the consuming application
   */
  readonly addNewPreference = output<Preference>();
  /**
   * sharePreference emits when the user clicks the "share" button.
   * Each application needs to implement this functionality for themselves.
   */
  readonly sharePreference = output<string>();
  /**
   * @internal
   */
  readonly editIndex = signal<number | null>(null);
  readonly newPreference = signal<Preference | null>(null);
  private readonly changedPreference = signal<Preference | null>(null);
  readonly trigger = viewChild(MatMenuTrigger);
  readonly nameTmpl = viewChild<ElementRef<HTMLInputElement>>('nameTmpl');

  openMenu() {
    this.trigger()?.openMenu();
  }

  /**
   * @internal
   */
  renamePreference(preference: Preference) {
    this.newPreference.set(null);
    this.editIndex.set(this.preferences().indexOf(preference));
    this.changedPreference.set({ ...preference });
    requestAnimationFrame(() => this.nameTmpl()?.nativeElement.focus());
  }

  /**
   * @internal
   */
  cancelRename() {
    this.changedPreference.set(null);
    this.editIndex.set(null);
  }

  /**
   * @internal
   */
  saveRename() {
    const changed = this.changedPreference();
    if (!changed) {
      return;
    }
    const el = this.nameTmpl()?.nativeElement;
    if (!el) {
      return;
    }
    changed.name = el.value;
    this.editPreference.emit(changed);
    this.editIndex.set(null);
    this.changedPreference.set(null);
  }

  /**
   * @internal
   */
  toggleDefault(preference: Preference) {
    const changed = { ...preference, default: true };
    this.setDefaultPreference.emit(changed);
  }

  /**
   * @internal
   */
  focusActiveItem(menu: MatMenu) {
    menu._allItems.changes
      .pipe(take(1))
      .subscribe((l: QueryList<MatMenuItem>) => {
        l.forEach((it) => {
          if (it._getHostElement().classList.contains('selected')) {
            requestAnimationFrame(() => it.focus());
          }
        });
      });
  }

  addPreference() {
    this.cancelRename();
    this.newPreference.set(createPreference(this.identifierKey() || ''));
  }

  /**
   * @internal
   */
  saveNewPreference() {
    const newPref = this.newPreference();
    if (!newPref) {
      return;
    }
    const el = this.nameTmpl()?.nativeElement;
    if (!el) {
      return;
    }
    newPref.name = el.value;
    this.addNewPreference.emit(newPref);
    this.newPreference.set(null);
  }

  /**
   * @internal
   */
  cancelNewPreference() {
    this.newPreference.set(null);
  }

  overwrite(pref: Preference) {
    this.editPreference.emit(pref);
  }
}
