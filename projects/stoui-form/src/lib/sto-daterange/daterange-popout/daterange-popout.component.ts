import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { fromEvent, merge, Subject } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { Key } from '@ngx-stoui/core';
import { animate, style, transition, trigger } from '@angular/animations';

declare var ResizeObserver: any;

@Component({
  selector: 'sto-daterange-popout',
  templateUrl: './daterange-popout.component.html',
  styleUrls: [ './daterange-popout.component.scss' ],
  animations: [
    trigger('open', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(1, 0.8)' }),
        animate('120ms cubic-bezier(0, 0, 0.2, 1)', style({
          opacity: 1,
          transform: 'scale(1, 1)'
        })),
      ]),
      transition(':leave', [
        animate('100ms linear', style({ opacity: 0 }))
      ]),
    ])
  ]
})
export class DaterangePopoutComponent implements AfterViewInit, OnDestroy {
  @Input()
  value: Date;
  @Output()
  opened = new EventEmitter();
  @Output()
  closed = new EventEmitter();
  @Output()
  valueChanged = new EventEmitter<Date | null>();
  @Output()
  clear = new EventEmitter();
  @Input()
  start: Date;
  @Input()
  end: Date;
  public isOpen: boolean;
  private manualClose = new Subject();

  constructor(private cdr: ChangeDetectorRef, private elRef: ElementRef<HTMLElement>) {
  }

  public open() {
    this.isOpen = true;
    requestAnimationFrame(() => this.listenForDomClicks());
    this.cdr.markForCheck();
  }

  public close() {
    this.isOpen = false;
    this.manualClose.next();
    this.cdr.markForCheck();
  }

  public toggle() {
    this.isOpen ? this.close() : this.open();
  }

  private listenForDomClicks() {
    const self = this.elRef.nativeElement;
    const clickEv$ = fromEvent<MouseEvent>(document, 'click');
    const keydownEv$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(filter((ev: KeyboardEvent) => ev.keyCode === Key.Escape));
    const manual$ = this.manualClose.asObservable();
    merge(clickEv$, keydownEv$, manual$)
      .pipe(
        map(event => event ? ( <Event>event ).target as Node : null),
        filter(node => node ? node !== self || !self.contains(node) : true),
        take(1)
      )
      .subscribe(() => {
        this.close();
      });
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }

}
