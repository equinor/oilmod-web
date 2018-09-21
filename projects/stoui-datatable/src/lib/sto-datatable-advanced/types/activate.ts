export interface Activate<T = any> {
  event: KeyboardEvent;
  row: T;
  rowElement: HTMLElement;
  type: 'keydown'|'mouseenter'|'mouseleave';
}
