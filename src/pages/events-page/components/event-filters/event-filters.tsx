import { Button, Flex, Text, TextField } from '@radix-ui/themes';
import { useId } from 'react';
import { SearchInput } from '../../../../shared/search-input';
import { SelectField } from '../../../../shared/select-field';
import {
  severities,
  sites,
  sources,
  type Filters,
} from '../../../../worker/protocol.ts';
import styles from './event-filters.module.css';

export type EventFiltersValue = Omit<Filters, 'title'>;

type EventFiltersProps = {
  title: string;
  value: EventFiltersValue;
  onTitleChange: (value: string) => void;
  onChange: (value: EventFiltersValue) => void;
};

const severityOptions = severities.map((severity) => ({
  label: severity,
  value: severity,
}));

const sourceOptions = sources.map((source) => ({
  label: source,
  value: source,
}));

const siteOptions = sites.map((site) => ({
  label: site,
  value: site,
}));

const formatDateInput = (timestamp?: number) => {
  if (timestamp === undefined) return '';

  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const EventFilters = ({
  title,
  value,
  onTitleChange,
  onChange,
}: EventFiltersProps) => {
  const dateId = useId();
  const hasActiveFilters = Object.values(value).some(
    (filterValue) => filterValue !== undefined,
  );

  return (
    <Flex align="end" gap="3" wrap="wrap">
      <div className={styles.search}>
        <SearchInput
          accessibleLabel="Search events by title"
          placeholder="Search by title"
          value={title}
          onChange={onTitleChange}
        />
      </div>

      <SelectField
        label="Severity"
        emptyLabel="All severities"
        options={severityOptions}
        value={value.severity}
        onChange={(severity) => onChange({ ...value, severity })}
      />

      <SelectField
        label="Source"
        emptyLabel="All sources"
        options={sourceOptions}
        value={value.source}
        onChange={(source) => onChange({ ...value, source })}
      />

      <SelectField
        label="Site"
        emptyLabel="All sites"
        options={siteOptions}
        value={value.site}
        onChange={(site) => onChange({ ...value, site })}
      />

      <div className={styles.field}>
        <Text as="label" htmlFor={dateId} size="2">
          Occurred on
        </Text>
        <TextField.Root
          id={dateId}
          type="date"
          value={formatDateInput(value.occurredAt)}
          onChange={(event) =>
            onChange({
              ...value,
              occurredAt: event.target.value
                ? new Date(`${event.target.value}T00:00:00`).getTime()
                : undefined,
            })
          }
        />
      </div>

      <Button
        type="button"
        variant="soft"
        disabled={!hasActiveFilters}
        onClick={() => onChange({})}
      >
        Reset filters
      </Button>
    </Flex>
  );
};
