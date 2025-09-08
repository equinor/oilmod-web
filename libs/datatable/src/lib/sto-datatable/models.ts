export interface SortColumn {
  id: string;
  sortDir: 'asc' | 'desc' | null;
}

export type rowClassFn = (row: any) => string;
