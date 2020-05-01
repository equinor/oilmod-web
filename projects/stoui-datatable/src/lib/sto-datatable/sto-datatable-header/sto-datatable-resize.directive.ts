import { AfterViewInit, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { Column } from '../columns';

@Directive({
  selector: '[stoDatatableResize]'
})
export class StoDatatableResizeDirective implements AfterViewInit {
  @Input()
  column: Column;
  @Output()
  resize = new EventEmitter<number>();
  @Output()
  resizeEnd = new EventEmitter<number>();
  @HostBinding('draggable')
  draggable = true;
  private startOffset: number;
  @HostBinding('style.opacity')
  opacity = 1;

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    this.startOffset = 0;
    this.opacity = 0;
    event.dataTransfer.dropEffect = 'none';
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
  }

  @HostListener('drag', ['$event'])
  onDrag(event: DragEvent) {
    if ( event.screenX !== 0 ) {
      this.resize.emit(( this.startOffset || 0 ) + event.offsetX + ( this.column.flexBasis || 80 ));
    }
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(event: DragEvent) {
    if ( event.screenX !== 0 ) {
      this.resizeEnd.emit(( this.startOffset || 0 ) + event.offsetX + ( this.column.flexBasis || 80 ));
    }
    this.startOffset = 0;
    this.opacity = 1;
  }

  constructor(private el: ElementRef<HTMLElement>) {
  }

  ngAfterViewInit(): void {
    this.el.nativeElement.classList.add('sto-mdl-table__header__row__cell__resize-handle');
  }

}
