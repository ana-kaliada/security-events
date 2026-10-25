import { yupResolver } from '@hookform/resolvers/yup';
import { Text } from '@radix-ui/themes';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DateField } from '../../../../../shared/components/date-field';
import { SearchInput } from '../../../../../shared/components/search-input';
import { SelectField } from '../../../../../shared/components/select-field';
import {
  severityOptions,
  siteOptions,
  sourceOptions,
} from '../../../../../shared/event-options.ts';
import styles from './event-update-form.module.css';
import {
  createEventFormValues,
  eventUpdateFormSchema,
  type EventFormValues,
} from './event-update-form.schema.ts';
import { useEventFormSubmit } from '../../hooks/use-event-form-submit.ts';
import type { EventFormProps } from './event-update-form.types.ts';

export const EventUpdateForm = ({
  event,
  formId,
  onSubmittingChange,
  onSuccess,
}: EventFormProps) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    defaultValues: createEventFormValues(event),
    resolver: yupResolver(eventUpdateFormSchema),
  });
  const onSubmit = useEventFormSubmit({ event, setError, onSuccess });

  useEffect(() => {
    onSubmittingChange(isSubmitting);

    return () => onSubmittingChange(false);
  }, [isSubmitting, onSubmittingChange]);

  const titleError = errors.title?.message;
  const occurredAtError = errors.occurredAt?.message;

  return (
    <form className={styles.form} id={formId} onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <SearchInput
            ref={field.ref}
            label="Title"
            required
            value={field.value}
            onBlur={field.onBlur}
            onChange={field.onChange}
            error={titleError}
          />
        )}
      />
      <Controller
        name="occurredAt"
        control={control}
        render={({ field }) => (
          <DateField
            ref={field.ref}
            label="Occurred on"
            required
            value={field.value}
            onBlur={field.onBlur}
            onChange={field.onChange}
            error={occurredAtError}
          />
        )}
      />

      <Controller
        name="severity"
        control={control}
        render={({ field }) => (
          <SelectField
            label="Severity"
            options={severityOptions}
            value={field.value}
            onChange={(severity) => {
              if (severity) field.onChange(severity);
            }}
          />
        )}
      />
      <Controller
        name="source"
        control={control}
        render={({ field }) => (
          <SelectField
            label="Source"
            options={sourceOptions}
            value={field.value}
            onChange={(source) => {
              if (source) field.onChange(source);
            }}
          />
        )}
      />
      <Controller
        name="site"
        control={control}
        render={({ field }) => (
          <SelectField
            label="Site"
            options={siteOptions}
            value={field.value}
            onChange={(site) => {
              if (site) field.onChange(site);
            }}
          />
        )}
      />

      {errors.root?.message && (
        <Text color="red" role="alert" size="2">
          {errors.root.message}
        </Text>
      )}
    </form>
  );
};
