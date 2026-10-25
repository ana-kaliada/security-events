import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
} from '@radix-ui/react-icons';
import { IconButton } from '@radix-ui/themes';
import type { SortDirection } from '../../table.types.ts';

type TableSortButtonProps = {
  ariaLabel: string;
  direction?: SortDirection;
  onClick: () => void;
};

export const TableSortButton = ({
  ariaLabel,
  direction,
  onClick,
}: TableSortButtonProps) => {
  const SortIcon =
    direction === 'asc'
      ? ArrowUpIcon
      : direction === 'desc'
        ? ArrowDownIcon
        : CaretSortIcon;

  return (
    <IconButton
      type="button"
      variant="ghost"
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <SortIcon aria-hidden="true" />
    </IconButton>
  );
};
