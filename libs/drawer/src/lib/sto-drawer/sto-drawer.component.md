### Sto Drawer

A sidebar navigation commonly referred as a drawer that animates from the left or right side of the viewport.

####Selector / Content projection

##### sto-filter-header

Content (HTML) that is inside the header of the drawer.

```html
<sto-drawer-header>
  <h3>Price</h3>
  <div class="sto-drawer__header__suffix">
    <button type="button" mat-icon-button (click)="cancel()">
      <mat-icon>close</mat-icon>
    </button>
  </div>
</sto-drawer-header>
```

##### sto-drawer\_\_footer

Content (HTML) that is inside the header footer.

```html
<sto-drawer-footer>
  <mat-progress-bar class="sto-progress-bar" mode="indeterminate" *ngIf="!hasData || (isLoading$ | async)"></mat-progress-bar>
  <button mat-raised-button (click)="save()" color="primary">Save</button>
  <button mat-button (click)="cancel(true)" color="primary">Cancel</button>
</sto-drawer-footer>
```

####Input

##### offset

Offset (space) between the viewPanel right and the drawer in pixels. Binds to the right style property.
Used for multiple drawers where the offset would be the width of the already opened drawer.
Default 0.

```html
<sto-drawer-footer offset="32px"></sto-drawer-footer>
```

##### padding

Offset (space) between the viewPanel top and the drawer in pixels.
Binds to the top style property.
Default 0.

```html
<sto-drawer-footer padding="16px"></sto-drawer-footer>
```

##### position

Position of the drawer as a string
Left or right. Default right.

```html
<sto-drawer-footer position="left"></sto-drawer-footer>
```

##### cssClass

Additional css class(es) as a string e.g "sto-drawer--xmas".

```html
<sto-drawer-footer cssClass="sto-drawer--xmas"></sto-drawer-footer>
```

##### closeOnClick

If the drawer should close when clicked outside the drawer.

```html
<sto-drawer-footer [closeOnClick]="false"></sto-drawer-footer>
```

##### ignoreEscKey

Esc key closed by default the drawer, this overrides that behaviour.
Default false.

```html
<sto-drawer-footer [ignoreEscKey]="true"></sto-drawer-footer>
```

##### open

If the drawer is opened.

```html
<sto-drawer-footer [open]="true"></sto-drawer-footer>
```

##### width

The width of the drawer in as a string (pixels: '600px', percentage: '33%', or viewPort:'30vw')
Default '25vw'

```html
<sto-drawer-footer width="320px"></sto-drawer-footer>
```

####Output

##### onToggle

Emits true if opened, false if closed.

```html
<sto-drawer-footer (onToggle)="onToggle($event)"></sto-drawer-footer>
```

##### onClose

Emits on close.

```html
<sto-drawer-footer (onClose)="onClose()"></sto-drawer-footer>
```

##### onOpen

Emits on open.

```html
<sto-drawer-footer (onOpen)="onOpen()"></sto-drawer-footer>
```

##### cancel

Emits on cancel. When the cancel is called by pressing ESC key.

```html
<sto-drawer-footer (cancel)="onCancel()"></sto-drawer-footer>
```

##### submit

Emits on submit. When the submit is called from code like CTRL+S.

```html
<sto-drawer-footer (submit)="onSubmit()"></sto-drawer-footer>
```
