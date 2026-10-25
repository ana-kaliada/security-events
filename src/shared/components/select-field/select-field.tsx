import { Select, Text } from '@radix-ui/themes';
import { useId } from 'react';
import styles from './select-field.module.css';
import type { SelectFieldProps } from './select-field.types.ts';

const EMPTY_VALUE = '__all__';

export const SelectField = <Value extends string>({
  label,
  emptyLabel,
  options,
  value,
  onChange,
}: SelectFieldProps<Value>) => {
  const id = useId();

  return (
    <div className={styles.field}>
      <Text as="label" htmlFor={id} size="2">
        {label}
      </Text>
      <Select.Root
        value={value ?? EMPTY_VALUE}
        onValueChange={(nextValue) => {
          const option = options.find((item) => item.value === nextValue);
          onChange(option?.value);
        }}
      >
        <Select.Trigger id={id} />
        <Select.Content>
          <Select.Item value={EMPTY_VALUE}>{emptyLabel}</Select.Item>
          {options.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  );
};
