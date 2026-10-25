import { Table as BaseTable } from '@radix-ui/themes';
import styles from './table-skeleton.module.css';

type TableSkeletonProps = {
  columnIds: readonly string[];
  rowCount: number;
};

export const TableSkeleton = ({
  columnIds,
  rowCount,
}: TableSkeletonProps) => {
  return Array.from({ length: rowCount }, (_, rowIndex) => (
    <BaseTable.Row key={`loading-${rowIndex}`} aria-hidden="true">
      {columnIds.map((columnId) => (
        <BaseTable.Cell key={columnId}>
          <span className={styles.skeleton} />
        </BaseTable.Cell>
      ))}
    </BaseTable.Row>
  ));
};
