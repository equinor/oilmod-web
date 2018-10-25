import { Component, Input, HostBinding} from '@angular/core';

@Component({
  selector: 'sto-date-column',
  template: `
	  <span [title]="value | formatDate:(titleFormat || format)">
        {{ value | formatDate:format }}
    </span>
  `
})
export class StoDataTableDateColumnComponent {
  @Input() value: any;
  @Input() format: string;
  @Input() titleFormat: string;
}
