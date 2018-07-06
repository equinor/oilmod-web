#### Sto action footer
The action footer is a fixed footer at the bottom of the viewport.
Should be used with buttons with actions like "Save, cancel etc.
Has a built-in loading/progress bar.

```html
<sto-action-footer [isLoading]="true">
    
</sto-action-footer> 
<sto-action-footer [isLoading]="$isloading | async">
    <button (click)="onClick()">Submit</button>
    <button (click)="cancel()">Submit</button>
</sto-action-footer>
```

##### isLoading
Triggers if the progressbar should be visible or not.
```html
<sto-action-footer [isLoading]="true">
    
</sto-action-footer> 
```

##### shouldAddClass
If a class "sto-has-action-footer" should be appended to the body-tag.  
This is used to calculate correct height by adding padding to the body element as the footer is a fixed element.  
Default true.
```html
<sto-action-footer [shouldAddClass]="false">
    
</sto-action-footer> 
```

##### position
Hostbinds to style.position. Defaults to "fixed", but could be absolute inside a relative container.
```html
<sto-action-footer position="absolute" [shouldAddClass]="false">
    
</sto-action-footer> 
```