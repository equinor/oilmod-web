import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { Directive, HostListener, Output, input } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Directive({
  selector: '[stoPopoverTrigger]',
  exportAs: 'stoPopoverTrigger',
})
export class PopoverDirective extends CdkOverlayOrigin {
  readonly openPopoverOn = input<'click' | 'hover'>('click');
  private open$ = new BehaviorSubject<boolean>(false);
  @Output()
  openStream = this.open$.pipe(map((v) => v));

  open() {
    this.open$.next(true);
  }

  close() {
    console.log('Close');
    this.open$.next(false);
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.openPopoverOn() === 'click') {
      this.open$.next(!this.open$.value);
    }
  }

  @HostListener('mouseenter', ['$event'])
  onHover(event: MouseEvent) {
    if (this.openPopoverOn() === 'hover') {
      this.open$.next(!this.open$.value);
    }
  }
}
