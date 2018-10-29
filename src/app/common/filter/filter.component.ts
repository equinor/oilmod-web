import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: [ './filter.component.scss' ]
})
export class FilterComponent {
  @Output()
    docs = new EventEmitter<void>();
  expandable = true;
  expanded = true;
}
