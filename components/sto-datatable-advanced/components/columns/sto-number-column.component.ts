import { Component, Input} from '@angular/core';

@Component({
  selector: 'sto-number-column',
  template: `
	  <span [title]="value | numberFormat" *ngIf="value" [ngClass]="{'negative-number': value < 0}">
        {{value | numberFormat:unit:abs:appendDecimals}}
    </span>
	  <span [title]="0 | numberFormat" *ngIf="!value">
        {{0 | numberFormat:unit:abs:appendDecimals}}
     </span>
  `,
  styleUrls: ['sto-number-column.component.scss']

})
export class StoDataTableNumberColumnComponent {
  @Input() value: any;
  @Input() unit: ''; 
  @Input() abs: boolean;
  @Input() appendDecimals: boolean = true;
}
