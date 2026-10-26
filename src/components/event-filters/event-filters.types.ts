import type { Filters } from '../../worker/protocol.ts';

export type EventFiltersProps = {
  value: Filters;
  onChange: (value: Filters, options?: { replace?: boolean }) => void;
};
