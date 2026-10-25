import { Flex, Table as BaseTable } from '@radix-ui/themes';
import {
  TableColumnVisibilityMenu,
  type ColumnVisibilityOption,
} from '../table-column-visibility-menu/table-column-visibility-menu.tsx';
import { TableSortButton } from '../table-sort-button/table-sort-button.tsx';
import type { TableColumn, TableSort } from '../../table.types.ts';

type TableHeaderProps<Row, ColumnId extends string> = {
  columns: readonly TableColumn<Row, ColumnId>[];
  sort?: TableSort<ColumnId>;
  onSortChange?: (sort?: TableSort<ColumnId>) => void;
  visibilityOptions: readonly ColumnVisibilityOption<ColumnId>[];
  visibleColumnIds: readonly ColumnId[];
  onVisibilityChange: (columnId: ColumnId, visible: boolean) => void;
};

export const TableHeader = <Row, ColumnId extends string>({
  columns,
  sort,
  onSortChange,
  visibilityOptions,
  visibleColumnIds,
  onVisibilityChange,
}: TableHeaderProps<Row, ColumnId>) => {
  return (
    <BaseTable.Header>
      <BaseTable.Row>
        {columns.map((column) => {
          const isSorted = sort?.sortBy === column.id;
          const nextSort = !isSorted
            ? { sortBy: column.id, sortType: 'asc' as const }
            : sort.sortType === 'asc'
              ? { sortBy: column.id, sortType: 'desc' as const }
              : undefined;
          const accessibleLabel =
            column.ariaLabel ??
            (typeof column.label === 'string' ? column.label : column.id);
          const sortActionLabel = !isSorted
            ? `Sort ${accessibleLabel} ascending`
            : sort.sortType === 'asc'
              ? `Sort ${accessibleLabel} descending`
              : `Clear ${accessibleLabel} sorting`;

          return (
            <BaseTable.ColumnHeaderCell
              key={column.id}
              width={column.width}
              aria-sort={
                column.sortable && isSorted
                  ? sort.sortType === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : undefined
              }
            >
              {column.sortable && onSortChange ? (
                <Flex align="center" gap="3">
                  {column.label}
                  <TableSortButton
                    ariaLabel={sortActionLabel}
                    direction={isSorted ? sort.sortType : undefined}
                    onClick={() => onSortChange(nextSort)}
                  />
                </Flex>
              ) : (
                column.label
              )}
            </BaseTable.ColumnHeaderCell>
          );
        })}
        <BaseTable.ColumnHeaderCell justify="end" width="96px">
          <TableColumnVisibilityMenu
            columns={visibilityOptions}
            visibleColumnIds={visibleColumnIds}
            onVisibilityChange={onVisibilityChange}
          />
        </BaseTable.ColumnHeaderCell>
      </BaseTable.Row>
    </BaseTable.Header>
  );
};
