import type { Key, ReactNode } from 'react';

export type TableColumn<Row> = {
  id: string;
  label: ReactNode;
  renderCell: (row: Row) => ReactNode;
  rowHeader?: boolean;
};

export type TableProps<Row> = {
  caption: string;
  columns: readonly TableColumn<Row>[];
  data: readonly Row[];
  getRowKey: (row: Row) => Key;
  isLoading?: boolean;
  rowCount?: number;
  emptyMessage?: string;
  errorMessage?: string;
};
