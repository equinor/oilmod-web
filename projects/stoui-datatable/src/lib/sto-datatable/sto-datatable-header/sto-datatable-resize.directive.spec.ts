import { StoDatatableResizeDirective } from './sto-datatable-resize.directive';
import { ElementRef } from '@angular/core';
import { Column } from '../columns';

class MockElementRef extends ElementRef {
  constructor() {
    const nativeElement = {
      classList: {
        add(cls: string) {
        }
      }
    };
    super(nativeElement);
  }
}

describe('StoDatatableResizeDirective', () => {
  it('should create an instance', () => {
    const directive = new StoDatatableResizeDirective(new MockElementRef());
    expect(directive).toBeTruthy();
  });

  it('should add class', () => {
    const elRef = new MockElementRef();
    const spy = spyOn(elRef.nativeElement.classList, 'add');
    const directive = new StoDatatableResizeDirective(elRef);
    directive.ngAfterViewInit();
    expect(spy).toHaveBeenCalledWith('sto-mdl-table__header__row__cell__resize-handle');
  });

  it('should trigger onDragStart', () => {
    const event = {} as DragEvent;
    ( event as any ).dataTransfer = {
      dropEffect: null
    };
    const directive = new StoDatatableResizeDirective(new MockElementRef());
    directive.onDragStart(event);
    expect(event.dataTransfer.dropEffect).toBe('none');
    expect(directive.opacity).toBe(0);
  });

  it('should trigger onDrag', () => {
    const event = {} as DragEvent;
    ( event as any ).screenX = 30;
    ( event as any ).offsetX = 100;
    const directive = new StoDatatableResizeDirective(new MockElementRef());
    directive.column = {} as Column;
    const spy = spyOn(directive.resize, 'emit');
    directive.onDrag(event);
    expect(spy).toHaveBeenCalledWith(180);
  });

  it('should trigger onDragEnd', () => {
    const event = {} as DragEvent;
    ( event as any ).offsetX = 100;
    const directive = new StoDatatableResizeDirective(new MockElementRef());
    directive.column = {} as Column;
    const spy = spyOn(directive.resizeEnd, 'emit');
    directive.onDragEnd(event);
    expect(directive.opacity).toBe(1);
    expect(spy).toHaveBeenCalledWith(180);
  });
});
