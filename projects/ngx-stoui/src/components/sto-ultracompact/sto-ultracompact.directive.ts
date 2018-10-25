import { Directive, ElementRef, Injectable, NgModule, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

const NORMAL_HEIGHT = 36;
const COMPACT_HEIGHT = 24;

@Injectable()
export class StoUltraCompactService {

  public subscription = new BehaviorSubject<boolean>(false);
  public $rowHeight = new BehaviorSubject<number>(36);

  private broadCastRowHeight() {
    this.subscription.subscribe((isEnabled) => {
      const rowHeight = isEnabled ? COMPACT_HEIGHT : NORMAL_HEIGHT;
      this.$rowHeight.next(rowHeight);
    });
  }

  constructor() {
    this.broadCastRowHeight();
  }
}

@Directive({
  selector: '[stoUltraCompact]'
})
export class StoUltraCompactDirective implements OnInit, OnDestroy {

  constructor(private el: ElementRef,
              private renderer: Renderer2,
              private ultraCompactService: StoUltraCompactService) {
  }

  ngOnInit(): void {

    this.ultraCompactService.subscription.subscribe((value) => {
      if (value) {
        this.renderer.addClass(this.el.nativeElement, 'sto-compact');
      } else {
        this.renderer.removeClass(this.el.nativeElement, 'sto-compact');
      }

    });
  }

  ngOnDestroy() {
    this.ultraCompactService.subscription.unsubscribe();
  }
}

@NgModule({
  imports: [CommonModule],
  exports: [StoUltraCompactDirective],
  declarations: [StoUltraCompactDirective],
  providers: [StoUltraCompactService]
})
export class StoUltraCompactModule {
}
