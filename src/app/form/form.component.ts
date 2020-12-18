import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { parse } from 'date-fns';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: [ './form.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class FormComponent implements OnInit {
  public minDate = parse('2018-01-01');
  public maxDate = parse('2018-07-30');
  public form: FormGroup;
  public filterText: string;
  public opts: string[] = [ 'AB', 'BC', 'CD', 'DE', 'EF' ];
  public filterOpts: string[] = [ 'AB', 'BC', 'CD', 'DE', 'EF' ];

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
  }

  compareSelection(a: string, b: string) {
    return a === b;
  }

  onSelectFilterChange(value) {
    this.filterText = value;
    this.filterOpts = this.opts
      .filter(v => new RegExp(value || '', 'i').test(v));
  }

  onSelectAll(all: boolean) {
    const o = all ? this.filterOpts : [];
    this.form.get('multi').setValue(o);
    this.form.get('multi').markAsDirty();
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.form = this.fb.group({
      number: [],
      select: [],
      multi: [[]],
      month: [],
      slideToggle: [],
      dateRange: [ { start: new Date(), end: null } ],
      monthRange: []
    });
  }

}
