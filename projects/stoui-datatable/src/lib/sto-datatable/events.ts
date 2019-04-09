import { Column } from './columns';

export interface ContextMenu {
  event: MouseEvent & KeyboardEvent;
  column: Column;
}

interface RowCtx<T = any> {
  row: T;
  index: number;
}

export type RowContextMenu<T> = ContextMenu & RowCtx<T>;
export type HeaderContextMenu = ContextMenu;

interface Activate<T = any> {
  row: T;
  event: MouseEvent | KeyboardEvent;
  index: number;
  rowEl?: HTMLDivElement;
}

export interface RowSelection<T = any> extends Activate<T> {
  event: MouseEvent;
}

export interface RowActivation<T = any> extends Activate<T> {
  event: KeyboardEvent;
}
