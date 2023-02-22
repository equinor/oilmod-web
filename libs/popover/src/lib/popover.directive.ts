import { Directive, HostListener, Output } from '@angular/core';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { BehaviorSubject, map } from 'rxjs';

@Directive({
  selector: '[stoPopoverTrigger]',
  standalone: true,
  exportAs: 'stoPopoverTrigger'
})
export class PopoverDirective extends CdkOverlayOrigin {
  private open$ = new BehaviorSubject<boolean>(false);
  @Output()
  openStream = this.open$.pipe(map(v => v));

  open() {
    this.open$.next(true);
  }

  close() {
    console.log('Close');
    this.open$.next(false);
  }

  @HostListener('click', [ '$event' ])
  onClick(event: MouseEvent) {
    this.open$.next(!this.open$.value);
  }
}