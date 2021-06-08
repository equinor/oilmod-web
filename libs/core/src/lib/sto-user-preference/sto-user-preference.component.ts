import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {take, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {StoUserPreferenceService} from './sto-user-preference.service';

@Component({
  selector: 'sto-user-preference',
  templateUrl: './sto-user-preference.component.html',
  styleUrls: ['./sto-user-preference.component.css']
})
export class StoUserPreferenceComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  private destroyed$ = new Subject<boolean>();

  constructor(private fb: FormBuilder, private service: StoUserPreferenceService) {
  }

  private initForm(value: boolean ) {
    this.form = this.fb.group({
      hasSelectTextOnFocusEnabled: [value]
    });
    this.form.get('hasSelectTextOnFocusEnabled')?.valueChanges
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe((hasSelectTextOnFocusEnabled) => {
        this.service.setHasSelectTextOnFocusEnabled(hasSelectTextOnFocusEnabled);
      });
  }

  ngOnInit() {
    this.service.hasSelectTextOnFocusEnabled.asObservable()
      .pipe(
        take(1)
      )
      .subscribe((value) => {
        this.initForm(value);
      });

  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
