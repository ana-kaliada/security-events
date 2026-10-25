import type { Filters } from '../../worker/protocol.ts';

export type EventFiltersValue = Omit<Filters, 'title'>;

export type EventFiltersProps = {
  title: string;
  value: EventFiltersValue;
  onTitleChange: (value: string) => void;
  onChange: (value: EventFiltersValue) => void;
};

export {
  severityOptions,
  siteOptions,
  sourceOptions,
} from '../../shared/libs/event-options.ts';
