import { Table as BaseTable } from '@radix-ui/themes';
import { TableHeader } from './components/table-header/table-header.tsx';
import { TableMessage } from './components/table-message/table-message.tsx';
import { TableRow } from './components/table-row/table-row.tsx';
import { TableSkeleton } from './components/table-skeleton/table-skeleton.tsx';
import type { TableProps } from './table.types.ts';
import styles from './table.module.css';

export const Table = <Row,>({
  caption,
  columns,
  data,
  getRowKey,
  isLoading = false,
  rowCount = 5,
  emptyMessage = 'No data available',
  errorMessage,
}: TableProps<Row>) => {
  const statusMessage = errorMessage
    ? `${caption} failed to load: ${errorMessage}`
    : isLoading
      ? `${caption} is loading`
      : data.length === 0
        ? `${caption} has no results`
        : `${caption} loaded`;

  return (
    <>
      <span className={styles.visuallyHidden} role="status">
        {statusMessage}
      </span>

      <BaseTable.Root className={styles.root} variant="surface">
        <caption className={styles.visuallyHidden}>{caption}</caption>
        <TableHeader columns={columns} />

        <BaseTable.Body>
          {isLoading
            ? <TableSkeleton
                columnIds={columns.map((column) => column.id)}
                rowCount={rowCount}
              />
            : errorMessage
              ? <TableMessage
                  columnCount={columns.length}
                  message={errorMessage}
                  type="error"
                />
              : data.length === 0
                ? <TableMessage
                    columnCount={columns.length}
                    message={emptyMessage}
                    type="empty"
                  />
                : data.map((row) => (
                    <TableRow
                      columns={columns}
                      key={getRowKey(row)}
                      row={row}
                    />
                  ))}
        </BaseTable.Body>
      </BaseTable.Root>
    </>
  );
};
