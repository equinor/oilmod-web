import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Preference } from './preference';
import { _MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { take } from 'rxjs/operators';

@Component({
  selector: 'sto-preference-manager',
  templateUrl: './preference-manager.component.html',
  styleUrls: [ './preference-manager.component.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreferenceManagerComponent implements OnInit {
  @ViewChild(MatMenuTrigger)
  private trigger: MatMenuTrigger;
  @ViewChild('nameTmpl')
  nameTmpl: ElementRef<HTMLInputElement>;

  /**
   * List of the available preferences
   */
  @Input()
  preferences: Preference[] = [];
  /**
   * The preference identifier (typically application area).
   * If missing, will be set to null
   */
  @Input()
  identifierKey: string;
  /**
   * ID of the selected preference
   */
  @Input()
  activePreferenceId: string;
  /**
   * Whether to show a progress spinner besides the title
   */
  @Input()
  loadingIndicator: boolean;
  /**
   * If the current preference has been modified
   */
  @Input()
  dirty: boolean;

  /**
   * selectPreference emits whenever a preference is selected
   */
  @Output()
  selectPreference = new EventEmitter<string>();
  /**
   * editPreference emits any changed (existing) preference
   */
  @Output()
  editPreference = new EventEmitter<Preference>();
  /**
   * setDefaultPreference emits when the user determines a new default preference
   */
  @Output()
  setDefaultPreference = new EventEmitter<Preference>();
  /**
   * deletePreference emits when a preference is deleted
   */
  @Output()
  deletePreference = new EventEmitter<string>();
  /**
   * addNewPreference emits when the user creates a new preference.
   * This does *not* include the current setup - that needs to be added by the consuming application
   */
  @Output()
  addNewPreference = new EventEmitter<Preference>();


  /**
   * @internal
   */
  public editIndex: number;
  private changedPreference: Preference;
  public newPreference: Preference;

  constructor() {
  }

  ngOnInit(): void {
  }

  @HostListener('click')
  openMenu() {
    this.trigger.openMenu();
  }

  /**
   * @internal
   */
  renamePreference(preference: Preference) {
    this.newPreference = null;
    this.editIndex = this.preferences.indexOf(preference);
    this.changedPreference = { ...preference };
    requestAnimationFrame(() => this.nameTmpl.nativeElement.focus());
  }

  /**
   * @internal
   */
  cancelRename() {
    this.changedPreference = null;
    this.editIndex = null;
  }

  /**
   * @internal
   */
  saveRename() {
    const el = this.nameTmpl.nativeElement;
    this.changedPreference.name = el.value;
    this.editPreference.emit(this.changedPreference);
    this.editIndex = null;
    this.changedPreference = null;
  }

  /**
   * @internal
   */
  toggleDefault(preference: Preference) {
    this.changedPreference = { ...preference };
    this.changedPreference.default = true;
    this.setDefaultPreference.emit(this.changedPreference);
    this.changedPreference = null;
  }

  /**
   * @internal
   */
  focusActiveItem(menu: _MatMenu) {
    menu._allItems.changes.pipe(take(1))
      .subscribe((l: QueryList<MatMenuItem>) => {
        l.forEach(it => {
          if ( it._getHostElement().classList.contains('selected') ) {
            requestAnimationFrame(() => it.focus());
          }
        });
      });
  }

  addPreference() {
    this.cancelRename();
    this.newPreference = new Preference(this.identifierKey);
  }

  /**
   * @internal
   */
  saveNewPreference() {
    const el = this.nameTmpl.nativeElement;
    this.newPreference.name = el.value;
    this.addNewPreference.emit(this.newPreference);
    this.newPreference = null;
  }

  /**
   * @internal
   */
  cancelNewPreference() {
    this.newPreference = null;
  }

  overwrite(pref: Preference) {
    this.editPreference.emit(pref);
  }
}