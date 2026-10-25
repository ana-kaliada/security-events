import { useCallback } from 'react';
import type { UseFormSetError } from 'react-hook-form';
import { createEvent, updateEvent } from '../../../../worker/client/client.ts';
import type { EventRecord } from '../../../../worker/protocol.ts';
import {
  toOccurredAt,
  type EventFormValues,
} from '../componets/event-update-form/event-update-form.schema.ts';

type UseEventFormSubmitParams = {
  event: EventRecord | null;
  setError: UseFormSetError<EventFormValues>;
  onSuccess: (message: string) => void;
};

export const useEventFormSubmit = ({
  event,
  setError,
  onSuccess,
}: UseEventFormSubmitParams) => {
  return useCallback(
    async (values: EventFormValues) => {
      const input = {
        title: values.title,
        occurredAt: toOccurredAt(values.occurredAt),
        severity: values.severity,
        source: values.source,
        site: values.site,
      };

      try {
        if (event) {
          await updateEvent(event.id, input);
          onSuccess('Event updated');
        } else {
          await createEvent(input);
          onSuccess('Event created');
        }
      } catch (error) {
        setError('root', {
          message:
            error instanceof Error ? error.message : 'Failed to save event',
        });
      }
    },
    [event, onSuccess, setError],
  );
};
