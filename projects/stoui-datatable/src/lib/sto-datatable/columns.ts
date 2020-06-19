import { TemplateRef } from '@angular/core';

export class Column {
  $$id?: string;
  prop: string;
  name: string;
  flexGrow?: number;
  flexBasis?: number;
  flexShrink?: number;
  sortable? = false;
  headerTemplate?: TemplateRef<any>;
  cellTemplate?: TemplateRef<any>;
  footerTemplate?: TemplateRef<any>;
  cellClass?: string | ClassFunction;
  headerClass?: string | ClassFunction;
  sortFn?: SortFunction;
  disableSort?: boolean;
  disableResize?: boolean;
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

type ClassFunction = <T = any, U = any>(value: T, row: U, column: Column) => string | string[];
type SortFunction = <T = any>(a: T, b: T, column: Column) => number;
