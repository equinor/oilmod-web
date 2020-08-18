import { StoDatatableResizeDirective } from './sto-datatable-resize.directive';
import { ElementRef } from '@angular/core';

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

  it('should trigger onMouseUp after mouseup event is dispatched', () => {
    const directive = new StoDatatableResizeDirective(new MockElementRef());
    const spy = spyOn(directive, 'onMouseUp');
    directive.column = { prop: '', name: '', flexBasis: 80 };
    const event = {} as MouseEvent;
    ( event as any ).type = 'mousedown';
    ( event as any ).screenX = 200;
    ( event as any ).stopPropagation = () => {
    };
    const upEvent = new Event('mouseup');
    directive.onMouseDown(event);
    expect(spy).toHaveBeenCalledTimes(0);
    document.dispatchEvent(upEvent);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
