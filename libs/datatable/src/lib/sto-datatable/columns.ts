import { TemplateRef } from '@angular/core';

export class Column {
  $$id?: string;
  prop: string;
  name: string;
  flexGrow?: number;
  flexBasis?: number;
  flexShrink?: number;
  sortable ? = false;
  headerTemplate?: TemplateRef<unknown>;
  cellTemplate?: TemplateRef<unknown>;
  footerTemplate?: TemplateRef<unknown>;
  cellClass?: string | ClassFunction;
  headerClass?: string | ClassFunction;
  sortFn?: SortFunction;
  disableSort?: boolean;
  disableResize?: boolean;
  sortArrowPosition?: 'before' | 'after';
}

export class Group {
  props: Array<string>;
  name?: string;
}

export class ColumnGroup {
  name: string;
  columnStart: number;
  columnEnd: number;
  transform?: string;
}

export enum ColumnDisplay {
  Flex = 'flex',
  Force = 'force'
}

type ClassFunction = <T, U>(value: T, row: U, column: Column) => string | string[];
type SortFunction = <T>(a: T, b: T, column: Column) => number;
