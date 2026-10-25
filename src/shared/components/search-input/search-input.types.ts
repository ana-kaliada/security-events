import type { Ref } from 'react';

export type SearchInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  type?: 'text' | 'search';
  ref?: Ref<HTMLInputElement>;
};
