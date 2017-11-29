import {
  AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, HostListener, Input, OnInit, Output,
  ViewChild, OnDestroy
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ListAutoResizeService } from '../services/list-auto-resize.service';
import { Subscription } from 'rxjs/Subscription';


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
    }, 1)

  }
  ngOnDestroy(){
    this.toggleSubscription$.unsubscribe();
  }

  private resizeId;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    clearTimeout(this.resizeId);
    this.resizeId = setTimeout(() => this.calculateAndSetElementHeight(), 100);
    // The datatable also does listens to this so we have to wait for this to finish.

  }

  public onToggle($event) {
    if ($event.isExpanded) {
      $event.contentHeight = $event.contentHeight * -1;
    }
    const oldHeigth = this.height;
    this.height = $event.contentHeight + parseInt(oldHeigth, 10) + 'px';

  }


  private calculateAndSetElementHeight() {
    const PADDING_BOTTOM = 28;
    const windowHeight = window.innerHeight;
    const elementOffsetTop = this.getElementOffsetTop();
    this.height = windowHeight - PADDING_BOTTOM - elementOffsetTop + 'px';
    this.cdr.detectChanges();

  }

  private getElementOffsetTop() {
    return this.table.nativeElement.getBoundingClientRect().top;
  }

  constructor(protected cdr: ChangeDetectorRef, protected toggleService: ListAutoResizeService) {

  }

}
