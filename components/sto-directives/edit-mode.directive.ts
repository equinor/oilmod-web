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
  @HostListener('click')
  onElementClick(event: MouseEvent) {
    this.dontToggle = true;
    this.isEditable = true;
    this.canEdit.emit(true);
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
      })
      .map(e =>  Array.from(e.classList))
      .reduce((a, b) => [...a, ...b], [])
      .filter(c =>  this.dontToggleElements.indexOf(c) < 0)
      .length === 0;
    if (shouldClose) {
        this.isEditable = false;
        this.canEdit.emit(false);
    }
  }

  constructor(private el: ElementRef) {
  }

}
