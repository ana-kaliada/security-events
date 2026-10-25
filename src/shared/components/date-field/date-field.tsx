import { Text, TextField } from '@radix-ui/themes';
import { useId } from 'react';
import styles from './date-field.module.css';
import type { DateFieldProps } from './date-field.types.ts';

export const DateField = ({
  label,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  ref,
}: DateFieldProps) => {
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
        type="date"
        value={value}
        aria-invalid={Boolean(error)}
        aria-required={required || undefined}
        aria-describedby={error ? errorId : undefined}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && (
        <Text color="red" id={errorId} role="alert" size="1">
          {error}
        </Text>
      )}
    </div>
  );
};
