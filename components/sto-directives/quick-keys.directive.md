#### QuickKeysDirective
QuickKeysDirective is used to implement shortcut keys on DOM elements, e.g to submit or reset a form on enter/escape

##### General usage
Currently we support two quick-key actions:
 * CTRL+Enter to save
 * Escape to cancel

These emit on (quickSubmit) and (quickCancel) respectively.
```html
<form [formGroup]="form" quickKeys 
    (quickSubmit)="save()"
    (quickCancel)="cancel()">...</form>
```

##### With a FormGroup
The quick keys can be connected to a FormGroup, which allows us to run some default business checks before emitting (check if form is pristine before emitting submit, for example)
```html
<form [formGroup]="form" quickKeys (quickSubmit)="save()">...</form>
```
