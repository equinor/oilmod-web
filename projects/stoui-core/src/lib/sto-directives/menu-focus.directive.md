#### MenuFocusDirective
stoMenuFocus sets a focus (active) state on a menu item when it's hovered.
Used to seamlessly switch between using the mouse and keyboard to select menu items.

##### Usage
@Input('triggers') is a QueryList of all the triggers pointing to this menu

This needs to be applied from the host component, and needs to be via ViewChildren

If we just pass in the actual trigger, we can't subscribe to change events, meaning any triggers added *after*
the view is initialized, will not be checked


```typescript
import { Component, QueryList, ViewChildren } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
@Component({/**...*/})
export class MenuComponent {
    @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
}
```


```html
<mat-menu #actionsMenu="matMenu" stoMenuFocus [triggers]="triggers">
      <button (click)="duplicate()"
              class="dense"
              color="primary"
              mat-menu-item>
        <mat-icon>content_copy</mat-icon>
        Duplicate Movement
      </button>
</mat-menu>
```
