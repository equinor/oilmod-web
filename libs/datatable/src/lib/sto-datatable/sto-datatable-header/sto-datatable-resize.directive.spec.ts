import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StoDatatableResizeDirective } from './sto-datatable-resize.directive';

describe('StoDatatableResizeDirective (inject())', () => {
  let directive: StoDatatableResizeDirective;
  let nativeElement: any;

  beforeEach(() => {
    nativeElement = {
      classList: {
        add: jest.fn(),
        contains: (cls: string) =>
          cls === 'sto-mdl-table__header__row__cell__resize-handle',
      },
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useValue: new ElementRef(nativeElement) },
      ],
    });
    TestBed.runInInjectionContext(() => {
      directive = new StoDatatableResizeDirective();
    });
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should trigger onMouseUp after mouseup event is dispatched', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useValue: new ElementRef(nativeElement) },
      ],
    });
    TestBed.runInInjectionContext(() => {
      directive = new StoDatatableResizeDirective();
      // Set column input using TestBed's input setting mechanism
      Object.defineProperty(directive, 'column', {
        value: () => ({ prop: '', name: '', flexBasis: 80 }),
        writable: false,
        configurable: true,
      });
    });
    const spy = jest.spyOn(directive as any, 'onMouseUp');
    const down = {
      screenX: 200,
      stopPropagation: () => {},
    } as unknown as MouseEvent;
    directive.onMouseDown(down);
    expect(spy).toHaveBeenCalledTimes(0);
    document.dispatchEvent(new Event('mouseup'));
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
