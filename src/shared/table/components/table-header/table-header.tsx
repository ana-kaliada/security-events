import { Table as BaseTable } from '@radix-ui/themes';
import type { TableColumn } from '../../table.types.ts';

type TableHeaderProps<Row> = {
  columns: readonly TableColumn<Row>[];
};

export const TableHeader = <Row,>({ columns }: TableHeaderProps<Row>) => {
  return (
    <BaseTable.Header>
      <BaseTable.Row>
        {columns.map((column) => (
          <BaseTable.ColumnHeaderCell key={column.id}>
            {column.label}
          </BaseTable.ColumnHeaderCell>
        ))}
      </BaseTable.Row>
    </BaseTable.Header>
  );
};
