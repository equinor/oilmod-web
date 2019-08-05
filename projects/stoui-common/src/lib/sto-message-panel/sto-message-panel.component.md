### StoMessagePanel

StoMessagePanel is used to display contextual messages using 3 different modes - info, warning and error

##### Usage

```html
<sto-message-panel [dismissable]="true|false"
(dismissed)="onDismiss()"
severity="info|warning|error">{{ message }}</sto-message-panel>
```

##### Inputs
* [dismissable] determines if the alert can be dismissed. Note that the component does not handle dismissing, and you need to use the (dismissed) event yourself.
* [severity] determines how the component should be styled. Can be info (default), warning or error.

##### Outputs
* (dismissed) emits when the close-button (X) is clicked to dismiss the message.
