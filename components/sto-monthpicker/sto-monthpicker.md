#### Sto Monthpicker/Datepicker
Extends the datepicker from Angular material with the possiblity to ONLY pick the month.

```angular2html
<mat-form-field class="sto-form__field"  [stoMonthFormFieldClick]="monthPicker">
    <input matInput placeholder="Month" [mdMonthpicker]="monthPicker" formControlName="date">
    <md-monthpicker-toggle matSuffix [for]="monthPicker"></md-monthpicker-toggle>
    <md-monthpicker [startAt]="form.controls['date'].value" #monthPicker></md-monthpicker>
</mat-form-field>
```

Is a candidate to rewrite / replace with newer datepicker from Angular Material.