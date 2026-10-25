import { ColumnsIcon } from '@radix-ui/react-icons';
import { DropdownMenu, IconButton } from '@radix-ui/themes';

export type ColumnVisibilityOption<ColumnId extends string> = {
  id: ColumnId;
  label: string;
};

type ColumnVisibilityMenuProps<ColumnId extends string> = {
  columns: readonly ColumnVisibilityOption<ColumnId>[];
  visibleColumnIds: readonly ColumnId[];
  onVisibilityChange: (columnId: ColumnId, visible: boolean) => void;
};

export const TableColumnVisibilityMenu = <ColumnId extends string>({
  columns,
  visibleColumnIds,
  onVisibilityChange,
}: ColumnVisibilityMenuProps<ColumnId>) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton
          type="button"
          variant="ghost"
          aria-label="Manage column visibility"
        >
          <ColumnsIcon aria-hidden="true" />
        </IconButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align="end">
        {columns.map((column) => (
          <DropdownMenu.CheckboxItem
            key={column.id}
            checked={visibleColumnIds.includes(column.id)}
            onCheckedChange={(checked) =>
              onVisibilityChange(column.id, checked === true)
            }
            onSelect={(event) => event.preventDefault()}
          >
            {column.label}
          </DropdownMenu.CheckboxItem>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
