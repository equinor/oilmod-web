import { Column } from './columns';

export interface ContextMenu {
  event: MouseEvent | KeyboardEvent;
  column: Column;
}

interface RowCtx<T extends Record<string, unknown>> {
  row: T;
  index: number;
}

export type RowContextMenu<T extends Record<string, unknown>> = ContextMenu & RowCtx<T>;
export type HeaderContextMenu = ContextMenu;

interface Activate<T extends Record<string, unknown>> {
  row: T;
  event: MouseEvent | KeyboardEvent;
  index: number;
  rowEl?: HTMLDivElement;
}

export interface RowSelection<T extends Record<string, unknown>> extends Activate<T> {
  event: MouseEvent | KeyboardEvent;
}

export interface RowActivation<T extends Record<string, unknown>> extends Activate<T> {
  event: KeyboardEvent;
}
