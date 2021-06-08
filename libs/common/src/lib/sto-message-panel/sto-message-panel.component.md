### StoMessagePanel

StoMessagePanel is used to display contextual messages using 3 different modes - info, warning and error

##### Usage

```html
<sto-message-panel [dismissable]="true|false"
(dismissed)="onDismiss()"
color="primary|accent|warn">{{ message }}</sto-message-panel>
```

##### Inputs
* [dismissable] determines if the alert can be dismissed. Note that the component does not handle dismissing, and you need to use the (dismissed) event yourself.
* [color] determines how the component should be styled. Uses Angular Material's ThemePalette
* [icon] determines the icon

##### Outputs
* (dismissed) emits when the close-button (X) is clicked to dismiss the message.
