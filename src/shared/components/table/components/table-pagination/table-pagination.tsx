import { Button, Select, Text } from '@radix-ui/themes';
import { useId } from 'react';
import type { TablePaginationProps } from './table-pagination.types.ts';
import styles from './table-pagination.module.css';

export const TablePagination = ({
  page,
  pageSize,
  pageSizeOptions,
  total,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) => {
  const pageSizeId = useId();
  const totalPages = Math.max(1, Math.ceil(total / Number(pageSize)));

  return (
    <nav aria-label="Table pagination">
      <div className={styles.root}>
        <div className={styles.pageSize}>
          <Text as="label" htmlFor={pageSizeId}>
            Rows per page
          </Text>
          <Select.Root
            value={String(pageSize)}
            onValueChange={onPageSizeChange}
          >
            <Select.Trigger id={pageSizeId} />
            <Select.Content>
              {pageSizeOptions.map((option) => (
                <Select.Item key={option} value={option}>
                  {option}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>

        <div className={styles.controls}>
          <Button
            type="button"
            variant="soft"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <Text aria-live="polite">
            Page {page} of {totalPages}
          </Text>
          <Button
            type="button"
            variant="soft"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </nav>
  );
};
