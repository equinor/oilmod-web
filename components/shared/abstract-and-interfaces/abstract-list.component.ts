import {
  AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, HostListener, Input, OnInit, Output,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ListAutoResizeService } from '../services/list-auto-resize.service';


export abstract class AbstractListComponent implements AfterViewInit {

  @ViewChild('table', {read: ElementRef}) public table: ElementRef;

  private _height: string;
  set height(height: string) {
    this._height = height;
  }

  get height(): string {
    return this._height;
  }

  ngAfterViewInit(): void {
    this.calculateAndSetElementHeight();
    this.toggleService.isToggled.subscribe($event => {
      this.onToggle($event);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // The datatable also does listens to this so we have to wait for this to finish.
    setTimeout(() => {this.calculateAndSetElementHeight();}, 100);

  }

  public onToggle($event) {
    if ($event.isExpanded) {
      $event.contentHeight = $event.contentHeight * -1;
    }
    const oldHeigth = this.height;
    this.height = $event.contentHeight + parseInt(oldHeigth, 10) + 'px';

  }


  private calculateAndSetElementHeight() {
    const windowHeight = window.innerHeight;
    const elementOffsetTop = this.getElementOffsetTop();
    const elementMarginBottom = this.table.nativeElement.style.marginBottom;

    this.height = windowHeight - 64 - elementOffsetTop + 'px';
    this.cdr.detectChanges();

  }

  private getElementOffsetTop() {
    return this.table.nativeElement.getBoundingClientRect().top;
  }

  constructor(protected cdr: ChangeDetectorRef, protected toggleService: ListAutoResizeService) {

  }

}
