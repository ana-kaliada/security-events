import type { Ref } from 'react';

export type DateFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  ref?: Ref<HTMLInputElement>;
};
