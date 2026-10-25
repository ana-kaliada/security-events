import type { Key, ReactNode } from 'react';

export type SortDirection = 'asc' | 'desc';

export type TableSort<ColumnId extends string = string> = {
  columnId: ColumnId;
  direction: SortDirection;
};

export type TableColumn<Row, ColumnId extends string = string> = {
  id: ColumnId;
  label: ReactNode;
  ariaLabel?: string;
  renderCell: (row: Row) => ReactNode;
  rowHeader?: boolean;
  sortable?: boolean;
  width?: string;
};

export type TableProps<Row, ColumnId extends string = string> = {
  caption: string;
  columns: readonly TableColumn<Row, ColumnId>[];
  data: readonly Row[];
  getRowKey: (row: Row) => Key;
  isLoading?: boolean;
  rowCount?: number;
  emptyMessage?: string;
  errorMessage?: string;
  sort?: TableSort<ColumnId>;
  onSortChange?: (sort?: TableSort<ColumnId>) => void;
  renderRowActions?: (row: Row) => ReactNode;
};
