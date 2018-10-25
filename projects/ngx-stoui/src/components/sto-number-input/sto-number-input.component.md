#### Sto number input
The number input is component that formats the number after you blur the field.
It is possible to decide how many decimals (fractions) the number can show, input a unit.
E.g. 1303200.32 is default formatted to 1 303 200,320
Tries to interpret pasted values and export the numberic value to the clipboard.
Should handle most common keystrokes as a normal input field.

##### FormControlName
Syncs a FormControl in an existing FormGroup to a form control element by name.
Is used to sync the input with the Form.
```html
<sto-number-input formControlName="quantity"></sto-number-input>
```

##### Placeholder
Text in the input field when no value.
```html
<sto-number-input placeholder="Please input quantity"></sto-number-input>
```
##### Label
Label above the input field.
```html
<sto-number-input label="Quantity *"></sto-number-input>
```
##### textAlign
The alignment of the text. 'right' or 'left'. Default 'right'.
```html
<sto-number-input textAlign="right"></sto-number-input>
```
##### fractionSize
How many decimals(fractions). Default 3. The input will round half away from zero. 7.9995 => 8 and -7.9995 => -8
```html
<sto-number-input [fractionSize]="5"></sto-number-input>
```

##### suffix
A suffix after the number, e.g. "M3".
```html
<sto-number-input suffix="m3"></sto-number-input>
```

##### readonly
Make the field as readonly.
```html
<sto-number-input [readonly]="true"></sto-number-input>
```

##### disabled
 Toggles if a field should be readonly.
```html
<sto-number-input [disabled]="true"></sto-number-input>
```

##### floatLabel
The position/animation of the label. Default 'always'. https://material.angular.io/components/form-field/overview#floating-label
```html
<sto-number-input floatLabel="always"></sto-number-input>
```

##### withoutPlaceHolder
Disabled styling assosiated with label. Used in tables and such.
 ```html
<sto-number-input [withoutPlaceHolder]="true"></sto-number-input>
```

##### forceValue
Force value is used to set a value, which shall always be display only.
When a forceValue is used, no other values will be propagated.

```html
<sto-number-input [forceValue]="1.2394"></sto-number-input>
```
    
    
     
