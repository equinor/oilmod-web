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
}

export class ColumnGroup {
  name: string;
  columnStart: number;
  columnEnd: number;
  transform?: string;
}

type ClassFunction = <T = any, U = any>(value: T, row: U, column: Column) => string | string[];
