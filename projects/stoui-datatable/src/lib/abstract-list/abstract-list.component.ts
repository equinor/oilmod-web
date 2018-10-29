import {
  AfterViewInit, ChangeDetectorRef, ElementRef, HostListener,
  ViewChild, OnDestroy
} from '@angular/core';
import { ListAutoResizeService } from './list-auto-resize.service';
import { Subscription } from 'rxjs';
import { throttleable } from '../vendor/ngx-datatable/utils/throttle';


export abstract class AbstractListComponent implements AfterViewInit, OnDestroy {

  @ViewChild('table', {read: ElementRef}) public table: ElementRef;
  private toggleSubscription$: Subscription;

  private _height: string;
  set height(height: string) {
    this._height = height;
  }

  get height(): string {
    return this._height;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.calculateAndSetElementHeight();
      this.toggleSubscription$ = this.toggleService.isToggled.subscribe($event => {
        this.onToggle($event);
      });
    }, 350);

  }
  ngOnDestroy() {
    this.toggleSubscription$.unsubscribe();
  }


  @HostListener('window:resize', ['$event'])
  @throttleable(100)
  onWindowResize(event) {
    this.calculateAndSetElementHeight();
    // The datatable also does listens to this so we have to wait for this to finish.

  }

  public onToggle($event) {
    if ($event.isExpanded) {
      $event.contentHeight = $event.contentHeight * -1;
    }
    const oldHeigth = this.height;
    this.height = $event.contentHeight + parseInt(oldHeigth, 10) + 'px';
    this.cdr.markForCheck();
  }


  public calculateAndSetElementHeight() {

    const PADDING_BOTTOM = 28;
    const windowHeight = window.innerHeight;
    const elementOffsetTop = this.getElementOffsetTop();
    this.height = windowHeight - PADDING_BOTTOM - elementOffsetTop + 'px';
    this.cdr.markForCheck();

  }

  private getElementOffsetTop() {
    return this.table.nativeElement.getBoundingClientRect().top;
  }

  constructor(protected cdr: ChangeDetectorRef, protected toggleService: ListAutoResizeService) {

  }

}