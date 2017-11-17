import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[stoEditMode]'
})
/**
 * Directive to toggle edit mode on elements (cards)
 * adds class 'is-highlighted' to elements when editable is toggled on.
 */
export class EditModeDirective {
  @HostBinding('class.is-highlighted') isEditable: boolean;
  /**
   * A string array, where ignored elements can be passed in (classes & tags)
   * @type {Array}
   */
  @Input() dontToggleElements: string[] = [];
  @Input() disabled: boolean;
  /**
   * Emits a boolean value, telling the parent if edit mode is on or off
   * @type {EventEmitter<boolean>}
   */
  @Output() canEdit = new EventEmitter<boolean>();
  private dontToggle: boolean;

  /**
   * Listen for click events on the current element
   * @param {MouseEvent} event
   */
  @HostListener('click', ['$event'])
  onElementClick(event: MouseEvent) {
    const classList = Array.from(this.el.nativeElement.classList);
    if (classList.indexOf('can-edit') < 0) {
      return;
    }
    this.dontToggle = true;
    const isEditable = this.isEditable;
    this.isEditable = true;
    this.canEdit.emit(true);
    const el = event.target['tagName'].toLowerCase();
    if (!isEditable) {
      this.focusFirstField();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const classList = Array.from(this.el.nativeElement.classList);
    if (classList.indexOf('can-edit') < 0) {
      return;
    }
    if (event.keyCode === 13) {
      this.dontToggle = true;
      this.isEditable = true;
      this.canEdit.emit(true);
      this.focusFirstField();
    } else if (event.keyCode === 27) {
      this.dontToggle = false;
      this.isEditable = false;
      this.canEdit.emit(false);
    }
  }

  /**
   * Listen for global mouse clicks, and toggle edit mode off
   * Ignore if element is not editable, and target is not self
   * @param {MouseEvent} event
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.isEditable) {
      return;
    }
    const path: Element[] = event['path'];
    if (this.dontToggle) {
      this.dontToggle = false;
      return;
    }
    /**
     * Loop over and filter out any non-ignored elements
     * If any non-ignored elements are found, do nothing - otherwise, turn off edit mode.
     * @type {boolean}
     */
    let shouldClose = path.filter(e => e.tagName)
      .filter(e => {
        return this.dontToggleElements.indexOf(e.tagName.toLowerCase()) >= 0;
      }).length === 0;
    if (shouldClose) {
      shouldClose = path.filter(e => e.tagName)
        .map(e => Array.from(e.classList))
        .reduce((a, b) => [...a, ...b], [])
        .filter(c => this.dontToggleElements.indexOf(c) >= 0).length === 0;
    }
    if (shouldClose) {
      this.isEditable = false;
      this.canEdit.emit(false);
    }
  }

  private focusFirstField() {
    setTimeout(() => {
      const self = this.el.nativeElement;
      const inputs = Array.from(self.getElementsByTagName('input'));
      const textAreas = Array.from(self.getElementsByTagName('textarea'));
      const selects = Array.from(self.getElementsByTagName('mat-select'));
      const allInputs = [...inputs, ...selects, ...textAreas]
        .filter((el: HTMLInputElement) => !(el.readOnly))
        .sort((a: any, b: any) => {
          if (a === b) {
            return 0;
          } else if (a.compareDocumentPosition(b) & 2) {
            return 1;
          }
          return -1;
        }) as any[];
      const inp: HTMLInputElement = allInputs[0];
      if (inp) {
        let tick = 0;
        inp.scrollIntoView({ behavior: 'smooth' });
        const interval = setInterval(() => {
          tick += 1;
          const rect = inp.getBoundingClientRect();
          if (
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
          ) {
            inp.focus();
            clearInterval(interval);
          }
          if (tick >= 100) {
            inp.focus();
            clearInterval(interval);
          }
        }, 25);
      }
    }, 0);
  }

  constructor(private el: ElementRef) {
  }

}
