import { Table as BaseTable, Text } from '@radix-ui/themes';
import styles from './table-message.module.css';

type TableMessageProps = {
  columnCount: number;
  message: string;
  type: 'empty' | 'error';
};

export const TableMessage = ({
  columnCount,
  message,
  type,
}: TableMessageProps) => {
  return (
    <BaseTable.Row>
      <BaseTable.Cell className={styles.cell} colSpan={columnCount}>
        <Text color={type === 'error' ? 'red' : undefined}>
          {message}
        </Text>
      </BaseTable.Cell>
    </BaseTable.Row>
  );
};
