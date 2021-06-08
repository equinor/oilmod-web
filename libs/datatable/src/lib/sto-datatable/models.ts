export interface SortColumn {
  id: string;
  sortDir: 'asc' | 'desc' | null;
}

export type rowClassFn = <T>(row: T) => string;
