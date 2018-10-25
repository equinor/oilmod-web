#### StoIgnoreMenuBackdropDirective
This is a menu that adds a style to the backdrop that allow click events to go through.

Because the close event is on the backdrop, we add a listener to this element.

In addition, it alters the select hover behaviour, where hover will also set a focus state, enabling keyboard
navigation.

##### Usage
```html
<mat-select
    stoIgnoreMenuBackdrop
    [compareWith]="compareFacilityGroup"
    [placeholder]="form.value.facilityGroup.name"
    formControlName="facilityGroup">
    <mat-option *ngFor="let fg of facilityGroups | validDateRange:(dateRange$ | async)" [value]="fg">
        {{ fg.name }}
    </mat-option>
</mat-select>
```
