import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Directive,
  EventEmitter, HostBinding,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';


@Component({
  selector: 'sto-message-panel',
  templateUrl: './sto-message-panel.component.html',
  styleUrls: ['./sto-message-panel.component.scss'],

})
export class StoMessagePanelComponent implements OnInit {

  @HostBinding('class') @Input() severity : string;
  @Output() dismissed = new EventEmitter();
  @Input() dismissable: boolean;
  
  ngOnInit() {

  }


  constructor() {
  }

}


