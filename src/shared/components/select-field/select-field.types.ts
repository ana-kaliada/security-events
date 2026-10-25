export type SelectOption<Value extends string> = {
  label: string;
  value: Value;
};

export type SelectFieldProps<Value extends string> = {
  label: string;
  emptyLabel: string;
  options: readonly SelectOption<Value>[];
  value?: Value;
  onChange: (value?: Value) => void;
};
