import { Button, Flex, Text, TextField } from '@radix-ui/themes';
import { useId } from 'react';
import { SearchInput } from '../../../../shared/components/search-input';
import { SelectField } from '../../../../shared/components/select-field';
import { formatLocalDate } from '../../../../shared/utils/format-local-date.ts';
import styles from './event-filters.module.css';
import {
  type EventFiltersProps,
  severityOptions,
  siteOptions,
  sourceOptions,
} from './event-filters.types.ts';

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
          value={
            value.occurredAt === undefined
              ? ''
              : formatLocalDate(value.occurredAt)
          }
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
