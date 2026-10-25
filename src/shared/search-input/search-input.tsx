import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { TextField } from '@radix-ui/themes';
import type { SearchInputProps } from './search-input.types.ts';

export const SearchInput = ({
  accessibleLabel,
  placeholder = 'Search',
  value,
  onChange,
}: SearchInputProps) => {
  return (
    <TextField.Root
      type="search"
      aria-label={accessibleLabel}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      <TextField.Slot>
        <MagnifyingGlassIcon aria-hidden="true" />
      </TextField.Slot>
    </TextField.Root>
  );
};
