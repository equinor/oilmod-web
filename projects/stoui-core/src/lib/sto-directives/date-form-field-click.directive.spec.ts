import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DateFormFieldClickDirective } from './date-form-field-click.directive';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '@testing/material.module';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatFormField } from '@angular/material/form-field';

let comp: WrapperComponent;
let fixture: ComponentFixture<WrapperComponent>;
let page: Page;

@Component({
  selector: 'sto-spec-wrap',
  template: `
    <mat-form-field [stoDateFormFieldClick]="picker">
      <input matInput
             [matDatepicker]="picker"
             placeholder="Date">
      <mat-datepicker-toggle matSuffix
                             [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
  `
})
class WrapperComponent {
}

describe('DateFormFieldClickDirective', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [ CommonModule, MaterialModule ],
        declarations: [ DateFormFieldClickDirective, WrapperComponent ]
      })
      .compileComponents()
      .then(createComponent);
  }));

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should open the datepicker when clicking form field', () => {
    expect(page.picker.opened).toBeFalsy();
    page.formField.click();
    fixture.detectChanges();
    expect(page.picker.opened).toBeTruthy();
    page.picker.close();
    fixture.detectChanges();
  });

});

function createComponent() {
  fixture = TestBed.createComponent(WrapperComponent);
  comp = fixture.componentInstance;

  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page = new Page();
  });
}

class Page {
  public formField: HTMLElement;
  public picker: MatDatepicker<Date>;

  constructor() {
    const de = fixture.debugElement.query(By.directive(MatFormField));
    this.formField = de.nativeElement;
    const pickerDe = fixture.debugElement.query(By.directive(MatDatepicker));
    this.picker = pickerDe.componentInstance;
  }
}
