## Sto-form

#### Directive
Applying stoFormField to any mat-form-field elements, will:

* Apply the correct css classes (`sto-form__field`)
* Set state-based classes
  * Readonly -> `sto-form__field--readonly`
  * Disabled -> `sto-form__field--disabled`
* Select all text based on user preferences

#### Example

```html
<mat-form-field stoFormField>
  <input matInput [readonly]="true">
</mat-form-field>
```

results in

```html
<mat-form-field class="sto-form__field sto-form__field--readonly">
  <input matInput [readonly]="true">
</mat-form-field>
```
