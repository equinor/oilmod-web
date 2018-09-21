### Sto filter panel
Filter panel is a togglable panel with a header and a content area, and is an extension of expansion panel from material.
Has build in content areas for title, table actions and filter actions.
The panel has a toggle button that open and closes the content area and emits an event with the height of the content area.

```html
<sto-filter-panel [expandable]="true" (toggled)="toggleService.isToggled.emit($event)">
    <sto-filter-title>Integration Logs</sto-filter-title>
        <sto-filter-table-actions>
           <button mat-button>
           New<mat-icon>arrow_drop_down</mat-icon>
           </button>    
	    </sto-filter-table-actions>
	       <sto-filter-actions>
                <button mat-icon-button>
                  <mat-icon>refresh</mat-icon>
               </button>
            </sto-filter-actions>
		<form class="sto-form sto-grid sto-grid--6" [formGroup]="form" >
		     <div class="sto-grid__column">
                   <mat-form-field>
                     ...
                    </mat-form-field>
             </div>
		</form>
</sto-filter-panel>
```

####Selector / Content projection
##### sto-filter-title 
The title. Usually just a string but could be html.

##### sto-filter-table-actions 
Buttons and actions on the left side of the separator if both table and filter actions is present.
(The name is from a time where all actions left of the separator was related to the table).

##### sto-filter-actions 
Buttons and actions on the right side of the separator if both table and filter actions is present.
(The name is from a time where all actions right of the separator was related to the table).

####Input
##### expandable
If the filter panel should be expandable. Default true.
```html
<sto-filter-panel [expandable]="true">
```
##### expanded
If the filter panel should be expanded by default. Default false.
```html
<sto-filter-panel [expanded]="true">
```

####Output
##### toggled
Emits {isExpanded: boolean, contentHeight: number } where
isExpanded is true if the panel opens and false if not.
ContentHeight is the height of the expanded content. 
```html
<sto-filter-panel (toggled)="onToggle($event)">
```
