#### StoDaterangeComponent
StoDaterangeComponent enables a user to select a specific range of dates.
Primarily used for filtering (show all movements from 01-08-18 to 31-08-18)
Does *not* allow direct user input, but will always open a dialog

##### Usage
```html
<sto-daterange formControlName="dateRange"
  inputStyleClass="sto-form__field"
  placeholder="Date range"></sto-daterange>
```

##### [Input] showIcon
showIcon allows the consumer to override the icon, and hide it.
```html
<sto-daterange [showIcon]="false"></sto-daterange>
```

##### [Input] inputStyleClass
inputStyleClass allows you to set an additional class on the rendered
```html
<sto-daterange [inputStyleClass]="['my-class', 'another-class']"></sto-daterange>
```

##### [Input] placeholder
Label / placeholder shown on the input element
```html
<sto-daterange placeholder="Select date range"></sto-daterange>
```

##### [Output] onFocus
Emits an event when the daterange picker is focused
```html
<sto-daterange (onFocus)="doSomething()"></sto-daterange>
```

##### [Output] onBlur
Emits an event when the daterange picker is blurred
```html
<sto-daterange (onBlur)="doSomething()"></sto-daterange>
```

