import { ViewChild, AfterViewInit, Component, Directive, EventEmitter, Input, OnInit, Output, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Renderer2, OnDestroy} from '@angular/core';


@Component({
  selector: 'sto-action-footer',
  templateUrl: './sto-action-footer.component.html',
  styleUrls : ['./sto-action-footer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sto-action-footer'
  }
})
export class StoActionFooterComponent implements OnInit, OnDestroy  {

  @Input() isLoading : boolean;

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'sto-has-action-footer');
  }

  ngOnInit(): void {

  }

  constructor(private renderer: Renderer2) {
    this.renderer.addClass(document.body, 'sto-has-action-footer');
  }

}
