import { Table as BaseTable } from '@radix-ui/themes';
import { useState } from 'react';
import type { ColumnVisibilityOption } from './components/table-column-visibility-menu/table-column-visibility-menu.tsx';
import { TableHeader } from './components/table-header/table-header.tsx';
import { TableMessage } from './components/table-message/table-message.tsx';
import { TableRow } from './components/table-row/table-row.tsx';
import { TableSkeleton } from './components/table-skeleton/table-skeleton.tsx';
import type { TableProps } from './table.types.ts';
import styles from './table.module.css';

export const Table = <Row, ColumnId extends string>({
  caption,
  columns,
  data,
  getRowKey,
  isLoading = false,
  rowCount = 5,
  emptyMessage = 'No data available',
  errorMessage,
  sort,
  onSortChange,
}: TableProps<Row, ColumnId>) => {
  const [hiddenColumnIds, setHiddenColumnIds] = useState<Set<ColumnId>>(
    () => new Set(),
  );
  const visibleColumns = columns.filter(
    (column) => !hiddenColumnIds.has(column.id),
  );
  const visibleColumnIds = visibleColumns.map((column) => column.id);
  const visibilityOptions: readonly ColumnVisibilityOption<ColumnId>[] =
    columns.map((column) => ({
      id: column.id,
      label:
        column.ariaLabel ??
        (typeof column.label === 'string' ? column.label : column.id),
    }));

  const handleVisibilityChange = (columnId: ColumnId, visible: boolean) => {
    setHiddenColumnIds((currentColumnIds) => {
      const nextColumnIds = new Set(currentColumnIds);

      if (visible) {
        nextColumnIds.delete(columnId);
      } else {
        nextColumnIds.add(columnId);
      }

      return nextColumnIds;
    });

    if (!visible && sort?.columnId === columnId) {
      onSortChange?.(undefined);
    }
  };

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
        <TableHeader
          columns={visibleColumns}
          sort={sort}
          onSortChange={onSortChange}
          visibilityOptions={visibilityOptions}
          visibleColumnIds={visibleColumnIds}
          onVisibilityChange={handleVisibilityChange}
        />

        <BaseTable.Body>
          {isLoading
            ? <TableSkeleton
                columnIds={[
                  ...visibleColumns.map((column) => column.id),
                  'controls',
                ]}
                rowCount={rowCount}
              />
            : errorMessage
              ? <TableMessage
                  columnCount={visibleColumns.length + 1}
                  message={errorMessage}
                  type="error"
                />
              : data.length === 0
                ? <TableMessage
                    columnCount={visibleColumns.length + 1}
                    message={emptyMessage}
                    type="empty"
                  />
                : data.map((row) => (
                    <TableRow
                      columns={visibleColumns}
                      key={getRowKey(row)}
                      row={row}
                    />
                  ))}
        </BaseTable.Body>
      </BaseTable.Root>
    </>
  );
};
