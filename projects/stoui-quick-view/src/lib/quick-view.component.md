#### QuickViewComponent
QuickViewComponent is a fixed overlay that is anchored to an element.
Can be used to display contextual information about an item

##### Example usage
```html
<sto-quick-view [overlayOrigin]="origin" [offsetX]="-8" position="below" #quickView>
  <h3 quickViewHeader>{{ item.title }}</h3>
  <app-edit-item [item]="item"></app-edit-item>
  <div quickViewFooter>
    <app-save-footer (save)="save(item)"></app-save-footer>
  </div>
</sto-quick-view>
```

##### [Input] overlayOrigin
overlayOrigin contains information about the originating element.
```html
<span cdkOverlayOrigin #origin="cdkOverlayOrigin">Origin</span>
<sto-quick-view [overlayOrigin]="origin" #quickView>...</sto-quick-view>
```

##### [Input] position
position determines the direction of the overlay (above or below the element).
 
 Defaults to 'over'
```html
<span cdkOverlayOrigin #origin="cdkOverlayOrigin">Origin</span>
<sto-quick-view [overlayOrigin]="origin" position="below" #quickView>...</sto-quick-view>
```

##### [Input] offsetY / offsetX
Determines the overlay offset in px on the X and Y-axis. Defaults to 0.
```html
<span cdkOverlayOrigin #origin="cdkOverlayOrigin">Origin</span>
<sto-quick-view [overlayOrigin]="origin" [offsetY]="12" [offsetX]="12" #quickView>...</sto-quick-view>
```

##### [Output] closed / opened
Emits an event when the overlay is closed or opened. Used to act on close events.
```html
<span cdkOverlayOrigin #origin="cdkOverlayOrigin">Origin</span>
<sto-quick-view [overlayOrigin]="origin" (opened)="getItem()" (closed)="saveItem()" #quickView>...</sto-quick-view>
```
