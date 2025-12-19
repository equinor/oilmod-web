import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Column } from '../columns';

const MIN_COLUMN_WIDTH = 40;
const DEFAULT_FLEX_BASIS = 80;

@Directive({
  selector: '[stoDatatableResize]',
  exportAs: 'stoDatatableResize',
  standalone: true,
})
export class StoDatatableResizeDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly column = input.required<Column>();

  // eslint-disable-next-line @angular-eslint/no-output-native
  readonly resize = output<number>();
  readonly resizeEnd = output<number>();

  // Public signal for width changes (can be consumed by components)
  readonly width = signal<number | null>(null);

  private startOffset = 0;
  private initialWidth = 0;
  private currentWidth = 0;
  private readonly moveComplete$ = new Subject<void>();

  constructor() {
    // Add CSS class on next render to ensure DOM is ready
    afterNextRender(() => {
      this.el.nativeElement.classList.add(
        'sto-mdl-table__header__row__cell__resize-handle',
      );
    });

    // Auto-cleanup on destroy
    this.destroyRef.onDestroy(() => {
      this.moveComplete$.complete();
    });
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    event.stopPropagation();

    this.startOffset = event.screenX;
    this.initialWidth = this.column().flexBasis ?? DEFAULT_FLEX_BASIS;

    // Listen for mouse up (single event)
    fromEvent<MouseEvent>(document, 'mouseup')
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((ev) => this.onMouseUp(ev));

    // Listen for mouse move (until move complete)
    fromEvent<MouseEvent>(document, 'mousemove')
      .pipe(takeUntil(this.moveComplete$), takeUntilDestroyed(this.destroyRef))
      .subscribe((ev) => this.move(ev));
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent): void {
    event.stopPropagation();
  }

  private onMouseUp(event: MouseEvent): void {
    event.stopPropagation();
    this.moveComplete$.next();
    this.width.set(null);
    this.resizeEnd.emit(this.currentWidth);
  }

  private move(event: MouseEvent): void {
    const moveDistance = event.screenX - this.startOffset;
    const newWidth = Math.max(
      MIN_COLUMN_WIDTH,
      this.initialWidth + moveDistance,
    );

    this.currentWidth = newWidth;
    this.width.set(newWidth);
    this.resize.emit(newWidth);
  }
}
