import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sto-wysiwyg-actions',
  templateUrl: './wysiwyg-actions.component.html',
  styleUrls: [ './wysiwyg-actions.component.scss' ]
})
export class WysiwygActionsComponent implements OnInit {
  @Input()
  active: string[];
  @Output()
  modifier = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

}
