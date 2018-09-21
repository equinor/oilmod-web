#### StoSelectTextOnFocusDirective
stoSelectTextOnFocus listens for input focus events, and selects the contents of the input.
A user service is established in that allows a user to toggle this feature

##### Usage
```html
<input matInput stoSelectTextOnFocus
    [formControl]="freeTextControl" placeholder="Free Text">
```
