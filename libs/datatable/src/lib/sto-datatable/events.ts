import { Column } from './columns';

export interface ContextMenu {
  event: MouseEvent | KeyboardEvent;
  column: Column;
}

interface RowCtx<T extends object> {
  row: T;
  index: number;
}

export type RowContextMenu<T extends object> = ContextMenu & RowCtx<T>;
export type HeaderContextMenu = ContextMenu;

interface Activate<T extends object> {
  row: T;
  event: MouseEvent | KeyboardEvent;
  index: number;
  rowEl?: HTMLDivElement;
}

export interface RowSelection<T extends object> extends Activate<T> {
  event: MouseEvent | KeyboardEvent;
}

export interface RowActivation<T extends object> extends Activate<T> {
  event: KeyboardEvent;
}
