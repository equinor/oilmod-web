import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { Column } from '../columns';
import { fromEvent, ReplaySubject, Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[stoDatatableResize]',
  exportAs: 'stoDatatableResize'
})
export class StoDatatableResizeDirective implements AfterViewInit, OnDestroy {
  @Input()
  column: Column;
  @Output()
  resize = new EventEmitter<number>();
  @Output()
  resizeEnd = new EventEmitter<number>();
  // @HostBinding('draggable')
  // draggable = true;
  private startOffset: number;
  private initial: number;
  private sub: Subscription;
  public width$ = new ReplaySubject<number>();
  private width: number;
  private moveComplete$ = new Subject<boolean>();


  constructor(private el: ElementRef<HTMLElement>) {
  }

  @HostListener('mousedown', [ '$event' ])
  onMouseDown(event: MouseEvent) {
    event.stopPropagation();
    this.startOffset = event.screenX;
    this.initial = this.column.flexBasis || 80;
    fromEvent(document, 'mouseup')
      .pipe(take(1))
      .subscribe((ev: MouseEvent) => this.onMouseUp(ev));
    fromEvent(document, 'mousemove')
      .pipe(takeUntil(this.moveComplete$))
      .subscribe((ev: MouseEvent) => this.move(ev));
  }

  onMouseUp(event: MouseEvent) {
      event.stopPropagation();
      this.moveComplete$.next(true);
      this.width$.next(null);
      this.resizeEnd.emit(this.width);
  }

  @HostListener('contextmenu', [ '$event' ])
  ctxMenu(event: MouseEvent) {
    event.stopPropagation();
  }

  private move(event: MouseEvent) {
    const move = event.screenX - this.startOffset;
    const width = this.initial + move < 40 ? 40 : this.initial + move;
    this.width$.next(width);
    this.width = width;
  }

  ngAfterViewInit(): void {
    this.el.nativeElement.classList.add('sto-mdl-table__header__row__cell__resize-handle');
  }

  ngOnDestroy() {
    this.moveComplete$.next(true);
    this.moveComplete$.complete();
    this.width$.complete();
  }

}
