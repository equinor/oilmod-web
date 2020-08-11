#### StoIgnoreContextmenuBackdropDirective
This is a menu that adds a style to the backdrop that allow click events to go through.
Because the close event is on the backdrop, we add a listener this feature.

##### Usage
We require the menu trigger to be passed down to the directive. Without the trigger, we're unable to listen for changes in the open-state for the given menu.

```html
<button mat-button
        color="primary"
        type="button"
        *ngIf="!isNew && !isDuplicate"
        [matMenuTriggerFor]="actionsMenu"
        #actionsMenuTrigger="matMenuTrigger"
        [stoIgnoreContextmenuBackdrop]="actionsMenuTrigger"
      >
        More...
      </button>
```
