import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Host,
  NgModule,
  OnDestroy,
  Optional,
} from '@angular/core';
import { MatPseudoCheckboxState } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'sto-option-select-all',
  templateUrl: './sto-option-select-all.component.html',
  styleUrls: [ './sto-option-select-all.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCheckboxModule
  ]
})
export class StoOptionSelectAllComponent<T = unknown> implements AfterViewInit, OnDestroy {
  state: MatPseudoCheckboxState = 'checked';

  private options: Array<unknown> = [];
  private destroyed = new Subject<void>();

  constructor(
    @Host() @Optional() private matSelect: MatSelect,
    private cdr: ChangeDetectorRef,
    private el: ElementRef<HTMLElement>) {
  }

  private _value: Array<T> = [];

  get value() {
    return this._value;
  }

  set value(value: Array<T>) {
    this._value = value ?? [];
  }

  ngAfterViewInit() {
    if ( !this.matSelect ) {
      this.el.nativeElement.style.display = 'none';
      return;
    }
    this.options = this.matSelect.options?.map(x => x.value) ?? [];
    this.matSelect.options?.changes
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.options = this.matSelect.options.map(x => x.value);
        this.updateState();
      });

    if ( this.matSelect.ngControl?.control ) {
      // Null-checked via isControl
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.value = this.matSelect.ngControl.control.value;
      this.matSelect.ngControl.valueChanges
        ?.pipe(takeUntil(this.destroyed))
        .subscribe(res => {
          this.value = res;
          this.updateState();
        });
    } else {
      this.el.nativeElement.style.display = 'none';
    }
    // ExpressionChangedAfterItHasBeenCheckedError fix...
    setTimeout(() => {
      this.updateState();
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  onSelectAllClick() {
    if ( this.state === 'checked' ) {
      this.matSelect.ngControl?.control?.setValue([]);
    } else {
      this.matSelect.ngControl?.control?.setValue(this.options);
    }

  }

  private updateState() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const areAllSelected = this.areArraysEqual(this.value, this.options);
    if ( areAllSelected ) {
      this.state = 'checked';
    } else if ( this.value.length > 0 ) {
      this.state = 'indeterminate';
    } else {
      this.state = 'unchecked';
    }
    this.cdr.markForCheck();
  }

  private areArraysEqual(a: Array<T>, b: Array<T>) {
    if ( !a || !b ) {
      return false;
    }
    return [ ...a ].sort().join(',') === [ ...b ].sort().join(',');
  }
}


@NgModule({
  imports: [ StoOptionSelectAllComponent ],
  exports: [ StoOptionSelectAllComponent ]
})
export class StoOptionSelectAllComponentModule {
}
