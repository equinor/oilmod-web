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
  @Input() shouldAddClass = true;

  ngOnDestroy(): void {
    if (this.shouldAddClass) {
      this.renderer.removeClass(document.body, 'sto-has-action-footer');
    }
  }

  ngOnInit(): void {
    if (this.shouldAddClass) {
      this.renderer.addClass(document.body, 'sto-has-action-footer');
    }
  }

  constructor(private renderer: Renderer2) {
  }

}
