import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Text, TextField } from '@radix-ui/themes';
import { useId } from 'react';
import styles from './search-input.module.css';
import type { SearchInputProps } from './search-input.types.ts';

export const SearchInput = ({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  type = 'text',
  ref,
}: SearchInputProps) => {
  const id = useId();
  const errorId = useId();

  return (
    <div className={styles.field}>
      <Text as="label" htmlFor={id} size="2">
        {label}
      </Text>
      <TextField.Root
        ref={ref}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        aria-invalid={Boolean(error)}
        aria-required={required || undefined}
        aria-describedby={error ? errorId : undefined}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
      >
        {type === 'search' && (
          <TextField.Slot>
            <MagnifyingGlassIcon aria-hidden="true" />
          </TextField.Slot>
        )}
      </TextField.Root>
      {error && (
        <Text color="red" id={errorId} role="alert" size="1">
          {error}
        </Text>
      )}
    </div>
  );
};
