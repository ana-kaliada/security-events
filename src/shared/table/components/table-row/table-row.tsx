import { Table as BaseTable } from '@radix-ui/themes';
import type { TableColumn } from '../../table.types.ts';
import styles from './table-row.module.css';

type TableRowProps<Row> = {
  columns: readonly TableColumn<Row>[];
  row: Row;
};

export const TableRow = <Row,>({ columns, row }: TableRowProps<Row>) => {
  return (
    <BaseTable.Row>
      {columns.map((column) => {
        const content = column.renderCell(row);

        return column.rowHeader ? (
          <BaseTable.RowHeaderCell className={styles.cell} key={column.id}>
            {content}
          </BaseTable.RowHeaderCell>
        ) : (
          <BaseTable.Cell className={styles.cell} key={column.id}>
            {content}
          </BaseTable.Cell>
        );
      })}
    </BaseTable.Row>
  );
};
